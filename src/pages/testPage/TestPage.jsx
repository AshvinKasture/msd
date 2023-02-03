import React, { useRef, useEffect, useState } from 'react';
import TextInput from '../../components/ui/inputs/TextInput/TextInput';
import SuggestionInput from '../../components/ui/inputs/SuggestionInput/SuggestionInput';
import SelectInput from '../../components/ui/inputs/SelectInput/SelectInput';
import { isPositiveInteger, makeCaps } from '../../helpers/basicValidations';
import useNavigationShortcuts from '../../hooks/useNavigationShortcuts';

function TestPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [[nameRef, ageRef, customerRef, itemRef], dispatchNavigationShortcut] =
    useNavigationShortcuts({
      sequence: ['name', 'age', 'customer', 'item'],
      defaultFocused: 'name',
      lastAction: submitHandler,
    });

  useEffect(() => {
    async function getItems() {
      const items = await itemMasterModule.getItems();
      setSuggestions(items.map((item) => item.drawing_no));
    }
    getItems();
    async function getCustomers() {
      const customers = await customerMasterModule.getCustomers();
      setCustomers(customers.map((customer) => customer.customer_name));
    }
    getCustomers();
    nameRef.ref.current.focus();
  }, []);

  function submitHandler() {
    console.log(
      `${nameRef.ref.current.value} of ${
        ageRef.ref.current.value
      } years has selected item ${
        itemRef.ref.current.isValid ? itemRef.ref.current.value : ''
      } for ${customerRef.ref.current.value}`
    );
  }

  return (
    <div className='flex flex-col justify-center items-center gap-y-10'>
      <div> TestPage</div>
      <TextInput
        placeholder='Name'
        name='name'
        acceptedInput={({ newValue }) => makeCaps(newValue)}
        dispatchNavigationShortcut={dispatchNavigationShortcut}
        ref={nameRef.ref}
      />
      <TextInput
        placeholder='Age'
        name='age'
        acceptedInput={({ oldValue, newValue }) => {
          return isPositiveInteger(newValue) && +newValue <= 100
            ? newValue
            : oldValue;
        }}
        dispatchNavigationShortcut={dispatchNavigationShortcut}
        ref={ageRef.ref}
      />
      <SelectInput
        options={customers}
        name='customer'
        strict={false}
        dispatchNavigationShortcut={dispatchNavigationShortcut}
        ref={customerRef.ref}
      />
      <SuggestionInput
        placeholder='Item Id'
        name='item'
        suggestions={suggestions}
        dispatchNavigationShortcut={dispatchNavigationShortcut}
        ref={itemRef.ref}
      />
      <button className='border border-black shadow-sm' onClick={submitHandler}>
        Click
      </button>
    </div>
  );
}

export default TestPage;
