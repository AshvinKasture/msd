import React, { useState, createContext } from 'react';

const AppContext = createContext({
  page: '',
  appName: '',
  changePage: (pageName, type) => {},
  navMenu: [],
  contentSpinner: null,
  setContentSpinner: (value) => {},
});

export const AppContextProvider = ({ children }) => {
  const { HOME, ITEM_MASTER, CUSTOMER_MASTER, PO_MASTER, IMPORT } = pages;
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
        },
        {
          text: 'Delete',
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
        },
        {
          text: 'Delete',
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
        },
        {
          text: 'Delete',
        },
      ],
    },
    {
      text: 'Delivery Challan',
      subMenu: [
        {
          text: 'Create',
        },
        {
          text: 'View',
        },
        {
          text: 'Modify',
        },
        {
          text: 'Delete',
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
  const [page, setPage] = useState(PO_MASTER);
  const [type, setType] = useState(CREATE);
  const [contentSpinner, setContentSpinner] = useState(false);
  const appName = 'Monthly Schedule and Dispatch';

  const changePage = (pageName, type = null) => {
    setPage(pageName);
    setType(type);
  };

  pageModule.listenPageChanges(changePage);

  return (
    <AppContext.Provider
      value={{
        page,
        type,
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
