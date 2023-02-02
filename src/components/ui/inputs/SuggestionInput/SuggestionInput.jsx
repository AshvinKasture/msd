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
      value = '',
      width = 52,
      strict = true,
      extendFillHandler = null,
      extendBlurHandler = null,
      dispatchNavigationShortcut = null,
      className: classes = '',
    },
    ref
  ) => {
    const inputRef = useRef();
    const [
      { text, filteredSuggestions, showSuggestionBox, isValid },
      dispatchState,
    ] = useReducer(
      (state, { type, payload }) => {
        switch (type) {
          case 'CHANGE_VALUE':
            const filteredSuggestions =
              payload !== ''
                ? suggestions.filter((suggestionItem) =>
                    suggestionItem.toLowerCase().includes(payload.toLowerCase())
                  )
                : [];

            return {
              text: payload,
              filteredSuggestions,
              showSuggestionBox: filteredSuggestions.length > 0,
              isValid: strict ? suggestions.indexOf(payload) !== -1 : true,
            };
          case 'FILL_SUGGESTION':
            return {
              text: payload,
              filteredSuggestions: state.filteredSuggestions,
              showSuggestionBox: false,
              isValid: true,
            };
          case 'SET_VALUE':
            return {
              text: payload,
              filteredSuggestions:
                payload !== ''
                  ? suggestions.filter((suggestionItem) =>
                      suggestionItem
                        .toLowerCase()
                        .includes(payload.toLowerCase())
                    )
                  : [],
              showSuggestionBox: false,
              isValid: strict ? suggestions.indexOf(payload) !== -1 : true,
            };
          case 'SHOW_SUGGESTION_BOX':
            return {
              ...state,
              showSuggestionBox:
                payload && state.filteredSuggestions.length > 0,
            };
          case 'REMOVE_IF_INVALID':
            if (state.isValid) {
              return { ...state };
            } else {
              return {
                ...state,
                text: '',
                filteredSuggestions: [],
                isValid: false,
                showSuggestionBox: false,
              };
            }
          case 'RESET':
            return {
              text: value,
              filteredSuggestions: [],
              isValid:
                value === '' ? false : isValidSuggestion(suggestions, value),
              showSuggestionBox: false,
            };
          default:
            return { ...state };
        }
      },
      {
        text: value,
        filteredSuggestions: [],
        isValid: value === '' ? false : isValidSuggestion(suggestions, value),
        showSuggestionBox: false,
      }
    );

    useEffect(() => {
      dispatchState({ type: 'SET_VALUE', payload: value });
    }, [value]);

    function changeHandler(e) {
      dispatchState({ type: 'CHANGE_VALUE', payload: e.target.value });
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
        dispatchState({ type: 'SHOW_SUGGESTION_BOX', payload: false });
      }, 100);
      if (extendBlurHandler) {
        setTimeout(() => {
          extendBlurHandler(e, text);
        }, 100);
      }
    }

    function keyUpHandler(e) {
      if (e.code === 'Enter') {
        if (showSuggestionBox) {
          if (filteredSuggestions.length === 1) {
            fillSuggestion(filteredSuggestions[0]);
          }
        } else {
          if (strict ? isValid : true) {
            dispatchNavigationShortcut({
              type: 'ENTER',
              direction: e.shiftKey ? -1 : 1,
            });
          }
        }
      } else if (e.code === 'Tab') {
        e.preventDefault();
        dispatchNavigationShortcut({
          type: 'ENTER',
          direction: e.shiftKey ? -1 : 1,
        });
      }
    }

    function focus() {
      inputRef.current.focus();
    }

    function reset() {
      // inputRef.current.reset();
      dispatchState({ type: 'RESET' });
    }

    useImperativeHandle(ref, () => {
      return { value: text, isValid, focus, reset };
    });

    return (
      <div className='relative'>
        <TextInput
          placeholder={placeholder}
          name={name}
          value={text}
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
          fillSuggestion={fillSuggestion}
        />
      </div>
    );
  }
);

function isValidSuggestion(suggestions, value) {
  return suggestions.includes(value);
}

export default SuggestionInput;
