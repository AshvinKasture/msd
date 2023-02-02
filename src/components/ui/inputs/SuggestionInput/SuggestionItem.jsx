import React from 'react';

function SuggestionItem({ value, fillSuggestion }) {
  return (
    <div
      className='px-2 w-full text-left hover:bg-blue-500 hover:text-white cursor-default'
      onClick={(e) => {
        fillSuggestion(value);
      }}
    >
      {value}
    </div>
  );
}

export default SuggestionItem;
