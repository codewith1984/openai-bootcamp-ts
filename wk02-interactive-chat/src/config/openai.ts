import OpenAI from 'openai';
import dotenv from 'dotenv'

//load env variable from .env file
dotenv.config()

//Validate that API key exists from .env file
if(!process.env.OPENAI_API_KEY){
    throw new Error('OPENAPI_API_KEY is required in .env file')
}

//create an export OpenAI client
export const openai = new OpenAI({
    apiKey : process.env.OPENAI_API_KEY,
})

