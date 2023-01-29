import React from 'react';

function FileInput({ className: classes, fileName, onClick: clickHandler }) {
  return (
    <div
      className={`flex flex-col gap-y-1 items-center w-60 outline-2 outline-red-500${classes}`}
    >
      <button
        className='w-32 outline outline-2 outline-black px-2 py-1 rounded-sm font-semibold'
        onClick={clickHandler}
      >
        Choose File
      </button>
      <span>{fileName || 'No file choosen'}</span>
    </div>
  );
}

export default FileInput;
