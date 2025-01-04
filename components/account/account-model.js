
const limit = 6;
const { prisma } = require('../../config/config');

async function getAccounts(req) {
    try {

        const page = parseInt(req.query.page) || 1;
       
        const emailFilter = req.query.email || '';
        const fullNameFilter = req.query.fullName || '';
        const sortField = req.query.sortField || 'createdAt';
        const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';


        const whereClause = {
            AND: [
                emailFilter ? { email: { contains: emailFilter, mode: 'insensitive' } } : {},
                fullNameFilter ? { fullName: { contains: fullNameFilter, mode: 'insensitive' } } : {},
            ],
        };


        const orderByClause = sortField ? { [sortField]: sortOrder } : undefined;

        const users = await prisma.users.findMany({
            where: whereClause,
            orderBy: orderByClause,
            skip: (page - 1) * limit,
            take: limit,
        });


        const totalUsers = await prisma.users.count({ where: whereClause });
        const totalPages = Math.ceil(totalUsers / limit);

        return {
            accounts: users,
            page,
            pageNumber: totalPages,

        };

    } catch (error) {
        console.error('Error fetching accounts:', error);
        throw new Error('Unable to fetch accounts. Please try again later.');
    }
}


async function banAccountById(id) {
    const numericId = parseInt(id, 10);
    try {
        const account = await prisma.users.findUnique({
            where: { id : numericId }
        });

        if (!account) {
            throw new Error(`Account with ID ${id} not found.`);
        }
       
        const updatedAccount = await prisma.users.update({
            where: { id: numericId },
            data: { isBan: account.isBan === 1 ? 0 : 1 }
        });

        return {
            message: `Account ${updatedAccount.isBan === 1 ? 'banned' : 'unbanned'}`,
            account: updatedAccount
        };
    } catch (error) {
        console.error('Error banning/unbanning account:', error);
        throw new Error('Unable to update account ban status. Please try again later.');
    }
}

async function getAccountDetailById(id) {
    const numericId = parseInt(id, 10);
    try {
        const account = await prisma.users.findUnique({
            where: { id: numericId }
        });

        if (!account) {
            throw new Error(`Account with ID ${id} not found.`);
        }

        return {
            message: `Details of Account ${id}`,
            account
        };
    } catch (error) {
        console.error('Error fetching account details:', error);
        throw new Error('Unable to fetch account details. Please try again later.');
    }
}


module.exports = { getAccounts, banAccountById, getAccountDetailById };
