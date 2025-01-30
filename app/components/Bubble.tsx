import React from 'react'

const Bubble = ({message}) => {

  const {content, role} = message

  return (
    <div className={`${role} bubble m-2 p-2 text-[15px] border-none text-[#383838] shadow-[#959da533] shadow-md w-[80%] text-left`}>
      {content}
    </div>
  )
}

export default Bubble