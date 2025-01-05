const { fetchProductReport, fetchTopProductReport } = require('./report-model');

const { renderReport } = require('./report-view');



async function getReportPage(req, res, next) {
    try {
        const products = fetchProductReport();
        await renderReport(res, products);
    } catch (error) {
        next(error);
    }
}

async function getSalesReport(req, res, next) {
    try {
        const { date } = req.query;
       

        const products = await fetchProductReport(date);
        res.json(products);
    } catch (error) {
        next(error);
    }
}
async function getTopSalesReport(req, res, next) {
    try {
        const { date } = req.query;
       

        const products = await fetchTopProductReport(date);
        res.json(products);
    } catch (error) {
        next(error);
    }
}




module.exports = {
    getReportPage,
    getSalesReport,
    getTopSalesReport

};
