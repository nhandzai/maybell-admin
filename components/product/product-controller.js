const { renderProductPage } = require('./product-view');
const { getProducts } = require('./product-model');

async function getProductPage(req, res, next) {
  try {
    const products = await getProducts(req);
    await renderProductPage(res, products);
  } catch (error) {
    next(error);
  }
}

async function getProductPageAPI(req, res, next) {
  try {
    const products = await getProducts(req);
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
}

module.exports = { getProductPageAPI, getProductPage};