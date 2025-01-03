const fs = require('fs').promises;
const path = require('path');
const limit = 3;

async function getOrders(req) {
    const filePath = path.join(__dirname, '../../data/order-list.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const ordersData = JSON.parse(jsonData);

    const page = parseInt(req.query.page) || 1;
    const statusFilter = req.query.status || '';
    const userIdFilter = req.query.userId || '';
    const sortField = req.query.sortField || '';
    const sortOrder = req.query.sortOrder || '';

    const filteredOrders = ordersData.filter(order => {
        const matchesStatus = statusFilter ? order.status.toLowerCase().includes(statusFilter.toLowerCase()) : true;
        const matchesUserId = userIdFilter ? order.userId.toLowerCase().includes(userIdFilter.toLowerCase()) : true;
        return matchesStatus && matchesUserId;
    });

    if (sortField) {
        filteredOrders.sort((a, b) => {
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
    const orders = filteredOrders.slice(offset, offset + limit);
    const pageNumber = Math.ceil(filteredOrders.length / limit);

    return {
        orders: orders,
        page: page,
        pageNumber: pageNumber,
    };
}

async function getOrderDetailById(id) {
    const filePath = path.join(__dirname, '../../data/order-list.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const ordersData = JSON.parse(jsonData);

    const order = ordersData.find(order => order.id === id);

    if (!order) {
        throw new Error(`order with ID ${id} not found.`);
    }
    return {
        message: `Details of order ${id}`,
        order: order
    }
}

module.exports = { getOrders, getOrderDetailById };