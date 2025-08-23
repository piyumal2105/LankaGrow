import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateAITags = async (name, description, category) => {
  try {
    const prompt = `Generate relevant tags for this product:
    Name: ${name}
    Description: ${description}
    Category: ${category}
    
    Return only a comma-separated list of 5-8 relevant tags.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
    });

    return response.choices[0].message.content
      .split(",")
      .map((tag) => tag.trim());
  } catch (error) {
    console.error("AI Tag Generation Error:", error);
    return [];
  }
};

export const categorizeExpense = async (description, amount) => {
  try {
    const prompt = `Categorize this business expense:
    Description: ${description}
    Amount: LKR ${amount}
    
    Return JSON with: {"category": "category_name", "confidence": 0.95, "subcategory": "subcategory_name"}
    
    Common categories: Office Supplies, Travel, Marketing, Utilities, Equipment, Professional Services, Inventory, Maintenance`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("AI Expense Categorization Error:", error);
    return { category: "Uncategorized", confidence: 0, subcategory: "" };
  }
};

export const generateInvoiceFollowUp = async (
  customerName,
  invoiceAmount,
  daysPastDue
) => {
  try {
    const tone =
      daysPastDue <= 7
        ? "friendly"
        : daysPastDue <= 30
        ? "professional"
        : "firm";

    const prompt = `Generate a ${tone} payment reminder message for:
    Customer: ${customerName}
    Amount: LKR ${invoiceAmount}
    Days overdue: ${daysPastDue}
    
    Keep it professional and appropriate for Sri Lankan business context.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("AI Follow-up Generation Error:", error);
    return `Dear ${customerName}, this is a friendly reminder about your outstanding invoice of LKR ${invoiceAmount}. Please contact us to arrange payment.`;
  }
};

export const suggestReorderLevel = async (product) => {
  try {
    const prompt = `Suggest optimal reorder quantity for:
    Product: ${product.name}
    Current Stock: ${product.currentStock}
    Min Level: ${product.minStockLevel}
    Purchase Price: LKR ${product.purchasePrice}
    
    Consider Sri Lankan business context and return JSON: {"suggested_quantity": 50, "reason": "explanation"}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("AI Reorder Suggestion Error:", error);
    return {
      suggested_quantity: product.minStockLevel * 2,
      reason: "Standard reorder calculation",
    };
  }
};

export const generateBusinessInsights = async (userId) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Monthly revenue
    const monthlyRevenue = await Invoice.aggregate([
      { $match: { userId, createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, totalAmount: { $sum: "$total" } } },
      { $project: { total: "$totalAmount" } },
    ]);

    // Total revenue
    const totalRevenue = await Invoice.aggregate([
      { $match: { userId } },
      { $group: { _id: null, totalAmount: { $sum: "$total" } } },
      { $project: { total: "$totalAmount" } },
    ]);
    if (!totalRevenue || totalRevenue.length === 0) {
      throw new Error("No revenue data found for the user.");
    }
    const totalRevenueAmount = totalRevenue[0].total;
    if (isNaN(totalRevenueAmount)) {
      throw new Error("Total revenue amount is not a valid number.");
    }
    if (totalRevenueAmount < 0) {
      throw new Error("Total revenue amount cannot be negative.");
    }
    if (monthlyRevenue.length === 0) {
      monthlyRevenue.push({ total: 0 });
    } else if (isNaN(monthlyRevenue[0].total)) {
      throw new Error("Monthly revenue total is not a valid number.");
    }
    if (monthlyRevenue[0].total < 0) {
      throw new Error("Monthly revenue total cannot be negative.");
    }
    monthlyRevenue[0].total = totalRevenueAmount;
    // Total customers
    const totalCustomers = await Customer.countDocuments({ userId });
    if (totalCustomers < 0) {
      throw new Error("Total customers cannot be negative.");
    }
    // Low stock products
    const lowStockProducts = await Product.countDocuments({
      userId,
      $expr: { $lte: ["$currentStock", "$minStockLevel"] },
    });
    if (lowStockProducts < 0) {
      throw new Error("Low stock products count cannot be negative.");
    }
    // Pending invoices
    const pendingInvoices = await Invoice.countDocuments({
      userId,
      status: { $in: ["sent", "draft"] },
    });
    if (pendingInvoices < 0) {
      throw new Error("Pending invoices count cannot be negative.");
    }
    // Top selling products
    const topProducts = await Invoice.aggregate([
      { $match: { userId, createdAt: { $gte: thirtyDaysAgo } } },
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
    if (!topProducts || topProducts.length === 0) {
      throw new Error("No top selling products found.");
    }
    // Recent invoices
    const recentInvoices = await Invoice.find({ userId })
      .populate("customer", "name")
      .sort({ createdAt: -1 })
      .limit(5);
    if (!recentInvoices || recentInvoices.length === 0) {
      throw new Error("No recent invoices found for the user.");
    }
    return {
      success: true,
      data: {
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        totalCustomers,
        lowStockProducts,
        pendingInvoices,
        topProducts,
        recentInvoices,
      },
    };
  } catch (error) {
    console.error("Error generating business insights:", error);
    return {
      success: false,
      message: error.message || "An error occurred while generating insights.",
    };
  }
};

export const predictSalesForecasting = async (userId, monthsAhead = 3) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setMonth(thirtyDaysAgo.getMonth() - monthsAhead);

    // Monthly revenue for the last 'monthsAhead' months
    const monthlyRevenue = await Invoice.aggregate([
      { $match: { userId, createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalAmount: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    if (!monthlyRevenue || monthlyRevenue.length === 0) {
      throw new Error("No revenue data found for the specified period.");
    }

    return {
      success: true,
      data: monthlyRevenue,
    };
  } catch (error) {
    console.error("Error predicting sales forecasting:", error);
    return {
      success: false,
      message: error.message || "An error occurred while predicting sales.",
    };
  }
};
