import React from 'react';

function SuggestionItem({ text, className: classes, fillSuggestion }) {
  return (
    <button
      className={` py-2 px-2 w-full text-left hover:bg-gray-200 cursor-default ${classes}`}
      onClick={(e) => {
        fillSuggestion(text);
      }}
    >
      {text}
    </button>
  );
}

export default SuggestionItem;
