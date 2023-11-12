import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
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

    const datePickerRef = useRef(null);

    useEffect(() => {
      setSelectedDate(value);
    }, [value]);

    function focus() {
      datePickerRef.current.input.focus();
    }

    function reset() {
      setSelectedDate(new Date());
    }

    function setValue(value) {
      setSelectedDate(value);
    }

    useImperativeHandle(ref, () => {
      return { value: selectedDate, focus, reset, setValue };
    });

    return (
      <DatePicker
        className={twMerge(
          `${width} outline outline-1 outline-black focus:outline-2 px-2 py-1 ${
            disabled && 'bg-gray-300 cursor-not-allowed'
          } ${classes}`
        )}
        wrapperClassName={`${width}`}
        name={name}
        dateFormat='dd/MM/yyyy'
        selected={selectedDate}
        disabled={disabled}
        onChange={(date) => setSelectedDate(date)}
        ref={datePickerRef}
      />
    );
  }
);

export default DateInput;
