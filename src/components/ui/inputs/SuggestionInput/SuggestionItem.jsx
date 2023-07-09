import React, { forwardRef } from 'react';

const SuggestionItem = forwardRef(({ value, focused, fillSuggestion }, ref) => {
  return (
    <div
      className={`px-2 w-full text-left ${
        focused && 'bg-blue-500 text-white'
      } hover:bg-blue-500 hover:text-white cursor-default`}
      onClick={(e) => {
        fillSuggestion(value);
      }}
      ref={ref}
    >
      {value}
    </div>
  );
});

export default SuggestionItem;
