import 'dotenv/config'
import {ChatOpenAI} from "@langchain/openai"
import {HumanMessage,SystemMessage} from "@langchain/core/messages";


const chatOpenRouter = new ChatOpenAI({
    model: "deepseek/deepseek-chat-v3-0324:free",
    apiKey: process.env.OPENROUTER_API_KEY,
    configuration:{
        baseURL:"https://openrouter.ai/api/v1",
        defaultHeaders:{
            'X-Title':"langchain-openrouter-101"
        }
    }
})
async  function main(){

    const message =[new SystemMessage('Limit the answer to 2 paragraphs'), new HumanMessage({content:"What is kafka? and how is it useful in event driven architecture"})]

    console.log('...CALLING LLM...')
    console.log('...STARTING STREAMING RESPONSE ...')
    const response = await chatOpenRouter.stream(message)

  for await (const chunk of response) {
      console.log(chunk.content)
  }

}
main().catch(console.error).then(()=> console.log('...STREAMING RESPONSE END...'))