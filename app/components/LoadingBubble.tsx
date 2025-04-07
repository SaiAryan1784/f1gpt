import React from 'react';

const LoadingBubble = () => {
  return (
    <div className="flex items-center gap-3 p-3 m-2 bg-gray-100/90 backdrop-blur-sm rounded-lg shadow-lg w-auto max-w-[80%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[50%] border border-gray-200/50">
      {/* Spinning F1 tire with a thick look */}
      <div className="relative w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full 
        border-[8px] sm:border-[10px] border-gray-900 border-solid 
        border-t-red-500 border-r-white border-b-black border-l-gray-500 
        animate-spin-fast shadow-md"
      >
        {/* Inner Rim Effect */}
        <div className="absolute inset-2 w-[60%] h-[60%] rounded-full bg-gray-800"></div>
        
        {/* F1 Logo in the center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[8px] sm:text-[10px] font-bold text-white z-10">F1</span>
        </div>

        {/* Sparkle effect */}
        <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full opacity-70 animate-pulse"></div>
      </div>

      {/* Text animation: "Speeding up..." */}
      <div className="flex flex-col">
        <p className="text-xs sm:text-sm text-gray-800 font-semibold">
          <span className="animate-pulse">Speeding</span> 
          <span className="animate-pulse" style={{ animationDelay: '200ms' }}>up</span>
          <span className="inline-flex">
            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '200ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '400ms' }}>.</span>
          </span>
        </p>
        <div className="flex gap-1 mt-1">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingBubble;
