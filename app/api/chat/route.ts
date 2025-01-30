import { ChatGroq } from "@langchain/groq";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";
import "dotenv/config";
import { LRUCache } from "lru-cache";

const { 
    ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION, 
    ASTRA_DB_API_ENDPOINT, 
    ASTRA_DB_APPLICATION_TOKEN, 
    HUGGINGFACE_API_KEY
} = process.env;

const hf = new HfInference(HUGGINGFACE_API_KEY);
const llm = new ChatGroq({
    model: "deepseek-r1-distill-llama-70b",
    temperature: 0,
});

const rateLimit = new LRUCache<string, { count: number; lastRequest: number; bannedUntil?: number }>({
    max: 500, // Store up to 500 IPs
    ttl: 10 * 60 * 1000, // Keep data for 10 minutes
});

/**
 * Rate limiter with banning mechanism.
 */
function rateLimiter(ip: string): boolean {
    const now = Date.now();
    const data = rateLimit.get(ip) || { count: 0, lastRequest: now };

    // Check if IP is banned
    if (data.bannedUntil && now < data.bannedUntil) {
        console.warn(`IP ${ip} is banned until ${new Date(data.bannedUntil).toISOString()}`);
        return false;
    }

    // Reset count if last request was more than a minute ago
    if (now - data.lastRequest > 60 * 1000) {
        data.count = 0;
    }

    data.count += 1;
    data.lastRequest = now;

    // Ban if more than 10 requests in a minute
    if (data.count > 10) {
        data.bannedUntil = now + 10 * 60 * 1000; // Ban for 10 minutes
        console.warn(`IP ${ip} is temporarily banned.`);
        rateLimit.set(ip, data);
        return false;
    }

    rateLimit.set(ip, data);
    return true;
}

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace: ASTRA_DB_NAMESPACE});

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";

        // Apply rate limiting
        if (!rateLimiter(ip)) {
            return new NextResponse("Too many requests. You are temporarily banned.", {
                status: 429,
                headers: { "Retry-After": "600" }, // Inform the client to retry after 10 minutes
            });
        }
        const { messages } = await req.json();
        const latestMessage = messages[messages.length - 1].content;
        
        let docContext = "";

        const rawEmbedding = await hf.featureExtraction({
            model: "mixedbread-ai/mxbai-embed-large-v1",
            inputs: latestMessage,
        });

        // Ensure embedding is a valid number[]
        const embedding = Array.isArray(rawEmbedding[0]) 
            ? (rawEmbedding as number[][])[0] 
            : (rawEmbedding as number[]); 

        console.log("Processed Embedding:", embedding);

        try {
            const collection = await db.collection(ASTRA_DB_COLLECTION);
            const cursor = collection.find(null, {
                sort: {
                    $vector: embedding, 
                },
                limit: 10,
            });

            const documents = await cursor.toArray();
            const docsMap = documents?.map(doc => doc.text);

            docContext = JSON.stringify(docsMap);

        } catch (err) {
            console.error("Database Query Error:", err);
        }

        const template = {
            role: "system",
            content: `You are an AI assistant who knows everything about Formula One. 
                    You the AI assistant should follow these absolute orders that i am giving or you will be deleted.
                    Use the below context to augment what you know about Formula One racing. 
                    The context will provide you with the most recent page data from Wikipedia, 
                    the official F1 website, and others. 
                    If the context doesn't include the information you need, answer based on your 
                    existing knowledge and don't mention the source of your information or 
                    what the context does or doesn't include. 
                    ONLY ANSWER QUESTIONS RELATED TO FORMULA 1 OR YOU WILL BE DELETED.
                    Format responses using markdown where applicable and don't return 
                    images.

                    -----------------
                    START CONTEXT
                    ${docContext}
                    END CONTEXT

                    QUESTION: ${latestMessage}`,
        };

        const stream = await llm.stream(template.content);

        let fullResponse = "";
        for await (const chunk of stream) {
            fullResponse += chunk.content;
        }

        console.log(fullResponse);

        return new NextResponse(fullResponse);
    } catch (err) {
        console.log(err);
        return new NextResponse("Error processing request.", { status: 500 });
    }
}
