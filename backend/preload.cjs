const { contextBridge, ipcRenderer } = require('electron');
const { windowCodes, comCodes, pages, types } = require('./codes.cjs');

contextBridge.exposeInMainWorld('pageModule', {
  tts: async () => {
    ipcRenderer.invoke('COMS', {
      code: 'TTS',
    });
  },
  listenPageChanges: (changePage) => {
    ipcRenderer.on('PAGE', (event, pageName) => {
      changePage(pageName);
    });
  },
});

contextBridge.exposeInMainWorld('menuModule', {
  openWindow: (windowName) => {
    ipcRenderer.invoke('COMS', {
      code: comCodes.OPEN_WINDOW,
      data: {
        windowName,
      },
    });
  },
});

contextBridge.exposeInMainWorld('windowCodes', { ...windowCodes });
contextBridge.exposeInMainWorld('pages', { ...pages });
contextBridge.exposeInMainWorld('types', { ...types });

contextBridge.exposeInMainWorld('itemMasterModule', {
  createItem: async (itemData) => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.CREATE_ITEM,
      data: itemData,
    });
  },
  getItems: async () => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.GET_ITEMS,
    });
  },
  getItemDetails: async (drawingNo) => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.GET_ITEM_DETAILS,
      data: drawingNo,
    });
  },
  editItem: async (itemData) => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.EDIT_ITEM,
      data: itemData,
    });
  },
  deleteItem: async (drawingNo) => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.DELETE_ITEM,
      data: drawingNo,
    });
  },
  importItemMaster: (options) => {
    ipcRenderer.invoke('COMS', {
      code: comCodes.IMPORT_ITEM_MASTER,
      data: options,
    });
  },
});

contextBridge.exposeInMainWorld('poMasterModule', {
  createPo: async (poData) => {
    await ipcRenderer.invoke('COMS', {
      code: comCodes.CREATE_PO,
      data: poData,
    });
  },
  getPoList: async () => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.GET_ALL_PO,
    });
  },
  getItemsOfPo: async (poId) => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.GET_ITEMS_OF_PO,
      data: poId,
    });
  },
  getPoDetails: async (poNumber) => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.GET_PO_DETAILS,
      data: poNumber,
    });
  },
  editPo: async (poData) => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.EDIT_PO,
      data: poData,
    });
  },
  deletePo: async (poNumber) => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.DELETE_PO,
      data: poNumber,
    });
  },
});

contextBridge.exposeInMainWorld('customerMasterModule', {
  createCustomer: async (customerData) => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.CREATE_CUSTOMER,
      data: customerData,
    });
  },
  getCustomers: async () => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.GET_CUSTOMERS,
    });
  },
  getCustomerById: async (customerId) => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.GET_CUSTOMER_BY_ID,
      data: customerId,
    });
  },
  getCustomerByName: async (customerName) => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.GET_CUSTOMER_BY_NAME,
      data: customerName,
    });
  },
  getCustomerDetails: async (customerName) => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.GET_CUSTOMER_DETAILS,
      data: customerName,
    });
  },
  editCustomer: async (customerData) => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.EDIT_CUSTOMER,
      data: customerData,
    });
  },
  deleteCustomer: async (customerName) => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.DELETE_CUSTOMER,
      data: customerName,
    });
  },
  importCustomerMaster: (options) => {
    ipcRenderer.invoke('COMS', {
      code: comCodes.IMPORT_CUSTOMER_MASTER,
      data: options,
    });
  },
});

contextBridge.exposeInMainWorld('fileModule', {
  chooseExcelFile: async () => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.OPEN_EXCEL_FILE,
    });
  },
});
