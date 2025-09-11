import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  User,
  Calendar,
  FileText,
  Calculator,
} from "lucide-react";
import { invoiceService } from "../../services/invoiceService";
import { customerService } from "../../services/customerService";
import { productService } from "../../services/productService";
import { formatCurrency } from "../../utils/formatters";
import { calculateTotal } from "../../utils/helpers";
import Button from "../common/Button";

function InvoiceForm({ invoice, onClose, onSuccess }) {
  const isEditing = !!invoice;
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: invoice || {
      customer: "",
      items: [{ product: "", quantity: 1, unitPrice: 0, discount: 0 }],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      notes: "",
      taxRate: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");
  const watchTaxRate = watch("taxRate") || 0;

  // Calculate totals
  const subtotal = calculateTotal(watchItems);
  const taxAmount = subtotal * (watchTaxRate / 100);
  const totalAmount = subtotal + taxAmount;

  // Load customers and products
  const { data: customers } = useQuery("customers", () =>
    customerService.getCustomers({})
  );
  const { data: products } = useQuery("products", () =>
    productService.getProducts({})
  );

  useEffect(() => {
    if (invoice) {
      reset(invoice);
    }
  }, [invoice, reset]);

  const createMutation = useMutation(invoiceService.createInvoice, {
    onSuccess: () => {
      toast.success("Invoice created successfully");
      queryClient.invalidateQueries("invoices");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create invoice");
    },
  });

  const updateMutation = useMutation(
    (data) => invoiceService.updateInvoice(invoice._id, data),
    {
      onSuccess: () => {
        toast.success("Invoice updated successfully");
        queryClient.invalidateQueries("invoices");
        onSuccess();
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Failed to update invoice"
        );
      },
    }
  );

  const onSubmit = (data) => {
    const invoiceData = {
      ...data,
      items: data.items.map((item) => ({
        ...item,
        total: item.quantity * item.unitPrice - (item.discount || 0),
      })),
    };

    if (isEditing) {
      updateMutation.mutate(invoiceData);
    } else {
      createMutation.mutate(invoiceData);
    }
  };

  const handleProductSelect = (index, productId) => {
    const selectedProduct = products?.data?.find((p) => p._id === productId);
    if (selectedProduct) {
      setValue(`items.${index}.unitPrice`, selectedProduct.sellingPrice);
      setValue(`items.${index}.productName`, selectedProduct.name);
    }
  };

  const addItem = () => {
    append({ product: "", quantity: 1, unitPrice: 0, discount: 0 });
  };

  const removeItem = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Invoice Header */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span>Invoice Details</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer */}
          <div>
            <label className="label">Customer *</label>
            <div className="relative">
              <select
                {...register("customer", { required: "Customer is required" })}
                className={`input pl-10 ${
                  errors.customer ? "input-error" : ""
                }`}
              >
                <option value="">Select customer</option>
                {customers?.data?.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {errors.customer && (
              <p className="error-text">{errors.customer.message}</p>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="label">Due Date *</label>
            <div className="relative">
              <input
                {...register("dueDate", { required: "Due date is required" })}
                type="date"
                className={`input pl-10 ${errors.dueDate ? "input-error" : ""}`}
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {errors.dueDate && (
              <p className="error-text">{errors.dueDate.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Items</h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addItem}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                {/* Product */}
                <div className="md:col-span-4">
                  <label className="label">Product</label>
                  <select
                    {...register(`items.${index}.product`, {
                      required: "Product is required",
                    })}
                    className={`input ${
                      errors.items?.[index]?.product ? "input-error" : ""
                    }`}
                    onChange={(e) => handleProductSelect(index, e.target.value)}
                  >
                    <option value="">Select product</option>
                    {products?.data?.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} (Stock: {product.currentStock})
                      </option>
                    ))}
                  </select>
                  {errors.items?.[index]?.product && (
                    <p className="error-text">
                      {errors.items[index].product.message}
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div className="md:col-span-2">
                  <label className="label">Qty</label>
                  <input
                    {...register(`items.${index}.quantity`, {
                      required: "Quantity is required",
                      min: { value: 1, message: "Minimum quantity is 1" },
                    })}
                    type="number"
                    min="1"
                    className={`input ${
                      errors.items?.[index]?.quantity ? "input-error" : ""
                    }`}
                  />
                  {errors.items?.[index]?.quantity && (
                    <p className="error-text">
                      {errors.items[index].quantity.message}
                    </p>
                  )}
                </div>

                {/* Unit Price */}
                <div className="md:col-span-2">
                  <label className="label">Unit Price</label>
                  <input
                    {...register(`items.${index}.unitPrice`, {
                      required: "Unit price is required",
                      min: { value: 0, message: "Price must be positive" },
                    })}
                    type="number"
                    step="0.01"
                    min="0"
                    className={`input ${
                      errors.items?.[index]?.unitPrice ? "input-error" : ""
                    }`}
                  />
                  {errors.items?.[index]?.unitPrice && (
                    <p className="error-text">
                      {errors.items[index].unitPrice.message}
                    </p>
                  )}
                </div>

                {/* Discount */}
                <div className="md:col-span-2">
                  <label className="label">Discount</label>
                  <input
                    {...register(`items.${index}.discount`)}
                    type="number"
                    step="0.01"
                    min="0"
                    className="input"
                    placeholder="0.00"
                  />
                </div>

                {/* Total */}
                <div className="md:col-span-1">
                  <label className="label">Total</label>
                  <div className="text-sm font-medium text-gray-900 py-2">
                    {formatCurrency(
                      (watchItems[index]?.quantity || 0) *
                        (watchItems[index]?.unitPrice || 0) -
                        (watchItems[index]?.discount || 0)
                    )}
                  </div>
                </div>

                {/* Remove button */}
                <div className="md:col-span-1">
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax and Totals */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-green-600" />
          <span>Totals</span>
        </h3>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Tax Rate (%)</label>
              <input
                {...register("taxRate")}
                type="number"
                step="0.01"
                min="0"
                max="100"
                className="input"
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax ({watchTaxRate}%):</span>
                <span className="font-medium">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
                <span>Total:</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="label">Notes</label>
        <textarea
          {...register("notes")}
          rows={3}
          className="input resize-none"
          placeholder="Additional notes for this invoice"
        />
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting} className="flex-1">
          {isEditing ? "Update Invoice" : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
}

export default InvoiceForm;
