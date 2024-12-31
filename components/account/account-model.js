const fs = require('fs').promises;
const path = require('path');
const limit = 6

async function getAccounts(req) {
    const filePath = path.join(__dirname, '../../data/account-list.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const accountsData = JSON.parse(jsonData);

    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const accounts = accountsData.slice(offset, offset + limit);
    const pageNumber = Math.ceil(accountsData.length / limit);

    return {
        accounts: accounts,
        page: page,
        pageNumber: pageNumber,
    };
}

module.exports = { getAccounts };
