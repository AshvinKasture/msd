import React, {
  Fragment,
  useContext,
  useRef,
  useState,
  useEffect,
} from 'react';
import useNavigationShortcuts from '../../../hooks/useNavigationShortcuts';
import AppContext from '../../../store/appContext';
import FormField from '../../../components/ui/inputs/FormField/FormField';
import TextInput from '../../../components/ui/inputs/TextInput/TextInput';
import SuggestionInput from '../../../components/ui/inputs/SuggestionInput/SuggestionInput';
import ActionButton from '../../../components/ui/ActionButton';

function EditCustomerMaster() {
  const { changePage, setContentSpinner, parameterValue } =
    useContext(AppContext);

  const [customerList, setCustomerList] = useState([]);
  const [editFieldsDisabled, setEditFieldsDisabled] = useState(true);

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
    defaultFocusedFieldName: 'customerName',
  });

  useEffect(() => {
    getCustomerList();
  }, []);

  useEffect(() => {
    if (parameterValue) {
      customerNameRef.ref.current.setValue(parameterValue);
      fillSelectedCustomerDetails(parameterValue);
    }
  }, [parameterValue]);

  async function getCustomerList() {
    const customers = await customerMasterModule.getCustomers();
    setCustomerList(
      customers.map((customerItem) => customerItem.customer_name)
    );
  }

  async function fillSelectedCustomerDetails(value) {
    setContentSpinner(true);
    const {
      customer_code: customerCode,
      customer_address: customerAddress,
      gst_no: gstNo,
    } = await customerMasterModule.getCustomerDetails(value);
    customerCodeRef.ref.current.setValue(customerCode);
    customerAddressRef.ref.current.setValue(customerAddress);
    gstNoRef.ref.current.setValue(gstNo);
    setContentSpinner(false);
  }

  async function editCustomer(e) {
    setContentSpinner(true);
    const customerData = {
      customerCode: customerCodeRef.ref.current.value,
      customerName: customerNameRef.ref.current.value,
      customerAddress: customerAddressRef.ref.current.value,
      gstNo: gstNoRef.ref.current.value,
    };
    if (customerData.customerName !== '') {
      await customerMasterModule.editCustomer(customerData);
      setContentSpinner(false);
      changePage('HOME', null, null);
    }
    setContentSpinner(false);
  }

  function resetPage() {
    setEditFieldsDisabled(true);
    customerCodeRef.ref.current.reset();
    customerNameRef.ref.current.reset();
    customerAddressRef.ref.current.reset();
    gstNoRef.ref.current.reset();
  }

  function clearFields() {
    customerCodeRef.ref.current.reset();
    customerAddressRef.ref.current.reset();
    gstNoRef.ref.current.reset();
  }

  return (
    <Fragment>
      <FormField
        label='Customer Code'
        component={TextInput}
        componentProperties={{
          name: 'customerCode',
          disabled: editFieldsDisabled,
          dispatchNavigationShortcut,
        }}
        ref={customerCodeRef.ref}
      />
      <FormField
        label='Customer Name'
        component={SuggestionInput}
        componentProperties={{
          name: 'customerName',
          suggestions: customerList,
          dispatchNavigationShortcut,
          strict: true,
          extendChangeHandler: () => {
            setTimeout(() => {
              const { value, isValid } = customerNameRef.ref.current;
              if (isValid) {
                fillSelectedCustomerDetails(value);
                setEditFieldsDisabled(false);
              } else {
                setEditFieldsDisabled(true);
                clearFields();
              }
            }, 100);
          },
          extendFillHandler: (value) => {
            fillSelectedCustomerDetails(value);
            setEditFieldsDisabled(false);
          },
        }}
        ref={customerNameRef.ref}
      />
      <FormField
        label='Customer Address'
        component={TextInput}
        componentProperties={{
          name: 'customerAddress',
          disabled: editFieldsDisabled,
          dispatchNavigationShortcut,
        }}
        ref={customerAddressRef.ref}
      />
      <FormField
        label='GST No'
        component={TextInput}
        componentProperties={{
          name: 'gstNo',
          disabled: editFieldsDisabled,
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
        <ActionButton className='bg-green-500' onClick={editCustomer}>
          Save
        </ActionButton>
      </div>
    </Fragment>
  );
}

export default EditCustomerMaster;
