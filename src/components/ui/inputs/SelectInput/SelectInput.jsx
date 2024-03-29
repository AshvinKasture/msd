import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';

const SelectInput = forwardRef(
  (
    {
      options = [],
      name = null,
      value = '',
      extendChangeHandler = null,
      disabled = false,
      dispatchNavigationShortcut = null,
    },
    ref
  ) => {
    const inputRef = useRef();

    const [text, setText] = useState(value);

    function changeHandler(e) {
      setText(e.target.value);
      if (extendChangeHandler !== null) {
        extendChangeHandler(e, e.target.value);
      }
    }

    function focusHandler(e) {
      if (dispatchNavigationShortcut !== null) {
        dispatchNavigationShortcut({ type: 'CLICK', name: name });
      }
    }

    function focus() {
      inputRef.current.focus();
    }

    function keyDownHandler(e) {
      if (e.code === 'Tab') {
        e.preventDefault();
      }
    }

    function keyUpHandler(e) {
      if (e.code === 'Tab') {
        e.preventDefault();
        dispatchNavigationShortcut({
          type: 'MOVE',
          direction: e.shiftKey ? -1 : 1,
          name,
        });
      }
    }

    useImperativeHandle(ref, () => {
      return { value: text, focus };
    });

    return (
      <select
        className='w-52 outline outline-1 outline-black focus:outline-2 px-2 py-1 max-h-52 scroll-min'
        name={name}
        value={text}
        onChange={changeHandler}
        onFocus={focusHandler}
        onKeyDown={keyDownHandler}
        onKeyUp={keyUpHandler}
        ref={inputRef}
      >
        <option value='' disabled={disabled}>
          -- Select --
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    );
  }
);

export default SelectInput;
