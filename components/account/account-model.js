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

async function banAccountById(id) {
    const filePath = path.join(__dirname, '../../data/account-list.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const accountsData = JSON.parse(jsonData);

    const account = accountsData.find(account => account.id === id);

    if (!account) {
        throw new Error(`Account with ID ${id} not found.`);
    }

    account.isBan = account.isBan === 1 ? 0 : 1;
    await fs.writeFile(filePath, JSON.stringify(accountsData, null, 2), 'utf8');

    return {
        message: `Account ${account.isBan === 1 ? 'banned' : 'unbanned'}`,
        account: account
    };
}

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


module.exports = { getAccounts, banAccountById, getAccountDetailById };
