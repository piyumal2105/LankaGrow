import Invoice from "../models/Invoice.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import PDFDocument from "pdfkit";
import { generateInvoiceFollowUp } from "../services/aiService.js";

export const createInvoice = async (req, res) => {
  try {
    const { customer, items, dueDate, notes } = req.body;

    // Calculate totals
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(400)
          .json({ message: `Product not found: ${item.product}` });
      }

      const itemTotal = item.quantity * item.unitPrice - (item.discount || 0);
      subtotal += itemTotal;

      processedItems.push({
        ...item,
        productName: product.name,
        total: itemTotal,
      });

      // Update stock
      product.currentStock -= item.quantity;
      await product.save();
    }

    const taxRate = 0; // Configure based on business needs
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;

    const invoice = await Invoice.create({
      customer,
      items: processedItems,
      subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      dueDate,
      notes,
      userId: req.user.id,
    });

    await invoice.populate("customer");

    // Update customer total purchases
    await Customer.findByIdAndUpdate(customer, {
      $inc: { totalPurchases: totalAmount },
      lastPurchase: new Date(),
    });

    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOverdueInvoices = async (req, res) => {
  try {
    const overdueInvoices = await Invoice.find({
      userId: req.user.id,
      status: { $in: ["sent", "overdue"] },
      dueDate: { $lt: new Date() },
    }).populate("customer");

    // Generate AI follow-up suggestions
    const invoicesWithSuggestions = await Promise.all(
      overdueInvoices.map(async (invoice) => {
        const daysPastDue = Math.floor(
          (new Date() - invoice.dueDate) / (1000 * 60 * 60 * 24)
        );
        const followUpMessage = await generateInvoiceFollowUp(
          invoice.customer.name,
          invoice.totalAmount,
          daysPastDue
        );

        return {
          ...invoice.toObject(),
          daysPastDue,
          aiFollowUpMessage: followUpMessage,
        };
      })
    );

    res.json({ success: true, data: invoicesWithSuggestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Restore product stock
    for (const item of invoice.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.currentStock += item.quantity;
        await product.save();
      }
    }

    await invoice.remove();
    res.json({ success: true, message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("customer");
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const doc = new PDFDocument();
    let filename = `invoice-${invoice._id}.pdf`;
    filename = encodeURIComponent(filename);

    res.setHeader("Content-disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);

    // Add invoice details to PDF
    doc.fontSize(20).text(`Invoice #${invoice._id}`, { align: "center" });
    doc.moveDown();
    doc.text(`Customer: ${invoice.customer.name}`);
    doc.text(`Due Date: ${invoice.dueDate.toLocaleDateString()}`);
    doc.moveDown();

    // Add items
    invoice.items.forEach((item) => {
      doc.text(
        `${item.productName} - ${item.quantity} x $${item.unitPrice.toFixed(
          2
        )} = $${item.total.toFixed(2)}`
      );
    });

    doc.moveDown();
    doc.text(`Subtotal: $${invoice.subtotal.toFixed(2)}`);
    doc.text(`Tax (${invoice.taxRate}%): $${invoice.taxAmount.toFixed(2)}`);
    doc.text(`Total: $${invoice.totalAmount.toFixed(2)}`);

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user.id })
      .populate("customer")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("customer");
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const { customer, items, dueDate, notes } = req.body;
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Restore previous stock
    for (const item of invoice.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.currentStock += item.quantity;
        await product.save();
      }
    }

    // Calculate new totals
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(400)
          .json({ message: `Product not found: ${item.product}` });
      }

      const itemTotal = item.quantity * item.unitPrice - (item.discount || 0);
      subtotal += itemTotal;

      processedItems.push({
        ...item,
        productName: product.name,
        total: itemTotal,
      });

      // Update stock
      product.currentStock -= item.quantity;
      await product.save();
    }

    const taxRate = 0; // Configure based on business needs
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;

    invoice.customer = customer;
    invoice.items = processedItems;
    invoice.subtotal = subtotal;
    invoice.taxRate = taxRate;
    invoice.taxAmount = taxAmount;
    invoice.totalAmount = totalAmount;
    invoice.dueDate = dueDate;
    invoice.notes = notes;

    await invoice.save();
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const sendInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("customer");
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Simulate sending email
    console.log(`Sending invoice #${invoice._id} to ${invoice.customer.email}`);

    invoice.status = "sent";
    await invoice.save();

    res.json({ success: true, message: "Invoice sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsPaid = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    invoice.status = "paid";
    invoice.paidAt = new Date();
    await invoice.save();

    // Update customer total purchases
    await Customer.findByIdAndUpdate(invoice.customer, {
      $inc: { totalPurchases: -invoice.totalAmount },
    });

    res.json({ success: true, message: "Invoice marked as paid" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
