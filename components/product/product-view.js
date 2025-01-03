async function renderProductPage(res, products) {
    res.render('product-list.ejs', {
        products: products.products,
        page: products.page,
        pageNumber: products.pageNumber
    });
}

async function renderCreateProductPage(res) {
    res.render('create-product.ejs', {

    });
}

async function renderCreateBrandCategoryPage(res) {
    res.render('create-brand-category.ejs', {

    });
}

module.exports = { renderProductPage, renderCreateProductPage, renderCreateBrandCategoryPage };
