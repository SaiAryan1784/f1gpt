"use client"
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import f1GPTLogo from '../public/F1GPT.png'
import { useChat } from 'ai/react'
import { Message } from 'ai/react'
import Bubble from './components/Bubble'
import PromptSuggestionsRow from './components/PromptSuggestionsRow'
import LoadingBubble from './components/LoadingBubble'
import SubmitButton from './components/SubmitButton'

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
        <div className='p-4 sm:p-5 w-[90vw] md:w-[80vw] lg:w-[60vw] h-[80vh] flex items-center flex-col justify-between text-center bg-gray-400 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-white/20 shadow-xl'>
            
            <Image src={f1GPTLogo} alt='logo' width={175} height={175} className='rounded-lg w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[175px] md:h-[175px] shadow-lg transition-all duration-300 hover:scale-105' />
            <section className={`${noMessages ? "" : "h-[calc(80vh-150px)]"} flex flex-col justify-between w-full overflow-hidden items-center`}>
                {noMessages ? (
                    <div className="flex flex-col items-center justify-center w-full">
                        <p className='px-4 sm:px-[80px] text-sm sm:text-base font-medium text-gray-800'>The ultimate place to ask F1 questions</p>
                        <br />
                        <PromptSuggestionsRow onPromptClick={PromptSubmit} />
                    </div>
                ) : (
                    <div className="flex flex-col overflow-y-auto h-full w-full mb-2">
                        {messages.map((message, index) => (
                            <Bubble key={`message-${index}`} message={message} />
                        ))}
                        {isLoading && <LoadingBubble />}
                        <div ref={messagesEndRef} />
                    </div>
                )}

                <form 
                    className='h-14 w-full mx-auto max-w-[95%] md:max-w-[90%] border-t-2 border-blue-400 pt-[20px] overflow-hidden flex justify-between self-center'
                    onSubmit={handleSubmit}
                >
                    <input 
                        className='w-[85%] p-[10px] text-[15px] border-none focus:outline-none rounded-lg shadow-inner bg-white/90' 
                        type="text" 
                        onChange={handleInputChange} 
                        value={input} 
                        placeholder="Ask me something about Formula 1..." 
                    />
                    <SubmitButton/>
                </form>
            </section>
        </div>
    )
}

export default Home
