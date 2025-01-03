async function renderOrderPage(res, orders) {
    res.render('order-list.ejs', {
        orders: orders.orders,
        page: orders.page,
        pageNumber: orders.pageNumber
    });
}

module.exports = { renderOrderPage };
