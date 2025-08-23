import Customer from "../models/Customer.js";
import Invoice from "../models/Invoice.js";

export const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, customerType } = req.query;

    const query = { userId: req.user.id };

    if (customerType) query.customerType = customerType;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const customers = await Customer.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Customer.countDocuments(query);

    res.json({
      success: true,
      data: customers,
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

export const getTopCustomers = async (req, res) => {
  try {
    const topCustomers = await Customer.find({ userId: req.user.id })
      .sort({ totalPurchases: -1 })
      .limit(10);

    res.json({ success: true, data: topCustomers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await Invoice.deleteMany({
      customerId: req.params.id,
      userId: req.user.id,
    });

    res.json({ success: true, message: "Customer deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCustomerAnalytics = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments({
      userId: req.user.id,
    });

    const customerTypes = await Customer.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: "$customerType",
          count: { $sum: 1 },
        },
      },
    ]);

    const monthlyNewCustomers = await Customer.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      data: {
        totalCustomers,
        customerTypes,
        monthlyNewCustomers,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
