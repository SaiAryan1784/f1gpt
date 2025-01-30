/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataAPIClient } from "@datastax/astra-db-ts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import "dotenv/config"
import { ChatGroq } from "@langchain/groq";
import { HfInference } from "@huggingface/inference";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean"

const { 
    ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION, 
    ASTRA_DB_API_ENDPOINT, 
    ASTRA_DB_APPLICATION_TOKEN, 
    GROQ_API_KEY,
    HUGGINGFACE_API_KEY
} = process.env;

const groq = new ChatGroq({apiKey: GROQ_API_KEY});
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);



const F1Data = [
    'https://www.formula1.com/',
    'https://www.formula1.com/en/latest/all',
    'https://en.wikipedia.org/wiki/Formula_One',
    'https://www.formula1.com/en/drivers.html',
    'https://www.formula1.com/en/teams.html',
    'https://en.wikipedia.org/wiki/Auto_racing',
    'https://en.wikipedia.org/wiki/Formula_One_car',
    'https://en.wikipedia.org/wiki/Formula_One_regulations',
    'https://en.wikipedia.org/wiki/Formula_One#History',
    'https://en.wikipedia.org/wiki/Formula_One#Races',
    'https://en.wikipedia.org/wiki/Formula_One#Teams_and_drivers',
    'https://en.wikipedia.org/wiki/Formula_One#Circuits',
    'https://en.wikipedia.org/wiki/Formula_One#Media_coverage',
    'https://en.wikipedia.org/wiki/Formula_One#Economic_effects',
    'https://en.wikipedia.org/wiki/Formula_One#Criticism',
]

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db  = client.db(ASTRA_DB_API_ENDPOINT, {namespace: ASTRA_DB_NAMESPACE});

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap:100,
})

const createCollection = async (similarityMetric : SimilarityMetric = "dot_product") => {
    try {
        const res = await db.createCollection(ASTRA_DB_COLLECTION, {
            vector: {
                dimension: 512,
                metric: similarityMetric
            }
        })
        console.log(res)
    } catch (error) {
        console.error(error)
    }
}

const loadSampleData = async () => {
    const collection = await db.collection(ASTRA_DB_COLLECTION)
    for await (const url of F1Data) {
        const content = await scrapePage(url)
        const chunks = await splitter.splitText(content)
        for (const chunk of chunks){
            const embedding = await hf.featureExtraction({
                model:"mixedbread-ai/mxbai-embed-large-v1",
                inputs: chunk,
            })
            const vector = embedding

            const res = await collection.insertOne({
                $vector: vector,
                text: chunk,
            })
            console.log(res)
        }
    }
}

const scrapePage = async (url : string) => {
    const loader = new PuppeteerWebBaseLoader(url,
        {
            launchOptions: {
                headless: true,
            },
            gotoOptions: {
                waitUntil: "domcontentloaded",
            },
            evaluate: async(page, browser) => {
                const result = await page.evaluate(() => document.body.innerHTML)
                await browser.close()
                return result
            }
        }
    )
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, '')
}

createCollection().then(() => loadSampleData())