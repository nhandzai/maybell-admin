const fs = require('fs').promises;
const path = require('path');
const limit = 6

async function getAccounts(req) {
    const filePath = path.join(__dirname, '../../data/account-list.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const accountsData = JSON.parse(jsonData);

    
    const page = parseInt(req.query.page) || 1;
    const emailFilter = req.query.email || '';
    const fullNameFilter = req.query.fullName || '';

    const filteredAccounts = accountsData.filter(account => {
        const matchesEmail = emailFilter ? account.email.includes(emailFilter) : true;
        const matchesFullName = fullNameFilter ? account.fullName.includes(fullNameFilter) : true;
        return matchesEmail && matchesFullName;
    });

    const offset = (page - 1) * limit;
    const accounts = filteredAccounts.slice(offset, offset + limit);
    const pageNumber = Math.ceil(filteredAccounts.length / limit);

    return {
        accounts: accounts,
        page: page,
        pageNumber: pageNumber,
    };
}

module.exports = { getAccounts };
