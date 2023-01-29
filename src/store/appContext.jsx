import React, { useState, createContext } from 'react';

const AppContext = createContext({
  page: '',
  appName: '',
  changePage: (pageName, type) => {},
  navMenu: [],
  contentSpinner: null,
  setContentSpinner: (value) => {},
  // pages: {HOME, CREATE_ITEM_MASTER}
});

export const AppContextProvider = ({ children }) => {
  const { HOME, ITEM_MASTER, VENDOR_MASTER, IMPORT } = pages;
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
          pageValue: VENDOR_MASTER,
          type: CREATE,
        },
        {
          text: 'View',
          pageValue: VENDOR_MASTER,
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
          type: VENDOR_MASTER,
        },
      ],
    },
    {
      text: 'PO Master',
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
  const [page, setPage] = useState(HOME);
  const [type, setType] = useState(null);
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
