const { renderOrderPage } = require('./order-view');
const { getOrders, getOrderDetailById, changeOrderStatusById } = require('./order-model')

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

async function getOrderDetail(req, res, next) {
    try {
        const orderId = req.query.id;
        if (!orderId) {
            throw new Error("order ID is required.");
        }

        const data = await getOrderDetailById(orderId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}

async function changeOrderStatus(req, res, next) {
    try {
        const orderId = req.body.id;
        const status = req.body.status;
        
        if (!orderId) {
            throw new Error("Order ID is required.");
        }

        if (!status) {
            throw new Error("Status is required.");
        }

        const data = await changeOrderStatusById(orderId, status);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}

module.exports = { getOrderPage, getOrderPageAPI, getOrderDetail, changeOrderStatus };