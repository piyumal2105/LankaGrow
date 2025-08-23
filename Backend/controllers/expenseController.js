import Expense from "../models/Expense.js";
import { categorizeExpense } from "../services/aiService.js";

export const createExpense = async (req, res) => {
  try {
    const expenseData = { ...req.body, userId: req.user.id };

    // AI categorization if category not provided
    if (!expenseData.category) {
      const aiResult = await categorizeExpense(
        expenseData.description,
        expenseData.amount
      );
      expenseData.category = aiResult.category;
      expenseData.aiCategory = aiResult.category;
      expenseData.aiConfidence = aiResult.confidence;
    }

    const expense = await Expense.create(expenseData);
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const categorizeExpenseAI = async (req, res) => {
  try {
    const { description, amount } = req.body;
    const result = await categorizeExpense(description, amount);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Enhanced services/aiService.js additions
export const predictSalesForecasting = async (salesData) => {
  try {
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

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("AI Sales Forecasting Error:", error);
    return {
      predicted_amount: 0,
      confidence: 0,
      trend: "stable",
      insights: "Unable to generate forecast",
    };
  }
};

export const generateBusinessInsights = async (userId) => {
  try {
    // This would typically analyze user's business data
    const prompt = `Generate 3 key business insights for a Sri Lankan SME based on:
    - Recent sales performance
    - Inventory management
    - Customer behavior
    
    Return JSON array: [{"insight": "text", "priority": "high/medium/low", "action": "suggested action"}]`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("AI Business Insights Error:", error);
    return [
      {
        insight:
          "Monitor your cash flow regularly to ensure healthy business operations",
        priority: "high",
        action: "Set up weekly financial reviews",
      },
    ];
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    res.json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const expenseData = req.body;

    // AI categorization if category not provided
    if (
      !expenseData.category &&
      expenseData.description &&
      expenseData.amount
    ) {
      const aiResult = await categorizeExpense(
        expenseData.description,
        expenseData.amount
      );
      expenseData.category = aiResult.category;
      expenseData.aiCategory = aiResult.category;
      expenseData.aiConfidence = aiResult.confidence;
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      expenseData,
      { new: true, runValidators: true }
    );
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const uploadReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // In a real app, you'd save the file path to the expense record
    res.json({ success: true, data: { filePath: req.file.path } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
