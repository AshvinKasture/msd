import React, { Fragment, useEffect, useContext } from 'react';
import TitleBar from '../../components/layout/TitleBar/TitleBar';
import useForm from '../../hooks/useForm';
import InputField from '../../components/ui/InputField';
import SuggestionField from '../../components/ui/SuggestionField';
import ActionButton from '../../components/ui/ActionButton';
import { isEmpty } from '../../helpers/basicValidations';
import AppContext from '../../store/appContext';

function VendorMaster({ type }) {
  // const {vendorNameName, vendorAddressName, gstNoName} = ['vendorName','vendorAddress',]
  const { CREATE, VIEW, EDIT, DELETE } = types;
  const { changePage } = useContext(AppContext);
  const initialProperties = [
    {
      label: 'Customer Name',
      name: 'customerName',
      type: 'text',
      validationFunction: function (value) {
        return !isEmpty(value);
      },
    },
    {
      label: 'Customer Adrress',
      name: 'customerAddress',
      type: 'text',
      validationFunction: function (value) {
        return !isEmpty(value);
      },
    },
    {
      label: 'GST No',
      name: 'gstNo',
      type: 'text',
      validationFunction: function (value) {
        return !isEmpty(value);
      },
    },
  ];

  const [
    {
      components: {
        customerName: customerNameComponent,
        customerAddress: customerAddressComponent,
        gstNo: gstNoComponent,
      },
      isFormValid,
    },
    dispatchState,
  ] = useForm(initialProperties);

  useEffect(() => {
    if ([VIEW, EDIT, DELETE].includes(type)) {
      async function getCustomersFromDatabase() {
        const customers = await vendorMasterModule.getVendors();
        dispatchState({
          type: 'SET_SUGGESTIONS',
          payload: {
            fieldName: 'customerName',
            suggestions: customers.map((customer) => customer.vendor_name),
          },
        });
      }
      getCustomersFromDatabase();
    }
  }, [type]);

  async function fillValues(customerName) {
    const { vendor_address: customerAddress, gst_no: gstNo } =
      await vendorMasterModule.getCustomerByName(customerName);
    dispatchState({
      type: 'SET_VALUE',
      payload: {
        fieldName: 'customerAddress',
        value: customerAddress,
      },
    });
    dispatchState({
      type: 'SET_VALUE',
      payload: {
        fieldName: 'gstNo',
        value: gstNo,
      },
    });
  }

  useEffect(() => {
    if ([VIEW, EDIT, DELETE].includes(type)) {
      const checkIfValueChanged = async function () {
        const { value, isValid } = customerNameComponent;
        if (isValid) {
          await fillValues(value);
        }
      };
      checkIfValueChanged();
    }
  }, [customerNameComponent.value, customerNameComponent.isValid]);

  useEffect(() => {
    dispatchState({ type: 'RESET_FORM' });
  }, [type]);

  async function submitForm(e) {
    if (isFormValid) {
      const customerName = customerNameComponent.value;
      const customerAddress = customerAddressComponent.value;
      const gstNo = gstNoComponent.value;
      const result = await vendorMasterModule.createVendor({
        vendorName,
        vendorAddress,
        gstNo,
      });
      if (result) {
        dispatchState({ type: 'RESET_FORM' });
      }
    } else {
      dispatchState({ type: 'SHOW_VALIDITY' });
    }
  }

  const modeContent = {
    CREATE: (
      <Fragment>
        <InputField
          component={customerNameComponent}
          dispatchState={dispatchState}
        />
        <InputField
          component={customerAddressComponent}
          dispatchState={dispatchState}
        />
        <InputField component={gstNoComponent} dispatchState={dispatchState} />
        <ActionButton className='block mx-auto' onClick={submitForm}>
          Save
        </ActionButton>
      </Fragment>
    ),
    VIEW: (
      <Fragment>
        <SuggestionField
          component={customerNameComponent}
          dispatchState={dispatchState}
        />
        <InputField
          component={customerAddressComponent}
          dispatchState={dispatchState}
          disabled={true}
        />
        <InputField
          component={gstNoComponent}
          dispatchState={dispatchState}
          disabled={true}
        />
        <ActionButton
          className='block mx-auto'
          onClick={(e) => {
            changePage(pages.HOME);
          }}
        >
          Back
        </ActionButton>
      </Fragment>
    ),
  };
  return (
    <Fragment>
      <TitleBar>Customer Master</TitleBar>
      <div className='mx-auto mt-24'>{modeContent[type]}</div>
    </Fragment>
  );
}

export default VendorMaster;
