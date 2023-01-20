const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
// const log = require('electron-log');

class Database {
  constructor(userDataPath) {
    this.userDataPath = userDataPath;
  }

  connect(databasePath) {
    this.db = new sqlite3.Database(databasePath);
  }

  execPromise(query, params) {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }

  async exec({ query, params }) {
    // log.info(query);
    // log.info(JSON.stringify(params));
    try {
      if (!params) {
        params = {};
      }
      const result = await this.execPromise(query, params);
      return result;
    } catch (error) {
      console.error(error);
      //   log.error(query);
      //   log.error(JSON.stringify(params));
    }
  }

  static exists(databasePath) {
    // console.log({ databasePath });

    const exists = fs.existsSync(databasePath);
    // console.log(`${databasePath} exists: ${exists}`);
    return exists;
  }
}

module.exports = Database;
