import * as readLine from 'readline'
import { ChatService } from './services/chatService'
import { start } from 'repl'
import { error } from 'console'

const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
})

//Initialize chat service
const chatService = new ChatService()

//Display welcome message
function showWelcome():void{
    console.log('🤖 Welcome to the Interactive OpenAI Chat Bot!')
    console.log('================================')
    console.log('Type your message and press Enter to chat')
    console.log('/history - Show conversation history')
    console.log('/clear - Clear conversation history')
    console.log('/exit - Exit the chat')
    console.log('================================')
}

//Process user commands
async function processCommand(input: string): Promise<boolean> {
    const command = input.trim().toLowerCase()

    switch(command){
        case '/exit':
            console.log('👋 Exiting chat. Goodbye!')
            rl.close()
            return false;

        case '/clear':
            chatService.clearHistory()
            console.log('🧹 Conversation history cleared')
            return true;

        case '/history':
            const history = chatService.getHistory()
            if(history.length === 0){
                console.log('No conversation history')
            }else{
                console.log('🕒 Conversation History:')
                history.forEach((msg, index) => {
                    const speaker = msg.role === 'user' ? '👤 You' : '🤖 Assistant';
                    console.log(`${speaker}: ${msg.content} \n`)
                    
                })

            }
            return true;

        default:
            return true;
            
        }
}

//Main chat loop
async function startChat(): Promise<void>{
    showWelcome()

    while(true){
        //get user input
        const userInput = await new Promise<string>(resolve => {
            rl.question('👤 You: ', resolve)
        })

        //Check if its a command
        if(userInput.startsWith('/')){
            const shouldContinue = await processCommand(userInput)
            if(!shouldContinue) break;
            continue;
        }

        //Skip empty messages
        if(userInput.trim()){
            console.log('Please enter a message or use /exit or quit. \n')
        }

        try{
            //Show typing indicator
            process.stdout.write('🤖 Assistant is typing...\r')

            //Get response from openAI
            const response = await chatService.getChatResponse(userInput)

            //Clear typing indicator and show response
            process.stdout.write('\r 🤖 Assistant:  ')
            console.log(`${response}\n`)

        }catch(error){
            console.error('Error occurred while getting response:', error)
        }
    }
    rl.close()
}

//Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error)
    rl.close()
    process.exit(1)
})

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason)
    rl.close()
    process.exit(1)
});

//Start the chat application
startChat().catch((error) => {
    console.error('Fatal error starting chat:', error)
    rl.close()
    process.exit(1)
});

