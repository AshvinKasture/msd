import React, { Fragment, useState, useEffect, useContext } from 'react';
import TitleBar from '../../components/layout/TitleBar/TitleBar';
import ActionButton from '../../components/ui/ActionButton';
import AppContext from '../../store/appContext';
import FormField from '../../components/ui/inputs/FormField/FormField';
import TextInput from '../../components/ui/inputs/TextInput/TextInput';
import SuggestionInput from '../../components/ui/inputs/SuggestionInput/SuggestionInput';
import useNavigationShortcuts from '../../hooks/useNavigationShortcuts';
import { isGstNo } from '../../helpers/basicValidations';

function CustomerMaster({ type }) {
  const { changePage, setContentSpinner } = useContext(AppContext);
  const [customerList, setCustomerList] = useState([]);

  const [
    [customerNameRef, customerAddressRef, gstNoRef],
    dispatchNavigationShortcut,
    _,
  ] = useNavigationShortcuts({
    sequence: ['customerName', 'customerAddress', 'gstNo'],
    defaultFocused: 'customerName',
  });

  useEffect(() => {
    getCustomerList();
    resetPage();
  }, [type]);

  async function getCustomerList() {
    const customers = await customerMasterModule.getCustomers();
    setCustomerList(
      customers.map((customerItem) => customerItem.customer_name)
    );
  }

  async function submitForm(e) {
    setContentSpinner(true);
    const customerData = {
      customerName: customerNameRef.ref.current.value,
      customerAddress: customerAddressRef.ref.current.value,
      gstNo: gstNoRef.ref.current.value,
    };
    if (customerData.customerName !== '') {
      await customerMasterModule.createCustomer(customerData);
      resetPage();
    }
    setContentSpinner(false);
  }

  function resetPage() {
    customerNameRef.ref.current.reset();
    customerAddressRef.ref.current.reset();
    gstNoRef.ref.current.reset();
  }

  async function getCustomerDetails(value) {
    const { customer_address: customerAddress, gst_no: gstNo } =
      await customerMasterModule.getCustomerDetails(value);
    customerAddressRef.ref.current.setValue(customerAddress);
    gstNoRef.ref.current.setValue(gstNo);
  }

  async function editCustomer(e) {
    setContentSpinner(true);
    const customerData = {
      customerName: customerNameRef.ref.current.value,
      customerAddress: customerAddressRef.ref.current.value,
      gstNo: gstNoRef.ref.current.value,
    };
    if (customerData.customerName !== '') {
      await customerMasterModule.editCustomer(customerData);
      resetPage();
    }
    setContentSpinner(false);
  }

  async function deleteCustomer(e) {
    const customerName = customerNameRef.ref.current.value;
    if (customerName !== '') {
      setContentSpinner(true);
      const result = await customerMasterModule.deleteCustomer(customerName);
      setContentSpinner(false);
      if (result) {
        changePage('HOME');
      }
    }
  }

  const modeContent = {
    CREATE: (
      <Fragment>
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

        <ActionButton className='block mx-auto mt-24' onClick={submitForm}>
          Save
        </ActionButton>
      </Fragment>
    ),
    VIEW: (
      <Fragment>
        <FormField
          label='Customer Name'
          component={SuggestionInput}
          componentProperties={{
            name: 'customerName',
            suggestions: customerList,
            strict: true,
            extendChangeHandler: () => {
              setTimeout(() => {
                const { value, isValid } = customerNameRef.ref.current;
                if (isValid) {
                  getCustomerDetails(value);
                }
              }, 100);
            },
            extendFillHandler: (value) => {
              getCustomerDetails(value);
            },
          }}
          ref={customerNameRef.ref}
        />
        <FormField
          label='Customer Address'
          component={TextInput}
          componentProperties={{
            disabled: true,
          }}
          ref={customerAddressRef.ref}
        />
        <FormField
          label='GST No'
          component={TextInput}
          componentProperties={{
            disabled: true,
          }}
          ref={gstNoRef.ref}
        />
        <ActionButton
          className='block mx-auto mt-24'
          onClick={(e) => {
            changePage(pages.HOME);
          }}
        >
          Back
        </ActionButton>
      </Fragment>
    ),
    EDIT: (
      <Fragment>
        <FormField
          label='Customer Name'
          component={SuggestionInput}
          componentProperties={{
            name: 'customerName',
            suggestions: customerList,
            strict: true,
            extendChangeHandler: () => {
              setTimeout(() => {
                const { value, isValid } = customerNameRef.ref.current;
                if (isValid) {
                  getCustomerDetails(value);
                }
              }, 100);
            },
            extendFillHandler: (value) => {
              getCustomerDetails(value);
            },
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
            className='bg-red-500'
            onClick={(e) => {
              resetPage();
            }}
          >
            Discard
          </ActionButton>
          <ActionButton className='bg-green-500' onClick={editCustomer}>
            Save
          </ActionButton>
        </div>
      </Fragment>
    ),
    DELETE: (
      <Fragment>
        <FormField
          label='Customer Name'
          component={SuggestionInput}
          componentProperties={{
            name: 'customerName',
            suggestions: customerList,
            strict: true,
            extendChangeHandler: () => {
              setTimeout(() => {
                const { value, isValid } = customerNameRef.ref.current;
                if (isValid) {
                  getCustomerDetails(value);
                }
              }, 100);
            },
            extendFillHandler: (value) => {
              getCustomerDetails(value);
            },
          }}
          ref={customerNameRef.ref}
        />
        <FormField
          label='Customer Address'
          component={TextInput}
          componentProperties={{
            disabled: true,
          }}
          ref={customerAddressRef.ref}
        />
        <FormField
          label='GST No'
          component={TextInput}
          componentProperties={{
            disabled: true,
          }}
          ref={gstNoRef.ref}
        />
        <ActionButton
          className='block mx-auto mt-24 bg-red-500'
          onClick={(e) => {
            deleteCustomer();
          }}
        >
          Delete
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

export default CustomerMaster;
