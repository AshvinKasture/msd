import React, { Fragment, useReducer } from 'react';
import TitleBar from '../../components/layout/TitleBar/TitleBar';
import InputField from '../../components/ui/InputField';
import ActionButton from '../../components/ui/ActionButton';
import useForm from '../../hooks/useForm';

const CreateItemMaster = () => {
  const { drawingNoName, descriptionName } = {
    drawingNoName: 'drawingNo',
    descriptionName: 'description',
  };

  function isEmpty(value) {
    return value.trim().length === 0;
  }

  const initialProperties = [
    {
      label: 'Drawing No',
      name: drawingNoName,
      type: 'text',
      validationFunction: (value) => {
        return !isEmpty(value);
      },
    },
    {
      label: 'Descrption',
      name: descriptionName,
      type: 'text',
      validationFunction: (value) => {
        return !isEmpty(value);
      },
    },
  ];

  const [
    {
      components: {
        [drawingNoName]: drawingNoComponent,
        [descriptionName]: descriptionComponent,
      },
      isFormValid,
    },
    dispatchState,
  ] = useForm(initialProperties);

  function submitForm() {
    if (isFormValid) {
      const drawingNo = drawingNoComponent.value;
      const description = descriptionComponent.value;
      console.log(drawingNo, description);
    } else {
      dispatchState({ type: 'SHOW_VALIDITY' });
    }
  }

  return (
    <Fragment>
      <TitleBar>Item Master</TitleBar>
      <div className='w-1/4 mx-auto mt-24'>
        <InputField dispatchState={dispatchState}>
          {drawingNoComponent}
        </InputField>
        <InputField dispatchState={dispatchState}>
          {descriptionComponent}
        </InputField>
        <ActionButton className='block mx-auto' onClick={submitForm}>
          Save
        </ActionButton>
      </div>
    </Fragment>
  );
};

export default CreateItemMaster;
