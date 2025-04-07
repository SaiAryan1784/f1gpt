import React from 'react'

const Bubble = ({message}) => {

  const {content, role} = message

  return (
    <div className={`${role} bubble m-2 p-3 sm:p-4 text-[14px] sm:text-[15px] border-none 
                     ${role === 'user' ? 'text-white' : 'text-[#383838]'} 
                     shadow-lg w-auto max-w-[80%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[50%] 
                     text-left rounded-lg transition-all duration-200 hover:shadow-xl`}>
      {typeof content === 'string' ? (
        <div className="prose prose-sm max-w-none break-words">
          {content}
        </div>
      ) : (
        content
      )}
    </div>
  )
}

export default Bubble