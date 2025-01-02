const fs = require('fs').promises;
const path = require('path');

async function getAccountDetailById(id) {
    const filePath = path.join(__dirname, '../../data/account-list-detail.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const accountsData = JSON.parse(jsonData);

    const account = accountsData.find(account => account.id === id);

    if (!account) {
        throw new Error(`Account with ID ${id} not found.`);
    }
    return {
        message: `Details of Account ${id}`,
        account: account
    }
}

async function changeProfileById(req, accountId) {
    const filePath = path.join(__dirname, '../../data/account-list-detail.json');
  
    const jsonData = await fs.readFile(filePath, 'utf8');
    const accountsData = JSON.parse(jsonData);
  
    const account = accountsData.find(account => account.id === accountId);
  
    if (!account) {
      throw new Error(`Account with ID ${accountId} not found.`);
    }
  
    account.fullName = req.body.fullName || account.fullName;
    account.country = req.body.country || account.country;
    account.city = req.body.city || account.city;
    account.phone = req.body.phone || account.phone;
    account.sex = req.body.sex || account.sex;
    account.bio = req.body.bio || account.bio;
  
    await fs.writeFile(filePath, JSON.stringify(accountsData, null, 2));
  
    return {
      message: "Account profile updated successfully",
      account: account
    };
  }

module.exports = { getAccountDetailById, changeProfileById };