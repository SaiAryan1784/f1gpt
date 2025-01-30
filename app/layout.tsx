import React from 'react'
import '../globals.css'
import BG from '../public/bg.png'

export const metadata = {
    title:"F1GPT",
    description: "The place to solve all your f1 curiosities"
}

const RootLayout = ({children}) => {
  return (
    <html lang='en'>
        <body className='p-0 flex flex-col my-auto justify-center h-screen items-center bg-no-repeat bg-cover'
    style={{ backgroundImage: `url(${BG.src})` }}>
            {children}
        </body>
    </html>
  )
} 

export default RootLayout