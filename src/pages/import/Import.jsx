import React, { Fragment, useState, useContext, useEffect } from 'react';
import TitleBar from '../../components/layout/TitleBar/TitleBar';
import FileInput from '../../components/ui/FileInput';
import useForm from '../../hooks/useForm';
import InputField from '../../components/ui/InputField';
import AppContext from '../../store/appContext';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import SuggestionInput from '../../components/ui/SuggestionInput';
import SelectInput from '../../components/ui/SelectInput';
import ActionButton from '../../components/ui/ActionButton';

function Import({ type }) {
  // const { ITEM_MASTER, VENDOR_MASTER } = pages;

  const { setContentSpinner } = useContext(AppContext);

  const [choosenFile, setChoosenFile] = useState(null);

  const modeContent = {
    ITEM_MASTER: {
      title: 'Item Master',
      fields: [
        {
          label: 'Drawing No',
          name: 'drawingNo',
          type: 'text',
          validationFunction: (value) => {
            return true;
          },
        },
        {
          label: 'Description',
          name: 'description',
          type: 'text',
          validationFunction: (value) => {
            return true;
          },
        },
      ],
      importHandler: async () => {
        const sheetName = sheetComponent.value;
        const startNo = startComponent.value;
        const endNo = endComponent.value;
        const drawingNoCol = fieldComponents.drawingNo.value;
        const descriptionCol = fieldComponents.description.value;
        setContentSpinner(true);
        await itemMasterModule.importItemMaster({
          sheetName,
          start: startNo,
          end: endNo,
          cols: {
            drawingNo: drawingNoCol,
            description: descriptionCol,
          },
        });
      },
    },
    VENDOR_MASTER: {
      title: 'Customer Master',
      fields: [
        {
          label: 'Customer Name',
          name: 'customerName',
          type: 'text',
          validationFunction: (value) => {
            return true;
          },
        },
        {
          label: 'Customer Address',
          name: 'customerAddress',
          type: 'text',
          validationFunction: (value) => {
            return true;
          },
        },
        {
          label: 'GST No',
          name: 'gstNo',
          type: 'text',
          validationFunction: (value) => {
            return true;
          },
        },
      ],
      importHandler: async () => {
        const sheetName = sheetComponent.value;
        const startNo = startComponent.value;
        const endNo = endComponent.value;
        const customerNameCol = fieldComponents.customerName.value;
        const customerAddressCol = fieldComponents.customerAddress.value;
        const gstNoCol = fieldComponents.gstNo.value;
        setContentSpinner(true);
        await vendorMasterModule.importCustomerMaster({
          sheetName,
          start: startNo,
          end: endNo,
          cols: {
            customerName: customerNameCol,
            customerAddress: customerAddressCol,
            gstNo: gstNoCol,
          },
        });
      },
    },
  };

  const initialProperties = [
    {
      label: 'File',
      name: 'file',
      type: 'text',
      validationFunction: (value) => {
        return true;
      },
    },
    {
      label: 'Sheet',
      name: 'sheet',
      type: 'text',
      validationFunction: (value) => {
        return true;
      },
    },
    {
      label: 'Start',
      name: 'start',
      type: 'text',
      validationFunction: (value) => {
        return true;
      },
    },
    {
      label: 'End',
      name: 'end',
      type: 'text',
      validationFunction: (value) => {
        return true;
      },
    },
    ...modeContent[type].fields,
  ];

  useEffect(() => {
    dispatchState({
      type: 'SET_PROPERTIES',
      payload: [
        {
          label: 'File',
          name: 'file',
          type: 'text',
          validationFunction: (value) => {
            return true;
          },
        },
        {
          label: 'Sheet',
          name: 'sheet',
          type: 'text',
          validationFunction: (value) => {
            return true;
          },
        },
        {
          label: 'Start',
          name: 'start',
          type: 'text',
          validationFunction: (value) => {
            return true;
          },
        },
        {
          label: 'End',
          name: 'end',
          type: 'text',
          validationFunction: (value) => {
            return true;
          },
        },
        ...modeContent[type].fields,
      ],
    });
    setChoosenFile(null);
  }, [type]);

  const [
    {
      components: {
        file: fileComponent,
        sheet: sheetComponent,
        start: startComponent,
        end: endComponent,
        ...fieldComponents
      },
    },
    dispatchState,
  ] = useForm(initialProperties);

  function chooseFile() {
    setContentSpinner(true);
    fileModule
      .chooseExcelFile()
      .then((result) => {
        setContentSpinner(false);
        if (result) {
          setChoosenFile(result);
          dispatchState({
            type: 'SET_OPTIONS',
            payload: {
              fieldName: 'sheet',
              options: result.sheetNames,
            },
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <Fragment>
      <TitleBar>Import {modeContent[type].title}</TitleBar>

      <div className='w-2/5  mx-auto mt-24'>
        <div className='flex justify-center items-center my-5'>
          <label className='w-32'>File Name</label>
          <FileInput
            className=''
            fileName={choosenFile && choosenFile.fileName}
            onClick={chooseFile}
          />
        </div>
        <FormField
          properties={{ ...sheetComponent, disabled: choosenFile === null }}
          component={SelectInput}
          dispatchState={dispatchState}
        />
        <FormField
          properties={{ ...startComponent, disabled: choosenFile === null }}
          component={Input}
          dispatchState={dispatchState}
        />
        <FormField
          properties={{ ...endComponent, disabled: choosenFile === null }}
          component={Input}
          dispatchState={dispatchState}
        />
        {Object.values(fieldComponents).map((fieldComponent) => (
          <FormField
            key={fieldComponent.name}
            properties={{ ...fieldComponent, disabled: choosenFile === null }}
            component={Input}
            dispatchState={dispatchState}
          />
        ))}
        <ActionButton
          className='block mx-auto mt-10 mb-5'
          onClick={(e) => {
            modeContent[type].importHandler();
          }}
        >
          Import
        </ActionButton>
      </div>
    </Fragment>
  );
}

export default Import;
