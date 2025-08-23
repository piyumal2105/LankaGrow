import Product from "../models/Product.js";
import { generateAITags, suggestReorderLevel } from "../services/aiService.js";

export const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body, userId: req.user.id };

    // Generate AI tags
    const aiTags = await generateAITags(
      productData.name,
      productData.description,
      productData.category
    );
    productData.aiTags = aiTags;

    const product = await Product.create(productData);
    await product.populate("supplier");

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status, search } = req.query;

    const query = { userId: req.user.id };

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$text = { $search: search };
    }

    const products = await Product.find(query)
      .populate("supplier")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, type } = req.body; // type: 'add' or 'subtract'

    const product = await Product.findOne({ _id: id, userId: req.user.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (type === "add") {
      product.currentStock += quantity;
    } else {
      product.currentStock = Math.max(0, product.currentStock - quantity);
    }

    await product.save();

    // AI suggestion for reorder if stock is low
    if (product.currentStock <= product.minStockLevel) {
      const suggestion = await suggestReorderLevel(product);
      return res.json({
        success: true,
        data: product,
        aiSuggestion: suggestion,
      });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      _id: id,
      userId: req.user.id,
    }).populate("supplier");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate("supplier");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      userId: req.user.id,
      currentStock: { $lte: 5 }, // Threshold for low stock
    }).populate("supplier");

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductAnalytics = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ userId: req.user.id });
    const lowStockCount = await Product.countDocuments({
      userId: req.user.id,
      currentStock: { $lte: 5 },
    });

    const categoryAggregation = await Product.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        lowStockCount,
        categoryDistribution: categoryAggregation,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
