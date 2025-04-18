import React from 'react'

const PromptSuggestionButton = ({text, onClick}) => {
  return (
    <button 
      className='bg-slate-950 text-slate-400 border border-slate-400 border-b-4 font-medium overflow-hidden relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group text-xs sm:text-sm'
      onClick={onClick}
    >
        <span className="bg-slate-400 shadow-slate-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
        {text}
    </button>
  )
}

export default PromptSuggestionButton