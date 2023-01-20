const { ipcMain } = require('electron');
const path = require('path');
const XLSX = require('XLSX');
const Database = require('./database.cjs');
const { windowCodes, comCodes } = require('./codes.cjs');

class BusinessLayer {
  constructor(windowHandeler, userDataPath) {
    this.userDataPath = userDataPath;
    this.windowHandeler = windowHandeler;
    this.databasePath = 'msd.db';
    this.databasePath = path.join(this.userDataPath, 'msd.db');
    this.db = new Database(userDataPath);
    if (Database.exists(this.databasePath)) {
      this.db.connect(this.databasePath);
    } else {
      this.db.connect(this.databasePath);
      this.setupDatabase();
    }
    this.importingFile = null;
    this.blData = {};
    this.coms();
  }

  async setupDatabase() {
    const queryList = [
      {
        query:
          'CREATE TABLE item_master(item_id INTEGER PRIMARY KEY AUTOINCREMENT, drg_no VARCHAR(10), description TEXT)',
      },
      {
        query:
          'CREATE TABLE po_master(po_id INTEGER PRIMARY KEY AUTOINCREMENT, po_no VARCHAR(10), created_at DATETIME DEFAULT CURRENT_TIMESTAMP)',
      },
      {
        query:
          'CREATE TABLE po_items(po_id INTEGER, item_id INTEGER, quantity INTEGER, FOREIGN KEY (po_id) REFERENCES po_master(po_id), FOREIGN KEY (item_id) REFERENCES item_master(item_id))',
      },
      {
        query:
          'CREATE TABLE vendor_master(vendor_id INTEGER PRIMARY KEY AUTOINCREMENT, vendor_name TEXT, vendor_address TEXT, gst_no VARCHAR(30))',
      },
    ];
    for (let i = 0; i < queryList.length; i++) {
      await this.db.exec(queryList[i]);
    }

    await this.insertDummyData();
  }

  async insertDummyData() {
    const queryList = [
      //   {
      //     query:
      //       'INSERT INTO user(username, password) VALUES($username, $password)',
      //     params: {
      //       $username: 'user',
      //       $password: 'passwd',
      //     },
      //   },
    ];
    for (let i = 0; i < queryList.length; i++) {
      await this.db.exec(queryList[i]);
    }
  }

  coms() {
    ipcMain.handle('COMS', async (event, payload) => {
      const { code, data } = payload;
      // let windowName, drawingNo, description, itemId, options, vendorName, vendorAddress, gstNo
      switch (code) {
        case comCodes.OPEN_WINDOW:
          const { windowName } = data;
          this.windowHandeler.openWindow(windowName);
          break;
        case comCodes.OPEN_EXCEL_FILE:
          return this.openExcelFile();
        case comCodes.CREATE_ITEM:
          await this.createItem(data);
          break;
        case comCodes.GET_ITEMS:
          return await this.getItems();
        case comCodes.GET_ITEM_BY_ID:
          return await this.getItemById(data);
        case comCodes.GET_ITEM_BY_DRAWING_NO:
          return await this.getItemByDrawingNo(data);
        case comCodes.IMPORT_ITEM_MASTER:
          await this.importItemMaster(data);
          break;
        case comCodes.CREATE_PO:
          await this.createPo(data);
          break;
        case comCodes.GET_ALL_PO:
          return await this.getAllPo();
        case comCodes.GET_ITEMS_OF_PO:
          return await this.getItemsOfPo(data);
        case comCodes.CREATE_VENDOR:
          await this.createVendor(data);
          break;
        case comCodes.GET_VENDORS:
          return await this.getVendors();
        case comCodes.GET_VENDOR_BY_ID:
          return await this.getVendorById(data);
        default:
          console.error(`No COMS code found for ${code}`);
      }
    });
  }

  openExcelFile() {
    const choosenFiles = this.windowHandeler.openFile({
      title: 'Import Item Master',
      buttonLabel: 'Import',
      filters: [
        {
          name: 'Spreadsheets',
          extensions: ['xlsx', 'xls', 'xlsb'],
        },
      ],
    });
    if (choosenFiles.length !== 1) {
      throw Error('Accurate number of files did not get selected');
    }
    const filePath = choosenFiles[0];
    const file = XLSX.readFile(filePath);
    this.importingFile = file;
    return {
      fileName: path.basename(filePath),
      sheetNames: file.SheetNames,
      file,
    };
  }

  extractColFromExcel({ sheetName, col, start, end }) {
    const colArray = [];
    const sheet = this.importingFile.Sheets[sheetName];
    for (let pointer = +start; pointer <= +end; pointer++) {
      colArray.push(sheet[`${col}${pointer}`].v);
    }
    return colArray;
  }

  async createItem({ drawingNo, description }) {
    try {
      const response = await this.db.exec({
        query:
          'INSERT INTO item_master(drg_no, description) VALUES($drgNo, $description);',
        params: {
          $drgNo: drawingNo,
          $description: description,
        },
      });
      await this.windowHandeler.showInfoBox({ message: 'Item created' });
      this.windowHandeler.openWindow(windowCodes.HOME);
    } catch (error) {
      console.error(error);
      this.windowHandeler.showErrorBox({
        message: 'Error in creating item',
      });
    }
  }

  async getItems() {
    try {
      const result = await this.db.exec({
        query: 'SELECT item_id, drg_no FROM item_master;',
      });
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getItemById(itemId) {
    try {
      const result = await this.db.exec({
        query: 'SELECT * FROM item_master WHERE item_id=$itemId;',
        params: {
          $itemId: itemId,
        },
      });
      if (result.length === 1) {
        return result[0];
      } else {
        throw Error('Did not get a single item in query');
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getItemByDrawingNo(drawingNo) {
    try {
      const result = await this.db.exec({
        query: 'SELECT * FROM item_master WHERE drg_no=$drgNo',
        params: {
          $drgNo: drawingNo,
        },
      });
      if (result.length === 1) {
        return result[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async checkIfItemExists(itemId) {
    try {
      const result = await this.db.exec({
        query: 'SELECT item_id FROM item_master WHERE item_id=$itemId;',
        params: {
          $itemId: itemId,
        },
      });
      return result.length === 1;
    } catch (error) {
      console.error(error);
    }
  }

  async importItemMaster(options) {
    try {
      const { sheetName, start, end, cols } = options;
      const drawingNoCol = this.extractColFromExcel({
        sheetName,
        start,
        end,
        col: cols.drawingNo,
      });
      const descriptionCol = this.extractColFromExcel({
        sheetName,
        start,
        end,
        col: cols.description,
      });
      const alreadyExisting = [];
      for (let i = 0; i < drawingNoCol.length; i++) {
        const drawingNo = drawingNoCol[i];
        const description = descriptionCol[i];
        const exists = await this.checkIfItemExists(drawingNo);
        if (!exists) {
          await this.db.exec({
            query:
              'INSERT INTO item_master(drg_no, description) VALUES($drgNo, $description)',
            params: {
              $drgNo: drawingNo,
              $description: description,
            },
          });
        } else {
          alreadyExisting.push(drawingNo);
        }
      }
      if (alreadyExisting.length === 0) {
        this.windowHandeler.showInfoBox({ message: 'Item Master imported' });
      } else {
        this.windowHandeler.showInfoBox({
          message: `${alreadyExisting.length} skipped and imported others`,
        });
      }
      this.windowHandeler.openWindow(windowCodes.HOME);
    } catch (error) {
      console.error(error);
    }
  }

  async createPo({ poNumber, itemRows }) {
    try {
      await this.db.exec({
        query: 'INSERT INTO po_master(po_no) VALUES($poNumber)',
        params: {
          $poNumber: poNumber,
        },
      });
      const result = await this.db.exec({
        query: 'SELECT MAX(po_id) AS po_id FROM po_master',
      });
      let poId;
      if (result.length === 1) {
        poId = result[0].po_id;
      } else {
        throw Error('Incorrect no of rows returned');
      }
      for (let i = 0; i < itemRows.length; i++) {
        const { drawingNo, quantity } = itemRows[i];
        const itemId = (await this.getItemByDrawingNo(drawingNo)).item_id;
        await this.db.exec({
          query:
            'INSERT INTO po_items(po_id, item_id, quantity) VALUES($poId, $itemId, $quantity)',
          params: {
            $poId: poId,
            $itemId: itemId,
            $quantity: quantity,
          },
        });
      }
      this.windowHandeler.showInfoBox({ message: 'PO created' });
      this.windowHandeler.openWindow(windowCodes.HOME);
    } catch (error) {
      console.error(error);
    }
  }

  async getAllPo() {
    return await this.db.exec({
      query: 'SELECT * FROM po_master',
    });
  }

  async getItemsOfPo(poId) {
    return await this.db.exec({
      query: 'SELECT * FROM po_items WHERE po_id=$poId',
      params: {
        $poId: poId,
      },
    });
  }

  async createVendor({ vendorName, vendorAddress, gstNo }) {
    try {
      const response = await this.db.exec({
        query:
          'INSERT INTO vendor_master(vendor_name, vendor_address, gst_no) VALUES($vendorName, $vendorAddress, $gstNo)',
        params: {
          $vendorName: vendorName,
          $vendorAddress: vendorAddress,
          $gstNo: gstNo,
        },
      });
      await this.windowHandeler.showInfoBox({ message: 'Vendor created' });
      this.windowHandeler.openWindow(windowCodes.HOME);
    } catch (error) {
      console.error(error);
    }
  }

  async getVendors() {
    try {
      return await this.db.exec({
        query: 'SELECT vendor_id, vendor_name FROM vendor_master;',
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getVendorById(vendorId) {
    try {
      const result = await this.db.exec({
        query: 'SELECT * FROM vendor_master WHERE vendor_id=$vendorId',
        params: {
          $vendorId: vendorId,
        },
      });
      if (result.length === 1) {
        return result[0];
      } else {
        throw Error('Did not get a single vendor in query');
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = BusinessLayer;