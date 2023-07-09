import React, { Fragment, useContext, useRef } from 'react';
import ActionButton from '../../../components/ui/ActionButton';
import FormField from '../../../components/ui/inputs/FormField/FormField';
import TextInput from '../../../components/ui/inputs/TextInput/TextInput';
import { isGstNo } from '../../../helpers/basicValidations';
import useNavigationShortcuts from '../../../hooks/useNavigationShortcuts';
import AppContext from '../../../store/appContext';

function CreateCustomerMaster() {
  const { changePage, setContentSpinner } = useContext(AppContext);

  async function createCustomer(e) {
    setContentSpinner(true);
    const customerData = {
      customerCode: customerCodeRef.Ref.ref.current.value,
      customerName: customerNameRef.ref.current.value,
      customerAddress: customerAddressRef.ref.current.value,
      gstNo: gstNoRef.ref.current.value,
    };
    if (customerData.customerName !== '') {
      await customerMasterModule.createCustomer(customerData);
      setContentSpinner(false);
      changePage(pages.CUSTOMER_MASTER, types.VIEW, customerData.customerName);
    }
    setContentSpinner(false);
  }

  // const customerCodeRef = useRef(null);
  // const customerNameRef = useRef(null);
  // const customerAddressRef = useRef(null);
  // const gstNoRef = useRef(null);

  const [
    [customerCodeRef, customerNameRef, customerAddressRef, gstNoRef],
    dispatchNavigationShortcut,
  ] = useNavigationShortcuts({
    fieldList: [
      {
        name: 'customerCode',
        focusable: true,
      },
      {
        name: 'customerName',
        focusable: true,
      },
      {
        name: 'customerAddress',
        focusable: true,
      },
      {
        name: 'gstNo',
        focusable: true,
      },
    ],
    defaultFocusedFieldName: 'customerCode',
  });

  return (
    <Fragment>
      <FormField
        label='Customer Code'
        component={TextInput}
        componentProperties={{
          name: 'customerCode',
          dispatchNavigationShortcut,
        }}
        ref={customerCodeRef.ref}
      />
      <FormField
        label='Customer Name'
        component={TextInput}
        componentProperties={{
          name: 'customerName',
          dispatchNavigationShortcut,
        }}
        ref={customerNameRef.ref}
      />
      <FormField
        label='Customer Address'
        component={TextInput}
        componentProperties={{
          name: 'customerAddress',
          dispatchNavigationShortcut,
        }}
        ref={customerAddressRef.ref}
      />
      <FormField
        label='GST No'
        component={TextInput}
        componentProperties={{
          name: 'gstNo',
          acceptedInput: ({ oldValue, newValue }) => {
            return isGstNo(newValue) ? newValue.toUpperCase() : oldValue;
          },
          dispatchNavigationShortcut,
        }}
        ref={gstNoRef.ref}
      />

      <div className='flex justify-center gap-x-10 mt-24'>
        <ActionButton
          className='bg-gray-500'
          onClick={(e) => {
            changePage(pages.HOME);
          }}
        >
          Back
        </ActionButton>
        <ActionButton
          className='bg-red-500'
          onClick={(e) => {
            resetPage();
          }}
        >
          Discard
        </ActionButton>
        <ActionButton className='bg-green-500' onClick={createCustomer}>
          Save
        </ActionButton>
      </div>
    </Fragment>
  );
}

export default CreateCustomerMaster;
