const { renderProductPage, renderCreateProductPage, renderCreateBrandCategoryPage } = require('./product-view');
const { getProducts, updateProductById, getProductDetailById, getBrandCategory, addBrand, addCategory,addProduct } = require('./product-model');
const { data } = require('autoprefixer');

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

async function updateProduct(req, res, next) {
  console.log("1",req.body)
  try {
    const productId = req.body.id;
    const inputData = req.body;
    const productImages = req.files || [];
    console.log(req.body)
    if (!productId) {
      throw new Error("product ID is required.");
    }
    if (!inputData) {
      throw new Error("Input data is required.");
    }

    const data = await updateProductById(productId,inputData,productImages);
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
    const brand = req.body;
    if (!brand || !brand.brand) { 
      throw new Error("New Brand is required.");
    }

   
    const data = await addBrand(brand.brand);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
}

async function addNewCategory(req, res, next) {
  try {
    const category = req.body;
    if (!category || !category.category) {
      throw new Error("New Category is required.");
    }

    data = await addCategory(category.category);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
}
async function addNewProduct(req, res) {
  const {
    name,
    price,
    realPrice,
    stockQuantity,
    shortDescription,
    detail,
    material,
    status,
    weightKg
  } = req.body;
  console.log(req.body)
  const productImages = req.files || [];

  try {
   
    const newProduct = await addProduct({
      name,
      price,
      realPrice,
      stockQuantity,
      shortDescription,
      detail,
      material,
      status,
      weightKg,
      productImages
    });

  
    return res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error in controller:', error);
    return res.status(500).json({ message: 'An error occurred while adding product.' });
  }
}


module.exports = { updateProduct, addNewBrand, addNewCategory, getProductPageAPI, getProductPage, getProductDetail, getCreateProductPage, getListBrandCategory, getCreateBrandCategoryPage, addNewProduct };