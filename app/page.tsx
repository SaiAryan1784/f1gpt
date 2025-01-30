"use client"
import React from 'react'
import Image from 'next/image'
import f1GPTLogo from '../public/F1GPT.png'
// import BG from '../public/bg.png'
import { useChat } from 'ai/react'
import { Message } from 'ai/react'
import Bubble from './components/Bubble'
import PromptSuggestionsRow from './components/PromptSuggestionsRow'
import LoadingBubble from './components/LoadingBubble'

const Home = () => {
    const { append, messages, input, handleInputChange, isLoading } = useChat()
    const noMessages = !messages || messages.length === 0

    // const handlePrompt = (promptText: string) => {
    //     const msg: Message = {
    //         id: crypto.randomUUID(),
    //         content: promptText,
    //         role: "user"
    //     }
    //     append(msg)
    // }

    const PromptSubmit = async (promptText : string) => {

        // Append the user message to the chat
        const msg: Message = {
            id: crypto.randomUUID(),
            content: promptText,
            role: "user",
        }
        append(msg)

        try {
            // Send the message to the backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: [...messages, msg] }), // Send all messages including the current one
            });

            // If the response is not ok, handle the error
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Assuming the backend returns a plain text or HTML response
            const data = await response.text();  // Get raw text (could be HTML or other content)

            const cleanResponse = data.replace(/<think>.*?<\/think>/gs, '').trim(); 

            // Create the AI message from the cleaned response
            const aiMessage: Message = {
                id: crypto.randomUUID(),
                content: cleanResponse || "Sorry, I couldn't get the information.", // Default response if nothing is returned
                role: "assistant",
            };

            append(aiMessage); // Append the AI message to the chat

        } catch (error) {
            console.error('Error:', error);

            // Append error message when the request fails
            const aiMessage: Message = {
                id: crypto.randomUUID(),
                content: "Sorry, something went wrong. Please try again later.",
                role: "assistant",
            };
            append(aiMessage);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Check if there's any user input
        if (!input.trim()) {
            return; // Don't submit if input is empty
        }

        // Append the user message to the chat
        const msg: Message = {
            id: crypto.randomUUID(),
            content: input,
            role: "user",
        }
        append(msg)

        handleInputChange('');

        try {
            // Send the message to the backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: [...messages, msg] }), // Send all messages including the current one
            });

            // If the response is not ok, handle the error
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Assuming the backend returns a plain text or HTML response
            const data = await response.text(); // Get raw text (could be HTML or other content)

            const cleanResponse = data.replace(/<think>.*?<\/think>/gs, '').trim(); 

            // Create the AI message from the cleaned response
            const aiMessage: Message = {
                id: crypto.randomUUID(),
                content: cleanResponse || "Sorry, I couldn't get the information.", // Default response if nothing is returned
                role: "assistant",
            };

                append(aiMessage); // Append the AI message to the chat

        } catch (error) {
            console.error('Error:', error);

            // Append error message when the request fails
            const aiMessage: Message = {
                id: crypto.randomUUID(),
                content: "Sorry, something went wrong. Please try again later.",
                role: "assistant",
            };
            append(aiMessage);
        }
    }

    return (
        <div className='p-5 w-[60vw] h-[80vh] flex items-center flex-col justify-between text-center bg-gray-400 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30'>
            <Image src={f1GPTLogo} alt='logo' width={175} height={175} className='rounded-lg' />
            <section className={noMessages ? "" : "h-[calc(80vh-150px)] flex flex-col justify-between w-full overflow-hidden"}>
                {noMessages ? (
                    <>
                        <p className='px-[80px]'>The ultimate place to ask F1 questions</p>
                        <br />
                        <PromptSuggestionsRow onPromptClick={PromptSubmit} />
                    </>
                ) : (
                    <>
                        {/* Messages container with scrollable area */}
                        <div className="flex flex-col overflow-y-auto h-full mb-2">
                            {messages.map((message, index) => <Bubble key={`message-${index}`} message={message} />)}
                            {isLoading && <LoadingBubble />}
                        </div>
                    </>
                )}

                {/* Input form */}
                <form className='h-14 w-[55vw] flex border-t-2 border-blue-400 pt-[20px] overflow-hidden rounded-b-[20px]'
                    onSubmit={handleSubmit}
                >
                    <input className='w-[85%] p-[10px] text-[15px] border-none focus:outline-none' type="text" onChange={handleInputChange} value={input} placeholder="Ask me something" />
                    <input className='w-[15%] text-[15px] border-none text-white bg-red-400 cursor-pointer focus:outline-none' type="submit" />
                </form>
            </section>
        </div>
    )
}

export default Home
