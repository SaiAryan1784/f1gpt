import React from 'react'
import '../globals.css'
import BG from '../public/bg.png'
import StaronGithub from './components/StaronGithub'

export const metadata = {
    title:"F1GPT",
    description: "The place to solve all your f1 curiosities"
}

const RootLayout = ({children}) => {
  return (
    <html lang='en'>
        <body className='p-0 flex flex-col my-auto justify-center h-screen items-center bg-no-repeat bg-cover bg-center'
              style={{ backgroundImage: `url(${BG.src})` }}
              >
                <a href="https://github.com/SaiAryan1784/f1gpt" 
                    target='_blank'
                   className="absolute top-2 left-2 sm:top-4 sm:left-4 z-50">
                    <StaronGithub />
                </a>
            {children}
        </body>
    </html>
  )
} 

export default RootLayout