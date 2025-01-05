const fs = require('fs').promises;
const limit = 6;
const { prisma } = require('../../config/config');
const { uploadFile, deleteFile } = require('../cloudinary/cloudinary.js');

async function getProducts(req) {
    try {
        const page = parseInt(req.query.page) || 1;

        const categoryFilter = req.query.category || '';
        const nameFilter = req.query.name || '';
        const brandFilter = req.query.brand || '';
        const sortField = req.query.sortField || 'createdAt';
        const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';

        const whereClause = {
            AND: [
                categoryFilter ? { categories: { category: { contains: categoryFilter} } } : {},
                nameFilter ? { name: { contains: nameFilter } } : {},
                brandFilter ? { brands: { brand: { contains: brandFilter } } } : {},
            ],
        };

        const orderByClause = sortField ? { [sortField]: sortOrder } : undefined;

        // Lấy danh sách sản phẩm
        const products = await prisma.products.findMany({
            where: whereClause,
            include: {
                brands: true,
                categories: true,
            },
            orderBy: orderByClause,
            skip: (page - 1) * limit,
            take: limit,
        });

        // Lấy tổng số sản phẩm
        const totalProducts = await prisma.products.count({ where: whereClause });
        const totalPages = Math.ceil(totalProducts / limit);

        // Lấy dữ liệu về số lượng sản phẩm đã bán
        const salesData = await prisma.orderProducts.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
            },
            where: {
                productId: {
                    in: products.map(product => product.id),
                },
            },
        });

        // Gắn thêm dữ liệu tổng số bán vào mỗi sản phẩm
        const productsWithSales = products.map(product => {
            const sales = salesData.find(data => data.productId === product.id);
            return {
                ...product,
                totalPurchase: sales ? sales._sum.quantity : 0,
            };
        });

        return {
            products: productsWithSales,
            page,
            pageNumber: totalPages,
        };
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Unable to fetch products. Please try again later.');
    }
}





async function getProductDetailById(id) {
    const numericId = parseInt(id, 10);
    try {
        const product = await prisma.products.findUnique({
            where: {
                id: numericId,
            },
            include: {
                brands: true,
                categories: true,
                productSizes: {
                    include: {
                        sizes: true,
                    },
                },
                productImages: {

                },
            },
        });
        if (!product) {
            throw new Error(`Product with ID ${id} not found.`);
        }
        const salesData = await prisma.orderProducts.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
            },
            where: {
                productId: numericId,
            },
        });


        const totalPurchase = salesData.length > 0 ? salesData[0]._sum.quantity : 0;

        return {
            message: `Details of product ${id}`,
            product: {
                ...product,
                totalPurchase: totalPurchase,
            },
        };

    } catch (error) {
        console.error('Error fetching product details:', error);
        throw new Error('Unable to fetch product details. Please try again later.');
    }
}


async function updateProductById(id, data, productImages) {
    try {
        console.log('data', data);

        const product = await prisma.products.findUnique({
            where: {
                id: parseInt(id, 10),
            },
        });

        if (!product) {
            throw new Error(`Product with ID ${id} not found.`);
        }


        if (data.deleteImages && data.deleteImages.length > 0) {
            let deleteImagesArray = [];
            try {

                deleteImagesArray = JSON.parse(data.deleteImages);
            } catch (error) {
                console.error('Invalid JSON format for deleteImages:', error);
                throw new Error('Invalid deleteImages format.');
            }


            if (Array.isArray(deleteImagesArray) && deleteImagesArray.length > 0) {
                await prisma.productImages.deleteMany({
                    where: {
                        id: {
                            in: deleteImagesArray.map((imgId) => parseInt(imgId, 10)),
                        },
                        productId: parseInt(id, 10),
                    },
                });
            }
        }


        const imageUrls = [];
        if (productImages && productImages.length > 0) {
            for (const image of productImages) {
                const result = await uploadFile(image.path, 'products');
                imageUrls.push(result.secure_url);
                await fs.unlink(image.path);
            }


            for (let i = 0; i < imageUrls.length; i++) {
                await prisma.productImages.create({
                    data: {
                        productId: product.id,
                        image: imageUrls[i],
                        isMain: i === 0,
                    },
                });
            }
        }


        const updatedProduct = await prisma.products.update({
            where: {
                id: parseInt(id, 10),
            },
            data: {
                name: data.name,
                categories: {
                    connect: {
                        id: parseInt(data.categoryId, 10)
                    }
                },
                brands: {
                    connect: {
                        id: parseInt(data.brandId, 10)
                    }
                },
                price: parseFloat(data.price),
                realPrice: parseFloat(data.realPrice),
                stockQuantity: parseInt(data.stockQuantity, 10),
                status: data.status,
                shortDescription: data.shortDescription,
                detail: data.detail,
                material: data.material,
                weightKg: parseFloat(data.weightKg),
              
            },
        });

        return {
            message: `Product with ID ${id} updated successfully.`,
            product: updatedProduct,
        };
    } catch (error) {
        console.error('Error updating product:', error);
        throw new Error('Unable to update product. Please try again later.');
    }
}


async function getBrandCategory() {
    try {
        const brands = await prisma.brands.findMany();
        const categories = await prisma.categories.findMany();

        return {
            brandCategory: {
                brands,
                categories,
            },
        };
    } catch (error) {
        console.error('Error fetching brand and category data:', error);
        throw new Error('Unable to fetch brand and category data. Please try again later.');
    }
}



async function addBrand(brand) {
    try {
        const createdBrand = await prisma.brands.create({
            data: {
                brand: brand,
            },
        });

        return {
            message: 'Brand added successfully',
            brand: createdBrand,
        };
    } catch (error) {
        console.error('Error adding brand:', error);
        throw new Error('Unable to add brand. Please try again later.');
    }
}


async function addCategory(category) {
    try {
        const createdCategory = await prisma.categories.create({
            data: {
                category: category,
            },
        });

        return {
            message: 'Category added successfully',
            category: createdCategory,
        };
    } catch (error) {
        console.error('Error adding category:', error);
        throw new Error('Unable to add category. Please try again later.');
    }
}
async function addProduct({ name, price, realPrice, stockQuantity, shortDescription, detail, material, status, weightKg, productImages }) {
    try {

        const imageUrls = [];


        for (const image of productImages) {
            const result = await uploadFile(image.path, 'products');
            imageUrls.push(result.secure_url);
            await fs.unlink(image.path);
        }


        const newProduct = await prisma.products.create({
            data: {
                name,
                price: parseFloat(price),
                realPrice: parseFloat(realPrice),
                stockQuantity: parseInt(stockQuantity, 10),
                shortDescription,
                detail,
                material,
                status,
                weightKg: parseFloat(weightKg),
            },
        });


        for (let i = 0; i < imageUrls.length; i++) {
            await prisma.productImages.create({
                data: {
                    productId: newProduct.id,
                    image: imageUrls[i],
                    isMain: i === 0,
                },
            });
        }

        return newProduct;
    } catch (error) {
        console.error('Error creating product in service:', error);
        throw new Error('An error occurred while adding product.');
    }
}


module.exports = { getProducts, updateProductById, getProductDetailById, getBrandCategory, addBrand, addCategory, addProduct };