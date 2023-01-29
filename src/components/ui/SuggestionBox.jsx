import React, { useState, useEffect } from 'react';
import SuggestionItem from './SuggestionItem';

function SuggestionBox({ suggestions, inputValue, show, fillSuggestion }) {
  //   console.log(suggestions);
  if (!show) {
    return null;
  }

  if (suggestions.length === 0 || inputValue.trim().length === 0) {
    return null;
  }
  const filteredSuggestions = suggestions.filter((item) => {
    // console.log(item);
    return item.toLowerCase().includes(inputValue.toLowerCase());
  });
  if (filteredSuggestions.length === 0) {
    return null;
  }
  if (
    filteredSuggestions.length === 1 &&
    filteredSuggestions[0] === inputValue
  ) {
    return null;
  }

  const [focus, setFocus] = useState(-1);

  return (
    <div
      className={`absolute top-9 w-full z-10 bg-white shadow-md border border-gray-200 max-h-32 overflow-y-auto scroll-min`}
    >
      {filteredSuggestions.map((text, index, arr) => (
        <SuggestionItem
          key={text}
          text={text}
          value={text}
          fillSuggestion={fillSuggestion}
        />
      ))}
    </div>
  );
}

export default SuggestionBox;
