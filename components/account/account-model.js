const fs = require('fs').promises;
const path = require('path');
const limit = 6;

async function getAccounts(req) {
    const filePath = path.join(__dirname, '../../data/account-list.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const accountsData = JSON.parse(jsonData);

    const page = parseInt(req.query.page) || 1;
    const emailFilter = req.query.email || '';
    const fullNameFilter = req.query.fullName || '';
    const sortField = req.query.sortField || ''; 
    const sortOrder = req.query.sortOrder || '';

    const filteredAccounts = accountsData.filter(account => {
        const matchesEmail = emailFilter ? account.email.toLowerCase().includes(emailFilter.toLowerCase()) : true;
        const matchesFullName = fullNameFilter ? account.fullName.toLowerCase().includes(fullNameFilter.toLowerCase()) : true;
        return matchesEmail && matchesFullName;
    });

    if (sortField) {
        filteredAccounts.sort((a, b) => {
            const fieldA = a[sortField];
            const fieldB = b[sortField];

            if (sortOrder === 'asc') {
                return fieldA > fieldB ? 1 : fieldA < fieldB ? -1 : 0;
            } else if (sortOrder === 'desc') {
                return fieldA < fieldB ? 1 : fieldA > fieldB ? -1 : 0;
            }
            return 0;
        });
    }

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
