const { prisma } = require('../../config/config');

async function fetchProductReport(date = null) {
    const inputDate = date ? new Date(date) : new Date();
    const currentYear = inputDate.getFullYear();
    const currentMonth = inputDate.getMonth();
    const currentDay = inputDate.getDate();

    // Tính ngày bắt đầu và kết thúc của tuần chứa inputDate
    const dayOfWeek = inputDate.getDay();
    const weekStart = new Date(currentYear, currentMonth, currentDay - dayOfWeek);
    const weekEnd = new Date(currentYear, currentMonth, currentDay - dayOfWeek + 7);

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

        const weekSales = await prisma.orderProducts.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            where: {
                orders: {
                    createdAt: {
                        gte: weekStart,
                        lt: weekEnd,
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

        const productIdsToday = todaySales.map(sale => sale.productId);
        const productsToday = await prisma.products.findMany({
            where: { id: { in: productIdsToday } },
        });

        const productIdsWeek = weekSales.map(sale => sale.productId);
        const productsWeek = await prisma.products.findMany({
            where: { id: { in: productIdsWeek } },
        });

        const productIdsMonth = monthSales.map(sale => sale.productId);
        const productsMonth = await prisma.products.findMany({
            where: { id: { in: productIdsMonth } },
        });

        const allTodaySales = productsToday.map(product => ({
            name: product.name,
            totalSales: todaySales.find(sale => sale.productId === product.id)?._sum.quantity || 0,
        }));

        const allWeekSales = productsWeek.map(product => ({
            name: product.name,
            totalSales: weekSales.find(sale => sale.productId === product.id)?._sum.quantity || 0,
        }));

        const allMonthSales = productsMonth.map(product => ({
            name: product.name,
            totalSales: monthSales.find(sale => sale.productId === product.id)?._sum.quantity || 0,
        }));

        return {
            product: {
                today: allTodaySales,
                week: allWeekSales,
                month: allMonthSales,
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
        const allWeekSales = product.week;
        const allMonthSales = product.month;

        const topToday = allTodaySales.sort((a, b) => b.totalSales - a.totalSales).slice(0, 3);
        const topWeek = allWeekSales.sort((a, b) => b.totalSales - a.totalSales).slice(0, 3);
        const topMonth = allMonthSales.sort((a, b) => b.totalSales - a.totalSales).slice(0, 3);

        return {
            product: {
                topToday,
                topWeek,
                topMonth
            }
        };
    } catch (error) {
        console.error('Error fetching top product report:', error);
        throw new Error('Unable to fetch top product report. Please try again later.');
    }
}

module.exports = { fetchProductReport, fetchTopProductReport };
