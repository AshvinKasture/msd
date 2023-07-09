import React, { useRef, useEffect } from 'react';
import SuggestionItem from './SuggestionItem';

function SuggestionBox({
  show,
  suggestions,
  focusedSuggestion,
  fillSuggestion,
}) {
  const focusedSuggestionRef = useRef(null);

  useEffect(() => {
    if (focusedSuggestionRef.current) {
      focusedSuggestionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [focusedSuggestion]);

  if (show) {
    return (
      <div className='absolute w-full z-10 bg-white dropdown-shadow border border-black max-h-32 overflow-y-auto scroll-min'>
        {suggestions.map((suggestionItem, index) => {
          return (
            <SuggestionItem
              key={suggestionItem}
              value={suggestionItem}
              focused={focusedSuggestion === index}
              fillSuggestion={fillSuggestion}
              ref={focusedSuggestion === index ? focusedSuggestionRef : null}
            />
          );
        })}
      </div>
    );
  } else {
    return null;
  }
}

export default SuggestionBox;
