import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI(
    {
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: 'https://api.aimlapi.com',
        dangerouslyAllowBrowser: true
    }
)

class ActionProvider {

    createChatBotMessage
    setState
    createClientMessage
    stateRef
    createCustomMessage

    constructor(createChatBotMessage,
        setStateFunc,
        createClientMessage,
        stateRef,
        createCustomMessage,
        ...rest
    ){
            this.createChatBotMessage=createChatBotMessage;
            this.setState=setStateFunc;
            this.createClientMessage=createClientMessage;
            this.stateRef=stateRef;
            this.createCustomMessage=createCustomMessage
        
    }

    callGenAI=async(prompt)=>{
        try {
            const chatCompletion=await openai.chat.completions.create({
                model:'gpt-3.5-turbo',
                messages:[
                    {role:"system",content:"You are credit card advisor for the India market"},
                    {role:'user',content:prompt}
                ],
                temperature:0.5,
                max_tokens:50 
            });
            return chatCompletion.choices[0].message.content;
        } catch (error) {
            console.error("Error calling OpenAI API:", error);
            return "Sorry, I couldn't process your request.";
        }
    }

    timer= ms=> new Promise(res=>setTimeout(res,ms));

    generateResponseMessage=async(userMessage)=>{
        if (!userMessage) {
            console.error("userMessage is not defined");
            return;
        }

        const responseFromGPT=await this.callGenAI(userMessage);
        let message;
        let numberNoLines=responseFromGPT.split('\n').length;
        for(let i=0;i<numberNoLines;i++){
            const msg=responseFromGPT.split('\n')[i];
            if(msg.length){
                message=this.createChatBotMessage(msg);
                this.updateChatBotMessage(message);
            }
            await this.timer(1000);
        }
    }

    respond=(message)=>{
        this.generateResponseMessage(message);
    }

    updateChatBotMessage=(message)=>{
        this.setState(prevState=>({
            ...prevState,
            messages: [...prevState.messages, message]
        }))
    }
}

export default ActionProvider;