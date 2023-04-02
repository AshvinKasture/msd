import React from 'react';
import useFormFieldSequence from './useFormFieldSequence';

export default function MyComponent() {
  const { registerFieldRef, handleKeyDown, handleFieldClick } =
    useFormFieldSequence(['firstName', 'lastName', 'salary']);

  return (
    <form>
      <div>
        <label htmlFor='firstName'>First Name:</label>
        <TextInput
          name='firstName'
          ref={(ref) => registerFieldRef('firstName', ref)}
          onKeyDown={handleKeyDown}
          onClick={() => handleFieldClick(0)}
        />
      </div>
      <div>
        <label htmlFor='lastName'>Last Name:</label>
        <TextInput
          name='lastName'
          ref={(ref) => registerFieldRef('lastName', ref)}
          onKeyDown={handleKeyDown}
          onClick={() => handleFieldClick(1)}
        />
      </div>
      <div>
        <label htmlFor='salary'>Salary:</label>
        <TextInput
          name='salary'
          ref={(ref) => registerFieldRef('salary', ref)}
          onKeyDown={handleKeyDown}
          onClick={() => handleFieldClick(2)}
        />
      </div>
      <button type='submit'>Submit</button>
    </form>
  );
}
