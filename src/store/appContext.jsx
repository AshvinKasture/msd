import React, { useState, createContext } from 'react';

const AppContext = createContext({
  page: '',
  type: '',
  parameterValue: null,
  changePage: (pageName, type) => {},
  appName: '',
  navMenu: [],
  contentSpinner: null,
  setContentSpinner: (value) => {},
});

export const AppContextProvider = ({ children }) => {
  const {
    HOME,
    ITEM_MASTER,
    CUSTOMER_MASTER,
    PO_MASTER,
    DELIVERY_CHALLAN,
    IMPORT,
    TEST,
  } = pages;
  const { CREATE, VIEW, EDIT, DELETE } = types;
  const navMenu = [
    {
      text: 'Home',
      active: true,
      pageValue: HOME,
    },
    {
      text: 'Item Master',
      subMenu: [
        {
          text: 'Create',
          pageValue: ITEM_MASTER,
          type: CREATE,
        },
        {
          text: 'View',
          pageValue: ITEM_MASTER,
          type: VIEW,
        },
        {
          text: 'Modify',
          pageValue: ITEM_MASTER,
          type: EDIT,
        },
        {
          text: 'Delete',
          pageValue: ITEM_MASTER,
          type: DELETE,
        },
        {
          text: 'Import',
          pageValue: IMPORT,
          type: ITEM_MASTER,
        },
      ],
    },
    {
      text: 'Customer Master',
      subMenu: [
        {
          text: 'Create',
          pageValue: CUSTOMER_MASTER,
          type: CREATE,
        },
        {
          text: 'View',
          pageValue: CUSTOMER_MASTER,
          type: VIEW,
        },
        {
          text: 'Modify',
          pageValue: CUSTOMER_MASTER,
          type: EDIT,
        },
        {
          text: 'Delete',
          pageValue: CUSTOMER_MASTER,
          type: DELETE,
        },
        {
          text: 'Import',
          pageValue: IMPORT,
          type: CUSTOMER_MASTER,
        },
      ],
    },
    {
      text: 'PO Master',
      subMenu: [
        {
          text: 'Create',
          pageValue: PO_MASTER,
          type: CREATE,
        },
        {
          text: 'View',
          pageValue: PO_MASTER,
          type: VIEW,
        },
        {
          text: 'Modify',
          pageValue: PO_MASTER,
          type: EDIT,
        },
        {
          text: 'Delete',
          pageValue: PO_MASTER,
          type: DELETE,
        },
      ],
    },
    {
      text: 'Delivery Challan',
      subMenu: [
        {
          text: 'Create',
          pageValue: DELIVERY_CHALLAN,
          type: CREATE,
        },
        {
          text: 'View',
          pageValue: DELIVERY_CHALLAN,
          type: VIEW,
        },
        {
          text: 'Modify',
          pageValue: DELIVERY_CHALLAN,
          type: EDIT,
        },
        {
          text: 'Delete',
          pageValue: DELIVERY_CHALLAN,
          type: DELETE,
        },
      ],
    },
    {
      text: 'Master Sheet',
    },
    {
      text: 'Exit',
    },
  ];
  const [page, setPage] = useState(DELIVERY_CHALLAN);
  const [type, setType] = useState(CREATE);
  const [parameterValue, setParameterValue] = useState(null);
  const [contentSpinner, setContentSpinner] = useState(false);
  const appName = 'Monthly Schedule and Dispatch';

  const changePage = (pageName, type = null, parameterValue = null) => {
    console.log(pageName, type, parameterValue);
    setPage(pageName);
    setType(type);
    setParameterValue(parameterValue);
  };

  pageModule.listenPageChanges(changePage);

  return (
    <AppContext.Provider
      value={{
        page,
        type,
        parameterValue,
        changePage,
        appName,
        navMenu,
        contentSpinner,
        setContentSpinner,
        // pages: { HOME, CREATE_ITEM_MASTER },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
