const fs = require('fs').promises;
const path = require('path');
const limit = 6;

async function getProducts(req) {
    const filePath = path.join(__dirname, '../../data/product-list.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const productsData = JSON.parse(jsonData);

    const page = parseInt(req.query.page) || 1;
    const emailFilter = req.query.email || '';
    const fullNameFilter = req.query.fullName || '';
    const sortField = req.query.sortField || '';
    const sortOrder = req.query.sortOrder || '';

    const filteredProducts = productsData.filter(product => {
        const matchesEmail = emailFilter ? product.email.toLowerCase().includes(emailFilter.toLowerCase()) : true;
        const matchesFullName = fullNameFilter ? product.fullName.toLowerCase().includes(fullNameFilter.toLowerCase()) : true;
        return matchesEmail && matchesFullName;
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