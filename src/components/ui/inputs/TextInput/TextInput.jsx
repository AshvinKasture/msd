import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { twMerge } from 'tailwind-merge';

const TextInput = forwardRef(
  (
    {
      placeholder = '',
      name = null,
      value = '',
      width = 52,
      disabled = false,
      acceptedInput = ({ newValue: value }) => value,
      extendChangeHandler = null,
      replaceChangeHandler = null,
      extendClickHandler = null,
      replaceClickHandler = null,
      extendFocusHandler = null,
      replaceFocusHandler = null,
      extendBlurHandler = null,
      replaceBlurHandler = null,
      extendKeyUpHandler = null,
      replaceKeyUpHandler = null,
      dispatchNavigationShortcut = null,
      className: classes = '',
    },
    ref
  ) => {
    // console.log({ name, value });
    const [text, setText] = useState(value);

    const inputRef = useRef();

    useEffect(() => {
      setText(value);
    }, [value]);

    function changeHandler(e) {
      if (replaceChangeHandler === null) {
        const newValue = e.target.value;
        const acceptedNewValue = acceptedInput({ oldValue: text, newValue });
        setText(acceptedNewValue);
        if (extendChangeHandler !== null) {
          extendChangeHandler(e, acceptedNewValue);
        }
      } else {
        replaceChangeHandler(e);
      }
    }

    function clickHandler(e) {
      if (replaceClickHandler === null) {
        if (dispatchNavigationShortcut !== null) {
          dispatchNavigationShortcut({ type: 'CLICK', name: name });
        }
        if (extendClickHandler !== null) {
          extendClickHandler(e);
        }
      } else {
        replaceClickHandler(e);
      }
    }

    function focusHandler(e) {
      if (replaceFocusHandler === null) {
        if (extendFocusHandler !== null) {
          extendFocusHandler(e);
        }
      } else {
        replaceFocusHandler(e);
      }
    }

    function blurHandler(e) {
      if (replaceBlurHandler === null) {
        if (extendBlurHandler !== null) {
          extendBlurHandler(e);
        }
      } else {
        replaceBlurHandler(e);
      }
    }

    function keyDownHandler(e) {
      if (e.code === 'Tab') {
        e.preventDefault();
      }
    }

    function keyUpHandler(e) {
      if (replaceKeyUpHandler === null) {
        if (dispatchNavigationShortcut !== null) {
          if (e.code === 'Enter' || e.code === 'Tab') {
            e.preventDefault();
            dispatchNavigationShortcut({
              type: 'ENTER',
              direction: e.shiftKey ? -1 : 1,
            });
          }
        }
        if (extendKeyUpHandler !== null) {
          extendKeyUpHandler(e);
        }
      } else {
        replaceKeyUpHandler(e);
      }
    }

    function focus() {
      inputRef.current.focus();
    }

    function setValue(value) {
      setText(value);
    }

    function reset() {
      setText('');
    }

    useImperativeHandle(ref, () => {
      return { value: text, focus, reset, setValue };
    });
    return (
      <input
        className={twMerge(
          `w-${width} outline outline-1 outline-black focus:outline-2 px-2 py-1 ${
            disabled && 'bg-gray-300 cursor-not-allowed'
          } ${classes}`
        )}
        placeholder={placeholder}
        name={name}
        value={text}
        disabled={disabled}
        onChange={changeHandler}
        onClick={clickHandler}
        onFocus={focusHandler}
        onBlur={blurHandler}
        onKeyDown={keyDownHandler}
        onKeyUp={keyUpHandler}
        ref={inputRef}
      />
    );
  }
);

export default TextInput;
