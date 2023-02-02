import React from 'react';
import SuggestionItem from './SuggestionItem';

function SuggestionBox({ show, suggestions, fillSuggestion }) {
  if (show) {
    return (
      <div className='absolute w-full z-10 bg-white dropdown-shadow border border-black max-h-32 overflow-y-auto scroll-min'>
        {suggestions.map((suggestionItem) => (
          <SuggestionItem
            key={suggestionItem}
            value={suggestionItem}
            fillSuggestion={fillSuggestion}
          />
        ))}
      </div>
    );
  } else {
    return null;
  }
}

export default SuggestionBox;
