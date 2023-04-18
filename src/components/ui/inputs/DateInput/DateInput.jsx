import React, { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { twMerge } from 'tailwind-merge';
import 'react-datepicker/dist/react-datepicker.css';

const DateInput = forwardRef(
  (
    {
      placeholder = '',
      name = null,
      value = '',
      width = 'w-52',
      disabled = false,
      extendChangeHandler = null,
      extendClickHandler = null,
      extendFocusHandler = null,
      extendBlurHandler = null,
      extendKeyUpHandler = null,
      dispatchNavigationShortcut = null,
      className: classes = '',
    },
    ref
  ) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    return (
      //   <div>
      <DatePicker
        className={twMerge(
          `${width} outline outline-1 outline-black focus:outline-2 px-2 py-1 ${
            disabled && 'bg-gray-300 cursor-not-allowed'
          } ${classes}`
        )}
        wrapperClassName={`${width}`}
        dateFormat='dd/MM/yyyy'
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
      />
      //   </div>
    );
  }
);

export default DateInput;
