import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage, getInventories } from "../utils/features.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats = {};

  if (myCache.has("admin-stats"))
    stats = JSON.parse(myCache.get("admin-stats") as string);
  else {
    const today = new Date();
    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

    const curMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };

    const prevMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    };

    const curMonthProductsPromise = Product.find({
      createdAt: {
        $gte: curMonth.start,
        $lte: curMonth.end,
      },
    });

    const prevMonthProductsPromise = Product.find({
      createdAt: {
        $gte: prevMonth.start,
        $lte: prevMonth.end,
      },
    });

    const curMonthUsersPromise = User.find({
      createdAt: {
        $gte: curMonth.start,
        $lte: curMonth.end,
      },
    });

    const prevMonthUsersPromise = User.find({
      createdAt: {
        $gte: prevMonth.start,
        $lte: prevMonth.end,
      },
    });

    const curMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: curMonth.start,
        $lte: curMonth.end,
      },
    });

    const prevMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: prevMonth.start,
        $lte: prevMonth.end,
      },
    });

    const lastSixMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    });

    const latestTransactionsPromise = Order.find({})
      .select(["orderItems", "discount", "total", "status"])
      .limit(4);

    const [
      curMonthProducts,
      curMonthUsers,
      curMonthOrders,
      prevMonthProducts,
      prevMonthUsers,
      prevMonthOrders,
      productsCount,
      usersCount,
      allOrders,
      lastSixMonthOrders,
      categories,
      femaleUserCount,
      latestTransactions,
    ] = await Promise.all([
      curMonthProductsPromise,
      curMonthUsersPromise,
      curMonthOrdersPromise,
      prevMonthProductsPromise,
      prevMonthUsersPromise,
      prevMonthOrdersPromise,
      Product.countDocuments(),
      User.countDocuments(),
      Order.find({}).select("total"),
      lastSixMonthOrdersPromise,
      Product.distinct("category"),
      User.countDocuments({ gender: "female" }),
      latestTransactionsPromise,
    ]);

    const curMonthRevenue = curMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );
    const prevMonthRevenue = prevMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const changePercent = {
      revenue: calculatePercentage(curMonthRevenue, prevMonthRevenue),
      product: calculatePercentage(
        curMonthProducts.length,
        prevMonthProducts.length
      ),
      user: calculatePercentage(curMonthUsers.length, prevMonthUsers.length),
      order: calculatePercentage(curMonthOrders.length, prevMonthOrders.length),
    };

    const revenue = allOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const count = {
      revenue,
      products: productsCount,
      orders: allOrders.length,
      users: usersCount,
    };

    const orderMonthCount = new Array(6).fill(0);
    const orderMonthlyRevenue = new Array(6).fill(0);
    lastSixMonthOrders.forEach((order) => {
      const creationDate = order.createdAt;
      const monthDiff = today.getMonth() - creationDate.getMonth();

      if (monthDiff < 6) {
        orderMonthCount[6 - monthDiff - 1] += 1;
        orderMonthlyRevenue[6 - monthDiff - 1] += order.total;
      }
    });

    const categoryCount = await getInventories({
      categories,
      productsCount,
    });

    const userRatio = {
      male: usersCount - femaleUserCount,
      female: femaleUserCount,
    };

    const modifiedTransaction = latestTransactions.map((i) => ({
      _id: i._id,
      discount: i.discount,
      amount: i.total,
      quantity: i.orderItems.length,
      status: i.status,
    }));

    stats = {
      categoryCount,
      changePercent,
      count,
      chart: {
        order: orderMonthCount,
        revenue: orderMonthlyRevenue,
      },
      userRatio,
      latestTransactions: modifiedTransaction,
    };

    myCache.set("admin-stats", JSON.stringify(stats));
  }

  return res.status(200).json({
    success: true,
    stats,
  });
});

export const getPieChart = TryCatch(async (req, res, next) => {
  console.log("h")
});

export const getBarChart = TryCatch(async (req, res, next) => {});

export const getLineChart = TryCatch(async (req, res, next) => {});
