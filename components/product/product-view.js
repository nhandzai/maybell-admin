async function renderProductPage(res, products) {
    res.render('product-list.ejs', {
        products: products.products,
        page: products.page,
        pageNumber: products.pageNumber
    });
}

module.exports = { renderProductPage };
