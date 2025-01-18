'use client'
import config from "../config"
import ChatBot from "react-chatbot-kit"
import 'react-chatbot-kit/build/main.css'
import ActionProvider from "../Actionprovider"
import MessageParser from "./MessageParser"

const ChatComponent=()=>{
    return(
        <div>
            <ChatBot 
           config={config}
           actionProvider={ActionProvider}
           messageParser={MessageParser}
           />

        </div>   
    )
}
export default ChatComponent;