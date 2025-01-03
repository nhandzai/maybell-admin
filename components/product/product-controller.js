const { renderProductPage, renderCreateProductPage, renderCreateBrandCategoryPage } = require('./product-view');
const { getProducts, getProductDetailById, getBrandCategory, addBrand, addCategory } = require('./product-model');

async function getProductPage(req, res, next) {
  try {
    const products = await getProducts(req);
    await renderProductPage(res, products);
  } catch (error) {
    next(error);
  }
}

async function getCreateProductPage(req, res, next) {
  try {
    await renderCreateProductPage(res);
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

async function getListBrandCategory(req, res, next) {
  try {
    const data = await getBrandCategory();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
}

async function getCreateBrandCategoryPage(req, res, next) {
  try {
    await renderCreateBrandCategoryPage(res);
  } catch (error) {
    next(error);
  }
}

async function addNewBrand(req, res, next) {
  try {
    const newBrand = req.body;
    if (!newBrand) {
      throw new Error("New Brand is required.");
    }

    data = await addBrand(newBrand);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
}

async function addNewCategory(req, res, next) {
  try {
    const newCategory = req.body;
    if (!newCategory) {
      throw new Error("New Category is required.");
    }

    data = await addCategory(newCategory);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
}

module.exports = { addNewBrand, addNewCategory, getProductPageAPI, getProductPage, getProductDetail, getCreateProductPage, getListBrandCategory, getCreateBrandCategoryPage };