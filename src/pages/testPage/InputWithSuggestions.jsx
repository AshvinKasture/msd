import React, { useState, useRef } from 'react';

function InputWithSuggestions({ suggestions }) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.length > 0);
    setFocusedSuggestionIndex(-1);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    setFocusedSuggestionIndex(-1);
  };

  const handleBlur = () => {
    const isValidSuggestion = suggestions.includes(inputValue);
    if (!isValidSuggestion) {
      setInputValue('');
    }
    setShowSuggestions(false);
    setFocusedSuggestionIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedSuggestionIndex((prevIndex) =>
        prevIndex === suggestionItems.length - 1 ? 0 : prevIndex + 1
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedSuggestionIndex((prevIndex) =>
        prevIndex <= 0 ? suggestionItems.length - 1 : prevIndex - 1
      );
    } else if (e.key === 'Enter' && focusedSuggestionIndex >= 0) {
      e.preventDefault();
      const suggestion = suggestionItems[focusedSuggestionIndex];
      setInputValue(suggestion);
      setShowSuggestions(false);
      setFocusedSuggestionIndex(-1);
    }
  };

  const getCurrentValue = () => {
    return inputValue;
  };

  const suggestionItems = suggestions
    .filter((suggestion) =>
      suggestion.toLowerCase().startsWith(inputValue.toLowerCase())
    )
    .map((suggestion, index) => (
      <li
        key={suggestion}
        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
          index === focusedSuggestionIndex ? 'bg-gray-100' : ''
        }`}
        onClick={() => handleSuggestionClick(suggestion)}
      >
        {suggestion}
      </li>
    ));

  return (
    <div className='relative'>
      <input
        type='text'
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        className='w-full py-2 pl-4 pr-12 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:bg-white focus:shadow-outline'
      />
      {showSuggestions && (
        <ul className='absolute w-full bg-white shadow-md rounded-lg divide-y divide-gray-200 mt-1'>
          {suggestionItems.length > 0 ? (
            suggestionItems
          ) : (
            <li className='px-4 py-2'>No suggestions found</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default InputWithSuggestions;
