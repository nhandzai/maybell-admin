const { prisma } = require('../../config/config');

async function fetchProductReport(date = null) {
    const currentDate = date ? new Date(date) : new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    try {
        const todaySales = await prisma.orderProducts.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            where: {
                orders: {
                    createdAt: {
                        gte: new Date(currentYear, currentMonth, currentDay),
                        lt: new Date(currentYear, currentMonth, currentDay + 1),
                    },
                },
            },
        });

        const monthSales = await prisma.orderProducts.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            where: {
                orders: {
                    createdAt: {
                        gte: new Date(currentYear, currentMonth, 1),
                        lt: new Date(currentYear, currentMonth + 1, 1),
                    },
                },
            },
        });

        const yearSales = await prisma.orderProducts.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            where: {
                orders: {
                    createdAt: {
                        gte: new Date(currentYear, 0, 1),
                        lt: new Date(currentYear + 1, 0, 1),
                    },
                },
            },
        });

        const productIdsToday = todaySales.map(sale => sale.productId);
        const productsToday = await prisma.products.findMany({
            where: { id: { in: productIdsToday } },
        });

        const productIdsMonth = monthSales.map(sale => sale.productId);
        const productsMonth = await prisma.products.findMany({
            where: { id: { in: productIdsMonth } },
        });

        const productIdsYear = yearSales.map(sale => sale.productId);
        const productsYear = await prisma.products.findMany({
            where: { id: { in: productIdsYear } },
        });

        const allTodaySales = productsToday.map(product => ({
            name: product.name,
            totalSales: todaySales.find(sale => sale.productId === product.id)?._sum.quantity || 0,
        }));

        const allMonthSales = productsMonth.map(product => ({
            name: product.name,
            totalSales: monthSales.find(sale => sale.productId === product.id)?._sum.quantity || 0,
        }));

        const allYearSales = productsYear.map(product => ({
            name: product.name,
            totalSales: yearSales.find(sale => sale.productId === product.id)?._sum.quantity || 0,
        }));

        return {
            product: {
                today: allTodaySales,
                month: allMonthSales,
                year: allYearSales,
            }
        };
    } catch (error) {
        console.error('Error fetching product report data:', error);
        throw new Error('Unable to fetch product report data. Please try again later.');
    }
}
async function fetchTopProductReport(date = null) {
    try {
        const { product } = await fetchProductReport(date);

        const allTodaySales = product.today;
        const allMonthSales = product.month;
        const allYearSales = product.year;

        const topToday = allTodaySales.sort((a, b) => b.totalSales - a.totalSales).slice(0, 3);
        const topMonth = allMonthSales.sort((a, b) => b.totalSales - a.totalSales).slice(0, 3);
        const topYear = allYearSales.sort((a, b) => b.totalSales - a.totalSales).slice(0, 3);

        return {
            product: {
                topToday,
                topMonth,
                topYear
            }
        };
    } catch (error) {
        console.error('Error fetching top product report:', error);
        throw new Error('Unable to fetch top product report. Please try again later.');
    }
}

module.exports = { fetchProductReport, fetchTopProductReport };
