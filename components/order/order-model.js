const fs = require('fs').promises;
const path = require('path');
const limit = 3;
const { prisma } = require('../../config/config');

async function getOrders(req) {
    try {
        const page = parseInt(req.query.page) || 1;

        const statusFilter = req.query.status || '';
        const userIdFilter = req.query.userId || '';
        const sortField = req.query.sortField || 'createdAt';
        const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';


        const whereClause = {
            AND: [
                statusFilter ? { status: { contains: statusFilter, mode: 'insensitive' } } : {},
                userIdFilter ? { userId: { contains: userIdFilter, mode: 'insensitive' } } : {},
            ],
        };


        const orderByClause = sortField ? { [sortField]: sortOrder } : undefined;


        const orders = await prisma.orders.findMany({
            where: whereClause,
            include: {
                users: {
                    select: { fullName: true },
                },
                paymentMethods: true,
            },
            orderBy: orderByClause,
            skip: (page - 1) * limit,
            take: limit,
        });


        const totalOrders = await prisma.orders.count({ where: whereClause });
        const totalPages = Math.ceil(totalOrders / limit);

        return {
            orders: orders.map(order => ({
                ...order,
                userFullName: order.users.fullName,
            })),
            page,
            pageNumber: totalPages,
        };

    } catch (error) {
        console.error('Error fetching orders:', error);
        throw new Error('Unable to fetch orders. Please try again later.');
    }
}



async function getOrderDetailById(id) {
    const numericId = parseInt(id, 10);
    try {
        const order = await prisma.orders.findUnique({
            where: { id: numericId },
            include: {
                users: {
                    select: { fullName: true },
                },
                paymentMethods: true,
                orderProducts: {
                    include: {
                        products: true,
                    }
                }
            },
        });

        if (!order) {
            throw new Error(`Order with ID ${id} not found.`);
        }

        return {
            message: `Details of order ${id}`,
            order: {
                ...order,
                userFullName: order.users.fullName,
            },
        };
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw new Error('Failed to fetch order details.');
    }
}

async function changeOrderStatusById(id, newStatus) {
    const numericId = parseInt(id, 10);
    try {
        const order = await prisma.orders.findUnique({
            where: { id:numericId },
        });

        if (!order) {
            throw new Error(`Order with ID ${id} not found.`);
        }

        const updatedOrder = await prisma.orders.update({
            where: { id:numericId },
            data: { status: newStatus, updatedAt: new Date() },
        });

        return {
            message: 'Order status updated successfully.',
            order: updatedOrder,
        };
    } catch (error) {
        console.error('Error updating order status:', error);
        throw new Error('Failed to update order status.');
    }
}

module.exports = { getOrders, getOrderDetailById, changeOrderStatusById };