const fs = require('fs').promises;
const { data } = require('autoprefixer');
const path = require('path');
const limit = 6;

async function getProducts(req) {
    const filePath = path.join(__dirname, '../../data/product-detail.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const productsData = JSON.parse(jsonData);

    const page = parseInt(req.query.page) || 1;
    const categoryFilter = req.query.category || '';
    const nameFilter = req.query.name || '';
    const brandFilter = req.query.brand || '';
    const sortField = req.query.sortField || '';
    const sortOrder = req.query.sortOrder || '';

    const filteredProducts = productsData.filter(product => {
        const matchesBrand = brandFilter ? product.brand.toLowerCase().includes(brandFilter.toLowerCase()) : true;
        const matchesCategory = categoryFilter ? product.category.toLowerCase().includes(categoryFilter.toLowerCase()) : true;
        const matchesName = nameFilter ? product.name.toLowerCase().includes(nameFilter.toLowerCase()) : true;
        return matchesCategory && matchesName && matchesBrand;
    });

    if (sortField) {
        filteredProducts.sort((a, b) => {
            const fieldA = a[sortField];
            const fieldB = b[sortField];

            if (sortOrder === 'asc') {
                return fieldA > fieldB ? 1 : fieldA < fieldB ? -1 : 0;
            } else if (sortOrder === 'desc') {
                return fieldA < fieldB ? 1 : fieldA > fieldB ? -1 : 0;
            }
            return 0;
        });
    }

    const offset = (page - 1) * limit;
    const products = filteredProducts.slice(offset, offset + limit);
    const pageNumber = Math.ceil(filteredProducts.length / limit);

    return {
        products: products,
        page: page,
        pageNumber: pageNumber,
    };
}

async function getProductDetailById(id) {
    const filePath = path.join(__dirname, '../../data/product-detail.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const productsData = JSON.parse(jsonData);

    const product = productsData.find(product => product.id === id);

    if (!product) {
        throw new Error(`product with ID ${id} not found.`);
    }
    return {
        message: `Details of product ${id}`,
        product: product
    }
}

async function updateProductById(id, data) {
    const filePath = path.join(__dirname, '../../data/product-detail.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const productsData = JSON.parse(jsonData);
  
    const productIndex = productsData.findIndex(product => product.id === id);
  
    if (productIndex === -1) {
      throw new Error(`Product with ID ${id} not found.`);
    }
    const product = productsData[productIndex];
    for (const key in data) {
      if (product.hasOwnProperty(key)) {
        product[key] = data[key];
      }
    }
    await fs.writeFile(filePath, JSON.stringify(productsData, null, 2), 'utf8');

    return {
      message: `Product with ID ${id} updated successfully.`,
      product: product
    };
  }

async function getBrandCategory() {
    const filePath = path.join(__dirname, '../../data/brand-category.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const brandCategoryData = JSON.parse(jsonData);

    return {
        brandCategory: brandCategoryData
    }
}

async function addBrand(newBrand) {
    const filePath = path.join(__dirname, '../../data/brand-category.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const brandCategoryData = JSON.parse(jsonData);

    const newId = (parseInt(brandCategoryData.brands[brandCategoryData.brands.length - 1]?.id) || 0) + 1;
    newBrand.id = newId.toString();
    brandCategoryData.brands.push(newBrand);
    await fs.writeFile(filePath, JSON.stringify(brandCategoryData, null, 2));

    return {
        message: 'Brand added successfully',
        brand: newBrand
    };
}

async function addCategory(newCategory) {
    const filePath = path.join(__dirname, '../../data/brand-category.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const brandCategoryData = JSON.parse(jsonData);

    const newId = (parseInt(brandCategoryData.categories[brandCategoryData.categories.length - 1]?.id) || 0) + 1;
    newCategory.id = newId.toString();

    brandCategoryData.categories.push(newCategory);
    await fs.writeFile(filePath, JSON.stringify(brandCategoryData, null, 2));
    return {
        message: 'Category added successfully',
        category: newCategory
    };
}

module.exports = { getProducts, updateProductById ,getProductDetailById, getBrandCategory, addBrand, addCategory };