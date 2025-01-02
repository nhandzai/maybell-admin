const { renderProductPage } = require('./product-view');
const { getProducts, getProductDetailById } = require('./product-model');

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

async function getProductDetail(req, res, next) {
  try {
    const productId = req.query.id;
    if (!productId) {
      throw new Error("product ID is required.");
    }

    const data = await getProductDetailById(productId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
}

module.exports = { getProductPageAPI, getProductPage, getProductDetail};