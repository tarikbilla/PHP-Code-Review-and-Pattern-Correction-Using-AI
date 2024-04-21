require('dotenv').config();

class GlobalData {
    constructor() {
      this.apiUrl = 'http://localhost:3001';
    }
  
    getApiUrl() {
      return this.apiUrl;
    }
  }
  
  module.exports = new GlobalData();