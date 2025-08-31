import { time } from "console";

export class OpenAIErrorHandler{

    static handleOpenAIError(error: any){
        
        //Rate Limit error
        if(error.status === 429){
            return 'Rate limit exceeded. Please wait a moment before trying again'
        }

        if(error.status === 401){
            return 'Invalid API key. Please check your OpenAI API key'
        }

        if(error.status === 503){
            return 'OpenAI service temporarily unavailable. Retrying...'
        }

        if(error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED'){
            return 'Network Connection error. Check your internet connection'
        }
    }

    static logError(error: string) : void{
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] ❌ ${error}`)
    }
}