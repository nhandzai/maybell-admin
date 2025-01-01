const fs = require('fs').promises;
const path = require('path');
const limit = 6;

async function getProducts(req) {
    const filePath = path.join(__dirname, '../../data/product-list.json');
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

module.exports = { getProducts };