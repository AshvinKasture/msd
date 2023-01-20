const { contextBridge, ipcRenderer } = require('electron');
const { windowCodes, comCodes, pages } = require('./codes.cjs');

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

contextBridge.exposeInMainWorld('itemMasterModule', {
  createItem: (itemData) => {
    ipcRenderer.invoke('COMS', {
      code: comCodes.CREATE_ITEM,
      data: itemData,
    });
  },
  getItems: async () => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.GET_ITEMS,
    });
  },
  getItemById: async (itemId) => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.GET_ITEM_BY_ID,
      data: itemId,
    });
  },
  getItemByDrawingNo: async (drawingNo) => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.GET_ITEM_BY_DRAWING_NO,
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
  getAllPo: async () => {
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
});

contextBridge.exposeInMainWorld('vendorMasterModule', {
  createVendor: (vendorData) => {
    ipcRenderer.invoke('COMS', {
      code: comCodes.CREATE_VENDOR,
      data: vendorData,
    });
  },
  getVendors: async () => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.GET_VENDORS,
    });
  },
  getVendorById: async (vendorId) => {
    return await ipcRenderer.invoke('COMS', {
      code: comCodes.GET_VENDOR_BY_ID,
      data: vendorId,
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
