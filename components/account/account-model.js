const fs = require('fs').promises; 
const path = require('path');

async function getAccounts() {
  const filePath = path.join(__dirname, '../../data/account-list.json');
  const jsonData = await fs.readFile(filePath, 'utf8'); 
  return JSON.parse(jsonData); 
}

module.exports = { getAccounts };
