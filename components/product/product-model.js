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
                categoryFilter ? { category: { contains: categoryFilter, mode: 'insensitive' } } : {},
                nameFilter ? { name: { contains: nameFilter, mode: 'insensitive' } } : {},
                brandFilter ? { brand: { contains: brandFilter, mode: 'insensitive' } } : {},
            ],
        };

        const orderByClause = sortField ? { [sortField]: sortOrder } : undefined;


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


        const totalProducts = await prisma.products.count({ where: whereClause });
        const totalPages = Math.ceil(totalProducts / limit);


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
                    where: {
                        isMain: true,
                    },
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


async function updateProductById(id, data) {
    try {
        const product = await prisma.products.findUnique({
            where: {
                id: parseInt(id, 10),
            },
        });

        if (!product) {
            throw new Error(`Product with ID ${id} not found.`);
        }


        const updatedProduct = await prisma.products.update({
            where: {
                id: parseInt(id, 10),
            },
            data : {
                ...data,
                categoryId: parseInt(data.categoryId, 10), 
                brandId: parseInt(data.brandId, 10), 
                price: parseFloat(data.price), 
                realPrice: parseFloat(data.realPrice), 
                weightKg: parseFloat(data.weightKg), 
                stockQuantity: parseInt(data.stockQuantity, 10), 
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