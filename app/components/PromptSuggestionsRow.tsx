import React from 'react'
import PromptSuggestionButton from './PromptSuggestionButton'


const prompts = [
  "Who is the highest paid F1 driver",
  "Who will be the newest driver for ferrari"
]

const PromptSuggestionsRow = ({onPromptClick}) => {
  return (
    <div>
      {prompts.map((prompt ,index) => <PromptSuggestionButton key={`suggestion-${index}`} text={prompt} onClick={() => onPromptClick(prompt)}/>)}
    </div>
  )
}

export default PromptSuggestionsRow