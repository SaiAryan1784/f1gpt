import { ChatGroq } from "@langchain/groq";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";
import "dotenv/config";

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

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace: ASTRA_DB_NAMESPACE});

export async function POST(req: Request) {
    try {
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
                    Use the below context to augment what you know about Formula One racing. 
                    The context will provide you with the most recent page data from Wikipedia, 
                    the official F1 website, and others. 
                    If the context doesn't include the information you need, answer based on your 
                    existing knowledge and don't mention the source of your information or 
                    what the context does or doesn't include. 
                    ONLY ANSWER QUESTIONS RELATED TO FORMULA 1. 
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
