import {openai} from './config/openai';

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

async function basicChatExample() {
    try{
        console.log('🤖 Starting OpenaAI Chat Example...\n');

        //Define the conversation messages
        const messages: ChatMessage[] = [
            {
                role: 'system',
                content: 'You are a helpful assistant that explains programming concept clearly'
            },
            {
                role: 'user',
                content: 'Explain what OpenAI in 2 sentences'
            }
        ];

        //Make API Call to OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages: messages,
            max_tokens: 150,
            temperature: 0.7
        })

        const response = completion.choices[0].message?.content;

        if(response){
            console.log('✅ OpenAI Response::')
            console.log(response)
            console.log('\n Usage Stats:: ')
            console.log('Token used : ${completion.usage?.total_tokens}')
        }else{
            console.log('❌ No response received from OpenAI')
        }
    } catch (error) {
        console.error('Error occurred while communicating with OpenAI API:\n', error);
    }
}

basicChatExample();