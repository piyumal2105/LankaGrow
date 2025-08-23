import Invoice from "../models/Invoice.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import Expense from "../models/Expense.js";
import {
  predictSalesForecasting,
  generateBusinessInsights,
} from "../services/aiService.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Revenue this month
    const monthlyRevenue = await Invoice.aggregate([
      {
        $match: {
          userId: userId,
          status: "paid",
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    // Total customers
    const totalCustomers = await Customer.countDocuments({ userId });

    // Low stock products
    const lowStockProducts = await Product.countDocuments({
      userId,
      $expr: { $lte: ["$currentStock", "$minStockLevel"] },
    });

    // Pending invoices
    const pendingInvoices = await Invoice.countDocuments({
      userId,
      status: { $in: ["sent", "draft"] },
    });

    // Top selling products this month
    const topProducts = await Invoice.aggregate([
      { $match: { userId: userId, createdAt: { $gte: thirtyDaysAgo } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productName",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.total" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
    ]);

    // Recent invoices
    const recentInvoices = await Invoice.find({ userId })
      .populate("customer", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        totalCustomers,
        lowStockProducts,
        pendingInvoices,
        topProducts,
        recentInvoices,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfitLossReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Revenue from paid invoices
    const revenue = await Invoice.aggregate([
      {
        $match: {
          userId: userId,
          status: "paid",
          paidDate: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    // Expenses
    const expenses = await Expense.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const totalRevenue = revenue[0]?.total || 0;
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.total, 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin =
      totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalExpenses,
        netProfit,
        profitMargin,
        expenseBreakdown: expenses,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAIInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get recent sales data for forecasting
    const recentSales = await Invoice.find({
      userId,
      status: "paid",
      paidDate: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
    }).sort({ paidDate: 1 });

    // Generate AI insights
    const forecast = await predictSalesForecasting(recentSales);
    const businessInsights = await generateBusinessInsights(userId);

    res.json({
      success: true,
      data: {
        salesForecast: forecast,
        insights: businessInsights,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Total sales
    const totalSales = await Invoice.aggregate([
      {
        $match: {
          userId: userId,
          status: "paid",
          paidDate: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Sales by customer
    const salesByCustomer = await Invoice.aggregate([
      {
        $match: {
          userId: userId,
          status: "paid",
          paidDate: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$customer",
          totalSales: { $sum: "$totalAmount" },
          invoiceCount: { $sum: 1 },
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      { $unwind: "$customerDetails" },
      {
        $project: {
          _id: 0,
          customerId: "$customerDetails._id",
          customerName: "$customerDetails.name",
          totalSales: 1,
          invoiceCount: 1,
        },
      },
    ]);

    // Sales by product
    const salesByProduct = await Invoice.aggregate([
      {
        $match: {
          userId: userId,
          status: "paid",
          paidDate: { $gte: start, $lte: end },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productName",
          totalQuantitySold: { $sum: "$items.quantity" },
          totalSales: { $sum: "$items.total" },
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      data: {
        totalSales: totalSales[0]?.total || 0,
        invoiceCount: totalSales[0]?.count || 0,
        salesByCustomer,
        salesByProduct,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCashFlowReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Cash inflows from paid invoices
    const cashInflows = await Invoice.aggregate([
      {
        $match: {
          userId: userId,
          status: "paid",
          paidDate: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Cash outflows from expenses
    const cashOutflows = await Expense.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const totalInflows = cashInflows[0]?.total || 0;
    const totalOutflows = cashOutflows.reduce((sum, exp) => sum + exp.total, 0);
    const netCashFlow = totalInflows - totalOutflows;

    res.json({
      success: true,
      data: {
        totalInflows,
        totalOutflows,
        netCashFlow,
        outflowBreakdown: cashOutflows,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInventoryReport = async (req, res) => {
  try {
    const userId = req.user.id;

    // Current stock levels
    const products = await Product.find({ userId }).select(
      "name currentStock minStockLevel"
    );

    // Low stock products
    const lowStockProducts = products.filter(
      (prod) => prod.currentStock <= prod.minStockLevel
    );

    // Stock valuation
    const stockValuation = products.reduce(
      (sum, prod) => sum + prod.currentStock * (prod.unitPrice || 0),
      0
    );

    res.json({
      success: true,
      data: {
        totalProducts: products.length,
        lowStockProducts,
        stockValuation,
        products,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
