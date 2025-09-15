import OpenAI from "openai";
import Invoice from "../models/Invoice.js";
import Customer from "../models/Customer.js";
import Product from "../models/Product.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to check if OpenAI is available
const isOpenAIAvailable = () => {
  return process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "";
};

// Helper function to make OpenAI calls with fallback
const makeOpenAICall = async (
  messages,
  maxTokens = 150,
  fallbackResponse = null
) => {
  if (!isOpenAIAvailable()) {
    console.log("OpenAI API not available, using fallback response");
    return { choices: [{ message: { content: fallbackResponse } }] };
  }

  try {
    return await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: maxTokens,
    });
  } catch (error) {
    console.error("OpenAI API Error:", error.message);
    console.log("Using fallback response");
    return { choices: [{ message: { content: fallbackResponse } }] };
  }
};

export const generateAITags = async (name, description, category) => {
  try {
    const prompt = `Generate relevant tags for this product:
    Name: ${name}
    Description: ${description}
    Category: ${category}
    
    Return only a comma-separated list of 5-8 relevant tags.`;

    const fallbackTags = [
      category,
      name.split(" ")[0],
      "sri-lanka",
      "business",
      "product",
    ].join(", ");

    const response = await makeOpenAICall(
      [{ role: "user", content: prompt }],
      100,
      fallbackTags
    );

    return response.choices[0].message.content
      .split(",")
      .map((tag) => tag.trim());
  } catch (error) {
    console.error("AI Tag Generation Error:", error);
    // Return basic fallback tags
    return [category, name.split(" ")[0], "sri-lanka", "business", "product"];
  }
};

export const categorizeExpense = async (description, amount) => {
  try {
    const prompt = `Categorize this business expense:
    Description: ${description}
    Amount: LKR ${amount}
    
    Return JSON with: {"category": "category_name", "confidence": 0.95, "subcategory": "subcategory_name"}
    
    Common categories: Office Supplies, Travel, Marketing, Utilities, Equipment, Professional Services, Inventory, Maintenance`;

    // Fallback categorization logic
    const fallbackCategory = (() => {
      const desc = description.toLowerCase();
      if (
        desc.includes("fuel") ||
        desc.includes("petrol") ||
        desc.includes("diesel")
      )
        return "Travel";
      if (
        desc.includes("electricity") ||
        desc.includes("water") ||
        desc.includes("internet")
      )
        return "Utilities";
      if (
        desc.includes("paper") ||
        desc.includes("pen") ||
        desc.includes("office")
      )
        return "Office Supplies";
      if (
        desc.includes("computer") ||
        desc.includes("laptop") ||
        desc.includes("phone")
      )
        return "Equipment";
      if (desc.includes("advertising") || desc.includes("marketing"))
        return "Marketing";
      if (desc.includes("repair") || desc.includes("maintenance"))
        return "Maintenance";
      return "Office Supplies";
    })();

    const fallbackResponse = JSON.stringify({
      category: fallbackCategory,
      confidence: 0.75,
      subcategory: fallbackCategory,
    });

    const response = await makeOpenAICall(
      [{ role: "user", content: prompt }],
      150,
      fallbackResponse
    );

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("AI Expense Categorization Error:", error);
    return {
      category: "Office Supplies",
      confidence: 0.5,
      subcategory: "General",
    };
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

    // Fallback messages based on days overdue
    const fallbackMessage = (() => {
      if (daysPastDue <= 7) {
        return `Dear ${customerName}, this is a friendly reminder that your invoice of LKR ${invoiceAmount} is now ${daysPastDue} days overdue. We would appreciate your prompt payment. Thank you for your business.`;
      } else if (daysPastDue <= 30) {
        return `Dear ${customerName}, we notice that your invoice of LKR ${invoiceAmount} is ${daysPastDue} days overdue. Please arrange payment at your earliest convenience. If you have any questions, please contact us immediately.`;
      } else {
        return `Dear ${customerName}, your invoice of LKR ${invoiceAmount} is now ${daysPastDue} days overdue. Immediate payment is required to avoid further action. Please contact us to resolve this matter urgently.`;
      }
    })();

    const response = await makeOpenAICall(
      [{ role: "user", content: prompt }],
      200,
      fallbackMessage
    );

    return response.choices[0].message.content;
  } catch (error) {
    console.error("AI Follow-up Generation Error:", error);
    return `Dear ${customerName}, this is a reminder about your outstanding invoice of LKR ${invoiceAmount}. Please contact us to arrange payment.`;
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

    // Simple fallback calculation
    const suggestedQty = Math.max(product.minStockLevel * 3, 10);
    const fallbackResponse = JSON.stringify({
      suggested_quantity: suggestedQty,
      reason: `Recommended ${suggestedQty} units to maintain adequate stock levels based on minimum stock threshold.`,
    });

    const response = await makeOpenAICall(
      [{ role: "user", content: prompt }],
      150,
      fallbackResponse
    );

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("AI Reorder Suggestion Error:", error);
    return {
      suggested_quantity: product.minStockLevel * 2,
      reason: "Standard reorder calculation based on minimum stock level",
    };
  }
};

export const predictSalesForecasting = async (salesData) => {
  try {
    if (salesData && salesData.length > 0) {
      const salesSummary = salesData.map((sale) => ({
        date: sale.paidDate,
        amount: sale.totalAmount,
      }));

      const prompt = `Analyze this sales data and predict next month's sales:
      ${JSON.stringify(salesSummary.slice(-10))}
      
      Return JSON with: {
        "predicted_amount": number,
        "confidence": 0.85,
        "trend": "increasing/decreasing/stable",
        "insights": "brief explanation"
      }`;

      // Calculate fallback prediction
      const totalSales = salesSummary.reduce(
        (sum, sale) => sum + sale.amount,
        0
      );
      const avgSales = totalSales / salesSummary.length;
      const lastMonthSales =
        salesSummary.slice(-5).reduce((sum, sale) => sum + sale.amount, 0) / 5;
      const trend =
        lastMonthSales > avgSales
          ? "increasing"
          : lastMonthSales < avgSales
          ? "decreasing"
          : "stable";

      const fallbackResponse = JSON.stringify({
        predicted_amount: Math.round(lastMonthSales * 1.1),
        confidence: 0.75,
        trend: trend,
        insights: `Based on recent sales patterns, expecting ${trend} trend with estimated ${Math.round(
          lastMonthSales * 1.1
        )} LKR next month.`,
      });

      const response = await makeOpenAICall(
        [{ role: "user", content: prompt }],
        200,
        fallbackResponse
      );

      return {
        success: true,
        data: JSON.parse(response.choices[0].message.content),
      };
    } else {
      return {
        success: false,
        message: "No sales data available for forecasting.",
        data: {
          predicted_amount: 0,
          confidence: 0,
          trend: "stable",
          insights: "Insufficient data for prediction",
        },
      };
    }
  } catch (error) {
    console.error("Error predicting sales forecasting:", error);
    return {
      success: false,
      message: error.message || "An error occurred while predicting sales.",
      data: {
        predicted_amount: 0,
        confidence: 0,
        trend: "stable",
        insights: "Error in prediction",
      },
    };
  }
};

export const generateBusinessInsights = async (userId) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Monthly revenue
    const monthlyRevenue = await Invoice.aggregate([
      {
        $match: {
          userId: userId,
          status: "paid",
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
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

    // Recent invoices
    const recentInvoices = await Invoice.find({ userId })
      .populate("customer", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const monthlyRevenueAmount = monthlyRevenue[0]?.totalAmount || 0;

    const prompt = `Analyze this business data and provide insights:
    Monthly Revenue: LKR ${monthlyRevenueAmount}
    Total Customers: ${totalCustomers}
    Low Stock Products: ${lowStockProducts}
    Pending Invoices: ${pendingInvoices}
    Top Products: ${JSON.stringify(topProducts.slice(0, 3))}
    
    Provide JSON with actionable business insights for a Sri Lankan SME: {
      "revenue_insight": "brief analysis",
      "inventory_recommendation": "suggestion",
      "customer_insight": "observation",
      "action_items": ["item1", "item2", "item3"]
    }`;

    // Generate fallback insights
    const fallbackInsights = {
      revenue_insight:
        monthlyRevenueAmount > 50000
          ? "Strong monthly revenue performance"
          : "Revenue could be improved through targeted marketing",
      inventory_recommendation:
        lowStockProducts > 0
          ? `${lowStockProducts} products need restocking`
          : "Inventory levels are healthy",
      customer_insight:
        totalCustomers > 10
          ? "Good customer base established"
          : "Focus on customer acquisition",
      action_items: [
        lowStockProducts > 0
          ? "Restock low inventory items"
          : "Monitor inventory levels",
        pendingInvoices > 0
          ? "Follow up on pending invoices"
          : "Maintain invoice processing",
        "Review top performing products for expansion opportunities",
      ],
    };

    const fallbackResponse = JSON.stringify(fallbackInsights);

    const response = await makeOpenAICall(
      [{ role: "user", content: prompt }],
      300,
      fallbackResponse
    );

    const aiInsights = JSON.parse(response.choices[0].message.content);

    return {
      success: true,
      data: {
        monthlyRevenue: monthlyRevenueAmount,
        totalCustomers,
        lowStockProducts,
        pendingInvoices,
        topProducts,
        recentInvoices,
        aiInsights,
      },
    };
  } catch (error) {
    console.error("Error generating business insights:", error);
    return {
      success: false,
      message: error.message || "An error occurred while generating insights.",
      data: {
        monthlyRevenue: 0,
        totalCustomers: 0,
        lowStockProducts: 0,
        pendingInvoices: 0,
        topProducts: [],
        recentInvoices: [],
        aiInsights: {
          revenue_insight: "Unable to analyze at this time",
          inventory_recommendation: "Check inventory manually",
          customer_insight: "No insights available",
          action_items: ["Review data", "Try again later"],
        },
      },
    };
  }
};
