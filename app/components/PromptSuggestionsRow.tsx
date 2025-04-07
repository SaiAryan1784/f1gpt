import React from 'react'
import PromptSuggestionButton from './PromptSuggestionButton'


const prompts = [
  "Who is the highest paid F1 driver",
  "Who will be the newest driver for ferrari",
  "What are the F1 regulations for 2024",
  "Who won the last Monaco Grand Prix",
  "Best overtakes in F1 history",
  "Current F1 standings"
]

const PromptSuggestionsRow = ({onPromptClick}) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-center text-gray-700 font-medium mb-3 text-sm sm:text-base">Try these popular questions:</h3>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2 sm:px-4">
        {prompts.map((prompt, index) => (
          <PromptSuggestionButton 
            key={`suggestion-${index}`} 
            text={prompt} 
            onClick={() => onPromptClick(prompt)}
          />
        ))}
      </div>
    </div>
  )
}

export default PromptSuggestionsRow