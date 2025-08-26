import React, { useState, useEffect } from "react";
import {
  FileText,
  Calendar,
  User,
  Plus,
  Trash2,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card";
import { useForm } from "../../hooks/useForm";
import { useNotification } from "../../context/NotificationContext";
import { productsAPI } from "../../services/products";
import { customersAPI } from "../../services/customers";
import { required, positiveNumber } from "../../utils/validation";
import { formatCurrency } from "../../utils/helpers";

const InvoiceForm = ({
  initialData = {},
  onSubmit,
  loading = false,
  mode = "create",
}) => {
  const { showError } = useNotification();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const { values, errors, handleChange, handleBlur, handleSubmit, setValue } =
    useForm(
      {
        customer: "",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        items: [{ product: "", quantity: 1, unitPrice: 0, discount: 0 }],
        notes: "",
        ...initialData,
      },
      {
        customer: [required],
        dueDate: [required],
      }
    );

  // Load products and customers
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, customersRes] = await Promise.all([
          productsAPI.getAll(),
          customersAPI.getAll(),
        ]);

        setProducts(productsRes.data.data || []);
        setCustomers(customersRes.data.data || []);
      } catch (error) {
        showError("Failed to load data");
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [showError]);

  const customerOptions = customers.map((customer) => ({
    value: customer._id,
    label: customer.name,
  }));

  const productOptions = products.map((product) => ({
    value: product._id,
    label: `${product.name} - ${formatCurrency(product.sellingPrice)}`,
  }));

  const addItem = () => {
    setValue("items", [
      ...values.items,
      { product: "", quantity: 1, unitPrice: 0, discount: 0 },
    ]);
  };

  const removeItem = (index) => {
    const newItems = values.items.filter((_, i) => i !== index);
    setValue(
      "items",
      newItems.length > 0
        ? newItems
        : [{ product: "", quantity: 1, unitPrice: 0, discount: 0 }]
    );
  };

  const updateItem = (index, field, value) => {
    const newItems = [...values.items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Auto-fill unit price when product is selected
    if (field === "product") {
      const selectedProduct = products.find((p) => p._id === value);
      if (selectedProduct) {
        newItems[index].unitPrice = selectedProduct.sellingPrice;
      }
    }

    setValue("items", newItems);
  };

  const calculateTotals = () => {
    const subtotal = values.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice - (item.discount || 0);
      return sum + Math.max(0, itemTotal);
    }, 0);

    const taxRate = 0; // Configure based on business needs
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    return { subtotal, taxAmount, total, taxRate };
  };

  const { subtotal, taxAmount, total, taxRate } = calculateTotals();

  const handleFormSubmit = async (formData) => {
    if (
      formData.items.length === 0 ||
      formData.items.some((item) => !item.product)
    ) {
      showError("Please add at least one product");
      return;
    }

    await onSubmit({
      ...formData,
      subtotal,
      taxAmount,
      taxRate,
      totalAmount: total,
    });
  };

  if (loadingData) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary-600" />
            {mode === "create" ? "Create Invoice" : "Edit Invoice"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(handleFormSubmit);
            }}
            className="space-y-6"
          >
            {/* Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Customer"
                options={customerOptions}
                value={values.customer}
                onChange={(value) => setValue("customer", value)}
                placeholder="Select a customer"
                error={errors.customer}
                leftIcon={User}
              />

              <Input
                name="dueDate"
                type="date"
                label="Due Date"
                leftIcon={Calendar}
                value={values.dueDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.dueDate}
                required
              />
            </div>

            {/* Invoice Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Invoice Items
                </h3>
                <Button
                  type="button"
                  onClick={addItem}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-3">
                {values.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-3 items-end p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="col-span-4">
                      <Select
                        label="Product"
                        options={productOptions}
                        value={item.product}
                        onChange={(value) =>
                          updateItem(index, "product", value)
                        }
                        placeholder="Select product"
                      />
                    </div>

                    <div className="col-span-2">
                      <Input
                        label="Quantity"
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", Number(e.target.value))
                        }
                      />
                    </div>

                    <div className="col-span-2">
                      <Input
                        label="Unit Price"
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(index, "unitPrice", Number(e.target.value))
                        }
                        leftIcon={DollarSign}
                      />
                    </div>

                    <div className="col-span-2">
                      <Input
                        label="Discount"
                        type="number"
                        step="0.01"
                        value={item.discount || 0}
                        onChange={(e) =>
                          updateItem(index, "discount", Number(e.target.value))
                        }
                        leftIcon={DollarSign}
                      />
                    </div>

                    <div className="col-span-1">
                      <p className="text-sm text-gray-500 mb-1">Total</p>
                      <p className="font-semibold">
                        {formatCurrency(
                          item.quantity * item.unitPrice - (item.discount || 0)
                        )}
                      </p>
                    </div>

                    <div className="col-span-1">
                      {values.items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoice Totals */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="max-w-sm ml-auto space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                {taxRate > 0 && (
                  <div className="flex justify-between">
                    <span>Tax ({taxRate}%):</span>
                    <span className="font-semibold">
                      {formatCurrency(taxAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <Textarea
              name="notes"
              label="Notes"
              placeholder="Additional notes for the invoice..."
              rows={3}
              value={values.notes}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.notes}
            />

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                {mode === "create" ? "Create Invoice" : "Update Invoice"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InvoiceForm;
