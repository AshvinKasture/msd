import React from 'react';
import { twMerge } from 'tailwind-merge';

const ActionButton = ({
  children,
  primaryColor = 'blue-500',
  secondaryColor = 'white',
  borderColor = primaryColor,
  className: classes,
  onClick: clickHandler,
}) => {
  return (
    <button
      className={twMerge(
        `rounded-md text-${secondaryColor} bg-${primaryColor} border-2 border-${borderColor} px-4 py-2 text-xl font-semibold ${classes}`
      )}
      onClick={clickHandler}
    >
      {children}
    </button>
  );
};

export default ActionButton;
