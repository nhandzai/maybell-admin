async function renderReport(res, products) {
    res.render('report.ejs', {
        products: products,

    });
}
module.exports = { renderReport };