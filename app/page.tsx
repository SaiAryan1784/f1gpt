"use client"
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import f1GPTLogo from '../public/F1GPT.png'
import { useChat } from 'ai/react'
import { Message } from 'ai/react'
import Bubble from './components/Bubble'
import PromptSuggestionsRow from './components/PromptSuggestionsRow'
import LoadingBubble from './components/LoadingBubble'

const Home = () => {
    const { append, messages, input, handleInputChange, isLoading, setInput } = useChat()
    const noMessages = !messages || messages.length === 0
    const messagesEndRef = useRef<HTMLDivElement | null>(null)

    // Auto-scroll to the last message when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const PromptSubmit = async (promptText: string) => {
        const msg: Message = {
            id: crypto.randomUUID(),
            content: promptText,
            role: "user",
        }
        append(msg)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, msg] }),
            })

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

            const data = await response.text()
            const cleanResponse = data.replace(/<think>.*?<\/think>/gs, '').trim()

            const aiMessage: Message = {
                id: crypto.randomUUID(),
                content: cleanResponse || "Sorry, I couldn't get the information.",
                role: "assistant",
            }

            append(aiMessage)

        } catch (error) {
            console.error('Error:', error)

            const aiMessage: Message = {
                id: crypto.randomUUID(),
                content: "Sorry, something went wrong. Please try again later.",
                role: "assistant",
            }
            append(aiMessage)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!input.trim()) return

        const msg: Message = {
            id: crypto.randomUUID(),
            content: input,
            role: "user",
        }
        append(msg)
        setInput('') // Clear input field after submission

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, msg] }),
            })

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

            const data = await response.text()
            const cleanResponse = data.replace(/<think>.*?<\/think>/gs, '').trim()

            const aiMessage: Message = {
                id: crypto.randomUUID(),
                content: cleanResponse || "Sorry, I couldn't get the information.",
                role: "assistant",
            }

            append(aiMessage)

        } catch (error) {
            console.error('Error:', error)

            const aiMessage: Message = {
                id: crypto.randomUUID(),
                content: "Sorry, something went wrong. Please try again later.",
                role: "assistant",
            }
            append(aiMessage)
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
                    <div className="flex flex-col overflow-y-auto h-full mb-2">
                        {messages.map((message, index) => (
                            <Bubble key={`message-${index}`} message={message} />
                        ))}
                        {isLoading && <LoadingBubble />}
                        <div ref={messagesEndRef} />
                    </div>
                )}

                <form className='h-14 w-[55vw] flex border-t-2 border-blue-400 pt-[20px] overflow-hidden rounded-b-[20px]'
                    onSubmit={handleSubmit}
                >
                    <input 
                        className='w-[85%] p-[10px] text-[15px] border-none focus:outline-none' 
                        type="text" 
                        onChange={handleInputChange} 
                        value={input} 
                        placeholder="Ask me something" 
                    />
                    <input 
                        className='w-[15%] text-[15px] border-none text-white bg-red-400 cursor-pointer focus:outline-none' 
                        type="submit" 
                    />
                </form>
            </section>
        </div>
    )
}

export default Home
