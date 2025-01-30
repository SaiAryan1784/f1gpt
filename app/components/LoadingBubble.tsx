import React from 'react';

const LoadingBubble = () => {
  return (
    <div 
      className="m-[10px] w-[60px] aspect-[4]"
      style={{
        background: `
          radial-gradient(circle closest-side, #383838 90%, transparent) 0% 50%,
          radial-gradient(circle closest-side, #383838 90%, transparent) 50% 50%,
          radial-gradient(circle closest-side, #383838 90%, transparent) 100% 50%`,
        backgroundSize: "33% 100%",
        backgroundRepeat: "no-repeat",
        animation: "loading-animation 1s infinite linear"      
      }}
    ></div>
  );
};

export default LoadingBubble;
