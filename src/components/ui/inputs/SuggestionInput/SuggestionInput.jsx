import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useReducer,
} from 'react';
import TextInput from '../TextInput/TextInput';
import SuggestionBox from './SuggestionBox';

const SuggestionInput = forwardRef(
  (
    {
      suggestions = [],
      placeholder = '',
      name = null,
      value = null,
      disabled = false,
      width = 'w-52',
      strict = true,
      extendChangeHandler = null,
      extendFillHandler = null,
      extendBlurHandler = null,
      dispatchNavigationShortcut = null,
      className: classes = '',
    },
    ref
  ) => {
    const inputRef = useRef();
    const [
      {
        text,
        filteredSuggestions,
        showSuggestionBox,
        isValid,
        focusedSuggestion,
      },
      dispatchState,
    ] = useReducer(
      (state, { type, payload }) => {
        let {
          text,
          filteredSuggestions,
          showSuggestionBox,
          isValid,
          focusedSuggestion,
        } = {
          ...state,
        };
        switch (type) {
          case 'CHANGE_VALUE':
            filteredSuggestions = filterSuggestions(payload);
            isValid = isValidSuggestion(payload);
            return {
              text: payload,
              filteredSuggestions,
              showSuggestionBox:
                filteredSuggestions.length > 1 ? true : !isValid,
              isValid: strict ? isValidSuggestion(payload) : true,
              focusedSuggestion: filteredSuggestions.length > 0 ? 0 : -1,
            };
          case 'FILL_SUGGESTION':
            return {
              text: payload,
              filteredSuggestions: filterSuggestions(payload),
              showSuggestionBox: false,
              isValid: true,
              focusedSuggestion: -1,
            };
          case 'SET_VALUE':
            return {
              text: payload,
              filteredSuggestions: filterSuggestions(payload),
              showSuggestionBox: false,
              isValid: strict ? isValidSuggestion(payload) : true,
              focusedSuggestion: -1,
            };
          case 'SHOW_SUGGESTION_BOX':
            if (payload) {
              if (filteredSuggestions.length === 0) {
                showSuggestionBox = false;
              } else if (filteredSuggestions.length === 1) {
                showSuggestionBox = !isValid;
              } else if (filteredSuggestions.length > 1) {
                true;
              }
            } else {
              showSuggestionBox = false;
            }
            return {
              text,
              filteredSuggestions,
              showSuggestionBox,
              isValid,
              focusedSuggestion: filteredSuggestions.length > 0 ? 0 : -1,
            };
          case 'REMOVE_IF_INVALID':
            if (isValid) {
              return {
                text,
                filteredSuggestions,
                showSuggestionBox: false,
                isValid,
                focusedSuggestion: -1,
              };
            } else {
              return {
                text: '',
                filteredSuggestions: [],
                showSuggestionBox: false,
                isValid: false,
                focusedSuggestion: -1,
              };
            }
          case 'NEXT_SUGGESTION':
            return {
              text,
              filteredSuggestions,
              showSuggestionBox,
              isValid,
              focusedSuggestion:
                focusedSuggestion + 1 >= filteredSuggestions.length
                  ? focusedSuggestion
                  : focusedSuggestion + 1,
            };
          case 'PREVIOUS_SUGGESTION':
            return {
              text,
              filteredSuggestions,
              showSuggestionBox,
              isValid,
              focusedSuggestion:
                focusedSuggestion > 0
                  ? focusedSuggestion - 1
                  : focusedSuggestion,
            };
          case 'RESET':
            return {
              text: value,
              filteredSuggestions: [],
              showSuggestionBox: false,
              isValid: strict ? isValidSuggestion(payload) : true,
              focusedSuggestion: -1,
            };
          default:
            return {
              text,
              filteredSuggestions,
              showSuggestionBox,
              isValid,
              focusedSuggestion: -1,
            };
        }
      },
      {
        text: value,
        filteredSuggestions: [],
        isValid: value === '' ? false : isValidSuggestion(value),
        showSuggestionBox: false,
        focusedSuggestion: -1,
      }
    );

    useEffect(() => {
      if (value) {
        console.log('setting value');
        dispatchState({ type: 'SET_VALUE', payload: value });
      }
    }, [value]);

    function filterSuggestions(value) {
      return value !== ''
        ? suggestions.filter((suggestionItem) =>
            suggestionItem.toLowerCase().includes(value.toLowerCase())
          )
        : [];
    }

    function isValidSuggestion(value) {
      return suggestions.includes(value);
    }

    function changeHandler(e) {
      dispatchState({ type: 'CHANGE_VALUE', payload: e.target.value });
      if (extendChangeHandler !== null) {
        extendChangeHandler(e.target.value);
      }
    }

    function fillSuggestion(value) {
      dispatchState({ type: 'FILL_SUGGESTION', payload: value });
      if (extendFillHandler !== null) {
        extendFillHandler(value);
      }
    }

    function focusHandler(e) {
      dispatchState({ type: 'SHOW_SUGGESTION_BOX', payload: true });
    }

    function blurHandler(e) {
      setTimeout(() => {
        dispatchState({ type: 'REMOVE_IF_INVALID' });
      }, 100);
      if (extendBlurHandler) {
        setTimeout(() => {
          extendBlurHandler(e, text);
        }, 100);
      }
    }

    function keyUpHandler(e) {
      if (showSuggestionBox) {
        if (e.code === 'Enter') {
          fillSuggestion(filteredSuggestions[focusedSuggestion]);
        } else if (e.code === 'ArrowUp') {
          dispatchState({ type: 'PREVIOUS_SUGGESTION' });
        } else if (e.code === 'ArrowDown') {
          dispatchState({ type: 'NEXT_SUGGESTION' });
        } else if (e.code === 'Escape') {
          dispatchState({ type: 'SHOW_SUGGESTION_BOX', payload: false });
        }
      } else if (
        (e.code === 'Enter' || e.code === 'Tab') &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        e.preventDefault();
        if (dispatchNavigationShortcut !== null) {
          dispatchNavigationShortcut({
            type: 'MOVE',
            direction: e.shiftKey ? -1 : 1,
            name,
          });
        }
      }
    }

    function focus() {
      inputRef.current.focus();
    }

    function setValue(value) {
      dispatchState({ type: 'SET_VALUE', payload: value });
    }

    function reset() {
      // inputRef.current.reset();
      dispatchState({ type: 'RESET' });
    }

    useImperativeHandle(ref, () => {
      return { value: text, isValid, focus, setValue, reset };
    });

    return (
      <div className='relative'>
        <TextInput
          placeholder={placeholder}
          name={name}
          value={text ? text : ''}
          disabled={disabled}
          width={width}
          className={classes}
          replaceChangeHandler={changeHandler}
          replaceFocusHandler={focusHandler}
          replaceBlurHandler={blurHandler}
          replaceKeyUpHandler={keyUpHandler}
          dispatchNavigationShortcut={dispatchNavigationShortcut}
          ref={inputRef}
        />
        <SuggestionBox
          show={showSuggestionBox}
          suggestions={filteredSuggestions}
          focusedSuggestion={focusedSuggestion}
          fillSuggestion={fillSuggestion}
        />
      </div>
    );
  }
);

export default SuggestionInput;
