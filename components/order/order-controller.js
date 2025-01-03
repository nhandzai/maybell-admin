const { renderOrderPage } = require('./order-view');
const { getOrders } = require('./order-model')

async function getOrderPage(req, res, next) {
    try {
        const orders = await getOrders(req);
        await renderOrderPage(res, orders);
    } catch (error) {
        next(error);
    }
}

async function getOrderPageAPI(req, res, next) {
    try {
        const orders = await getOrders(req);
        res.json(orders)
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}

module.exports = { getOrderPage, getOrderPageAPI };