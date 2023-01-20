import React, {
  Fragment,
  useReducer,
  useRef,
  useEffect,
  useState,
} from 'react';
import TitleBar from '../../components/layout/TitleBar/TitleBar';
import InputField from '../../components/ui/InputField';
import ActionButton from '../../components/ui/ActionButton';

const CreateItemMaster = () => {
  const fieldNames = {
    drawingNoName: 'drawingNo',
    descriptionName: 'description',
  };
  const { drawingNoName, descriptionName } = fieldNames;

  const [{ drawingNo, description }, dispatchState] = useReducer(
    ({ drawingNo, description }, { action, payload }) => {
      switch (action) {
        case 'CHANGE':
          const { field, value } = payload;
          switch (field) {
            case drawingNoName:
              return { drawingNo: value, description };
            case descriptionName:
              return { drawingNo, description: value };
          }
          break;
      }
      return { drawingNo: '', description: '' };
    },
    {
      drawingNo: '',
      description: '',
    }
  );

  // const fieldReferences = [useRef(), useRef()];
  // const fieldReferences = {
  //   [drawingNoName]: useRef(),
  //   [descriptionName]: useRef(),
  // };
  const fieldReferences = [
    {
      name: drawingNoName,
      reference: useRef(),
    },
    {
      name: descriptionName,
      reference: useRef(),
    },
  ];

  const [focusedIndex, setFocusedIndex] = useState(0);

  const moveField = (backward = false) => {
    if (!backward) {
      if (focusedIndex < fieldReferences.length) {
        setFocusedIndex((prev) => prev + 1);
      }
    } else {
      if (focusedIndex > 0) {
        setFocusedIndex((prev) => prev - 1);
      }
    }
  };

  const selectField = (fieldName) => {
    setFocusedIndex(
      fieldReferences.map((item) => item.name).indexOf(fieldName)
    );
  };

  useEffect(() => {
    if (focusedIndex === fieldReferences.length) {
      createItem();
    } else {
      fieldReferences[focusedIndex].reference.current.focus();
    }
  }, [focusedIndex]);

  const validateInput = ({ drawingNo, description }) => {};

  const createItem = () => {
    const itemData = { drawingNo, description };
  };

  return (
    <Fragment>
      <TitleBar>Item Master</TitleBar>
      <div className='w-1/4 mx-auto mt-24'>
        <InputField
          label='Drawing No'
          type='text'
          value={drawingNo}
          name={drawingNoName}
          changeHandler={dispatchState}
          reference={fieldReferences[0].reference}
          moveField={moveField}
          selectField={selectField}
        />
        <InputField
          label='Description'
          type='text'
          value={description}
          name={descriptionName}
          changeHandler={dispatchState}
          reference={fieldReferences[1].reference}
          moveField={moveField}
          selectField={selectField}
        />
        <ActionButton className='block mx-auto' clickHandler={createItem}>
          Save
        </ActionButton>
      </div>
    </Fragment>
  );
};

export default CreateItemMaster;
