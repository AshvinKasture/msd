const { ipcMain } = require('electron');
const path = require('path');
const XLSX = require('XLSX');
const Database = require('./database.cjs');
const { pages, windowCodes, comCodes } = require('./codes.cjs');

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
          'CREATE TABLE item_master(item_id INTEGER PRIMARY KEY AUTOINCREMENT, drawing_no VARCHAR(10), description TEXT)',
      },
      {
        query:
          'CREATE TABLE po_master(po_id INTEGER PRIMARY KEY AUTOINCREMENT, po_no VARCHAR(10), customer_id INTEGER, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (customer_id) REFERENCES customer_master(customer_id))',
      },
      {
        query:
          'CREATE TABLE po_items(po_id INTEGER, item_id INTEGER, quantity INTEGER, FOREIGN KEY (po_id) REFERENCES po_master(po_id), FOREIGN KEY (item_id) REFERENCES item_master(item_id))',
      },
      {
        query:
          'CREATE TABLE customer_master(customer_id INTEGER PRIMARY KEY AUTOINCREMENT, customer_name TEXT, customer_address TEXT, gst_no VARCHAR(30))',
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
      switch (code) {
        case comCodes.OPEN_WINDOW:
          const { windowName } = data;
          this.windowHandeler.openWindow(windowName);
          break;
        case comCodes.OPEN_EXCEL_FILE:
          return this.openExcelFile();
        case comCodes.CREATE_ITEM:
          return await this.createItem(data);
        case comCodes.GET_ITEMS:
          return await this.getItems();
        case comCodes.GET_ITEM_DETAILS:
          return await this.getItemDetails(data);
        case comCodes.EDIT_ITEM:
          return await this.editItem(data);
        case comCodes.DELETE_ITEM:
          return await this.deleteItem(data);
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
        case comCodes.GET_PO_DETAILS:
          return await this.getPoDetails(data);
        case comCodes.CREATE_CUSTOMER:
          return await this.createCustomer(data);
        case comCodes.GET_CUSTOMERS:
          return await this.getCustomers();
        case comCodes.GET_CUSTOMER_BY_ID:
          return await this.getCustomerById(data);
        case comCodes.GET_CUSTOMER_BY_NAME:
          return await this.getCustomerByName(data);
        case comCodes.GET_CUSTOMER_DETAILS:
          return await this.getCustomerDetails(data);
        case comCodes.IMPORT_CUSTOMER_MASTER:
          return await this.importCustomerMaster(data);
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
      return null;
    }
    const filePath = choosenFiles[0];
    const file = XLSX.readFile(filePath);
    this.importingFile = file;
    return {
      fileName: path.basename(filePath),
      sheetNames: file.SheetNames,
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
      if ((await this.getItemByDrawingNo(drawingNo)) !== null) {
        this.windowHandeler.showErrorBox({
          message: `Item ${drawingNo} already exists`,
        });
        return false;
      }
      const response = await this.db.exec({
        query:
          'INSERT INTO item_master(drawing_no, description) VALUES($drgNo, $description);',
        params: {
          $drgNo: drawingNo,
          $description: description,
        },
      });
      await this.windowHandeler.showInfoBox({ message: 'Item created' });
      return true;
    } catch (error) {
      console.error(error);
      this.windowHandeler.showErrorBox({
        message: 'Error in creating item',
      });
      return false;
    }
  }

  async getItems() {
    try {
      const result = await this.db.exec({
        query: 'SELECT item_id, drawing_no, description FROM item_master;',
      });
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getItemByDrawingNo(drawingNo) {
    try {
      const result = await this.db.exec({
        query: 'SELECT * FROM item_master WHERE drawing_no=$drgNo',
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

  async checkIfItemExists(drawingNo) {
    try {
      const result = await this.db.exec({
        query:
          'SELECT drawing_no FROM item_master WHERE drawing_no=$drawingNo;',
        params: {
          $drawingNo: drawingNo,
        },
      });
      return result.length === 1;
    } catch (error) {
      console.error(error);
    }
  }

  async getItemDetails(drawingNo) {
    try {
      const result = await this.db.exec({
        query: 'SELECT * FROM item_master WHERE drawing_no=$drawingNo',
        params: {
          $drawingNo: drawingNo,
        },
      });
      if (result.length !== 1) {
        throw Error('Did not get single item master');
      }
      return result[0];
    } catch (error) {
      console.error(error);
    }
  }

  async editItem(itemData) {
    try {
      const { drawingNo, description } = itemData;
      if (await this.checkIfItemExists(drawingNo)) {
        await this.db.exec({
          query:
            'UPDATE item_master SET description=$description WHERE drawing_no=$drawingNo',
          params: {
            $drawingNo: drawingNo,
            $description: description,
          },
        });
        await this.windowHandeler.showInfoBox({ message: 'Item updated' });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async deleteItem(drawingNo) {
    try {
      // console.log(drawingNo, await this.checkIfCustomerExists(drawingNo));
      if (await this.checkIfItemExists(drawingNo)) {
        await this.db.exec({
          query: 'DELETE FROM item_master WHERE drawing_no=$drawingNo',
          params: {
            $drawingNo: drawingNo,
          },
        });
        await this.windowHandeler.showInfoBox({
          message: `Item ${drawingNo} deleted`,
        });
        return true;
      }
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
              'INSERT INTO item_master(drawing_no, description) VALUES($drgNo, $description)',
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
      // this.windowHandeler.openWindow(windowCodes.HOME);
      this.windowHandeler.changePage(pages.HOME);
    } catch (error) {
      console.error(error);
    }
  }

  async createPo({ poNumber, customerName, itemRows }) {
    try {
      const customer = await this.getCustomerByName(customerName);
      if (customer === null) {
        throw Error(`Customer ${customerName} does not exist`);
      }
      await this.db.exec({
        query:
          'INSERT INTO po_master(po_no, customer_id) VALUES($poNumber, $customerId)',
        params: {
          $poNumber: poNumber,
          $customerId: customer.customer_id,
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

  async getPoFromPoNumber(poNumber) {
    const result = await this.db.exec({
      query: 'SELECT * FROM po_master WHERE po_no=$poNumber',
      params: {
        $poNumber: poNumber,
      },
    });
    if (result.length === 1) {
      return result[0];
    } else {
      throw Error('Did not get single PO');
    }
  }

  async getPoDetails(poNumber) {
    try {
      const poDetails = {
        poId: null,
        poNumber,
        customerName: null,
        poItems: null,
      };
      let result = await this.getPoFromPoNumber(poNumber);
      poDetails.poId = result.po_id;
      result = await this.getCustomerById(result.customer_id);
      poDetails.customerName = result.customer_name;
      result = await this.db.exec({
        query:
          'SELECT * FROM po_items p, item_master i WHERE p.po_id=$poId AND p.item_id=i.item_id',
        params: { $poId: poDetails.poId },
      });
      poDetails.poItems = result;
      return poDetails;
    } catch (error) {
      console.error(error);
    }
  }

  async createCustomer({ customerName, customerAddress, gstNo }) {
    try {
      if ((await this.getCustomerByName(customerName)) !== null) {
        this.windowHandeler.showErrorBox({
          message: `Customer ${customerName} already exists`,
        });
        return false;
      }
      const response = await this.db.exec({
        query:
          'INSERT INTO customer_master(customer_name, customer_address, gst_no) VALUES($customerName, $customerAddress, $gstNo)',
        params: {
          $customerName: customerName,
          $customerAddress: customerAddress,
          $gstNo: gstNo,
        },
      });
      await this.windowHandeler.showInfoBox({ message: 'Customer created' });
      return true;
      // this.windowHandeler.openWindow(windowCodes.HOME);
    } catch (error) {
      console.error(error);
      this.windowHandeler.showErrorBox({
        message: 'Error in creating customer',
      });
    }
  }

  async getCustomers() {
    try {
      return await this.db.exec({
        query: 'SELECT * FROM customer_master;',
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getCustomerById(customerId) {
    try {
      const result = await this.db.exec({
        query: 'SELECT * FROM customer_master WHERE customer_id=$customerId',
        params: {
          $customerId: customerId,
        },
      });
      if (result.length === 1) {
        return result[0];
      } else {
        throw Error('Did not get a single customer in query');
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getCustomerByName(customerName) {
    try {
      const result = await this.db.exec({
        query:
          'SELECT * from customer_master WHERE customer_name=$customerName',
        params: {
          $customerName: customerName,
        },
      });
      if (result.length === 1) {
        return result[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async checkIfCustomerExists(customerName) {
    try {
      const result = await this.db.exec({
        query:
          'SELECT customer_name FROM customer_master WHERE customer_name=$customerName',
        params: {
          $customerName: customerName,
        },
      });
      return result.length === 1;
    } catch (error) {
      console.error(error);
    }
  }

  async getCustomerDetails(customerName) {
    try {
      const result = await this.db.exec({
        query:
          'SELECT * FROM customer_master where customer_name=$customerName',
        params: {
          $customerName: customerName,
        },
      });
      if (result.length !== 1) {
        throw Error('Did not get single customer');
      }
      return result[0];
    } catch (error) {
      console.error(error);
    }
  }

  async importCustomerMaster(options) {
    try {
      const { sheetName, start, end, cols } = options;
      const customerNameCol = this.extractColFromExcel({
        sheetName,
        start,
        end,
        col: cols.customerName,
      });
      const customerAddressCol =
        cols.customerAddress !== ''
          ? this.extractColFromExcel({
              sheetName,
              start,
              end,
              col: cols.customerAddress,
            })
          : Array(customerNameCol.length).fill('');
      const gstNoCol =
        cols.gstNo !== ''
          ? this.extractColFromExcel({ sheetName, start, end, col: cols.gstNo })
          : Array(customerNameCol.length).fill('');
      const alreadyExisting = [];
      for (let i = 0; i < customerNameCol.length; i++) {
        const customerName = customerNameCol[i];
        const customerAddress = customerAddressCol[i];
        const gstNo = gstNoCol[i];
        const exists = await this.checkIfCustomerExists(customerName);
        if (!exists) {
          await this.db.exec({
            query:
              'INSERT INTO customer_master(customer_name, customer_address, gst_no) VALUES($customerName, $customerAddress, $gstNo)',
            params: {
              $customerName: customerName,
              $customerAddress: customerAddress,
              $gstNo: gstNo,
            },
          });
        } else {
          alreadyExisting.push(customerName);
        }
      }
      if (alreadyExisting.length === 0) {
        this.windowHandeler.showInfoBox({
          message: 'Customer Master imported',
        });
      } else {
        this.windowHandeler.showInfoBox({
          message: `${alreadyExisting.length} skipped and imported others`,
        });
      }
      this.windowHandeler.changePage(pages.HOME);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = BusinessLayer;
