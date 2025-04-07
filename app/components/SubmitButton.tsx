import React from 'react'

const SubmitButton = () => {
  return (
        <button
        className="relative flex items-center px-3 sm:px-4 md:px-6 py-2 sm:py-3 overflow-hidden font-medium transition-all bg-red-500 rounded-md group"
        type='submit'
        >
        <span
            className="absolute top-0 right-0 inline-block w-3 h-3 sm:w-4 sm:h-4 transition-all duration-500 ease-in-out bg-red-700 rounded group-hover:-mr-4 group-hover:-mt-4"
        >
            <span
            className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"
            ></span>
        </span>
        <span
            className="absolute bottom-0 rotate-180 left-0 inline-block w-3 h-3 sm:w-4 sm:h-4 transition-all duration-500 ease-in-out bg-red-700 rounded group-hover:-ml-4 group-hover:-mb-4"
        >
            <span
            className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"
            ></span>
        </span>
        <span
            className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-red-600 rounded-md group-hover:translate-x-0"
        ></span>
        <span
            className="relative w-full text-left text-white text-xs sm:text-sm transition-colors duration-200 ease-in-out group-hover:text-white"
            >Submit</span>
        </button>


  )
}

export default SubmitButton