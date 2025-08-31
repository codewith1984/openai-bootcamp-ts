import {openai} from '../config/openai'
import {ChatMessage, ChatSession} from '../types/chat'
import { RetryUtils } from '../utils/retryUtils'
import { OpenAIErrorHandler } from '../utils/errorHandler';
import { Chat } from 'openai/resources';

export class ChatService{
    private session: ChatSession;

    constructor(){
        //Iniitalize new chat session
        this.session={
            id: `chat-${Date.now()}`,
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful programming assistant. Keey your responses concise and practical',
                    timestamp: new Date()
                }
            ],
            createdAt: new Date()
        }
    }


    addMessage(role: 'user' | 'assistant', content:string): void{
        this.session.messages.push({
            role, 
            content,
            timestamp: new Date()
        })
    }

    //Get chat completion with retry logic
    async getChatResponse(userMessage: string): Promise<string>{
        try{
            this.addMessage('user', userMessage)

            //Prepare message for OpenAI(exclide timestamp)
            const apiMesssages = this.session.messages.map(msg => ({
                role: msg.role,
                content : msg.content
            }))

            //Make API call with retry logic
            const response = await RetryUtils.withRetry(async() => {
                return await openai.chat.completions.create({
                    model: 'gpt-4.1-mini',
                    messages: apiMesssages,
                    max_tokens: 300,
                    temperature: 0.7
                })
            })

            //Extract assistant response
            const assistantMessage = response.choices[0]?.message?.content?.trim()
            if(!assistantMessage){
                throw new Error('No response from assistant')
            }

            //Add Assistant response to history
            this.addMessage('assistant', assistantMessage)
            
            return assistantMessage


        }catch(error){
            const errorMessage = OpenAIErrorHandler.handleOpenAIError(error)
            OpenAIErrorHandler.logError(errorMessage ?? 'Unknown error')
            throw new Error(errorMessage)

        }
    }

    getHistory(): ChatMessage[]{
        return this.session.messages.filter(msg => msg.role !== 'system')
    }

    clearHistory(): void{
        this.session.messages = this.session.messages.filter(msg => msg.role === 'system')
    }

}