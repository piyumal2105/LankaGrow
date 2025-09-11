import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { User, Building, Mail, Phone, MapPin, CreditCard } from "lucide-react";
import { customerService } from "../../services/customerService";
import { validateEmail, validatePhone } from "../../utils/validators";
import Button from "../common/Button";

function CustomerForm({ customer, onClose, onSuccess }) {
  const isEditing = !!customer;
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    setValue,
  } = useForm({
    defaultValues: customer || {
      customerType: "individual",
      status: "active",
      paymentTerms: 30,
      creditLimit: 0,
      loyaltyPoints: 0,
    },
  });

  const watchCustomerType = watch("customerType");

  useEffect(() => {
    if (customer) {
      reset(customer);
    }
  }, [customer, reset]);

  const createMutation = useMutation(customerService.createCustomer, {
    onSuccess: () => {
      toast.success("Customer created successfully");
      queryClient.invalidateQueries("customers");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create customer");
    },
  });

  const updateMutation = useMutation(
    (data) => customerService.updateCustomer(customer._id, data),
    {
      onSuccess: () => {
        toast.success("Customer updated successfully");
        queryClient.invalidateQueries("customers");
        onSuccess();
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Failed to update customer"
        );
      },
    }
  );

  const onSubmit = (data) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Customer Type */}
      <div>
        <label className="label">Customer Type *</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setValue("customerType", "individual")}
            className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-colors ${
              watchCustomerType === "individual"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <User className="w-5 h-5" />
            <span>Individual</span>
          </button>
          <button
            type="button"
            onClick={() => setValue("customerType", "business")}
            className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-colors ${
              watchCustomerType === "business"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Building className="w-5 h-5" />
            <span>Business</span>
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
          <User className="w-5 h-5 text-blue-600" />
          <span>Basic Information</span>
        </h3>

        {/* Name */}
        <div>
          <label className="label">
            {watchCustomerType === "business"
              ? "Contact Person Name"
              : "Full Name"}{" "}
            *
          </label>
          <input
            {...register("name", { required: "Name is required" })}
            type="text"
            className={`input ${errors.name ? "input-error" : ""}`}
            placeholder="Enter full name"
          />
          {errors.name && <p className="error-text">{errors.name.message}</p>}
        </div>

        {/* Business Name (for business customers) */}
        {watchCustomerType === "business" && (
          <div>
            <label className="label">Business Name *</label>
            <input
              {...register("businessName", {
                required:
                  watchCustomerType === "business"
                    ? "Business name is required"
                    : false,
              })}
              type="text"
              className={`input ${errors.businessName ? "input-error" : ""}`}
              placeholder="Enter business name"
            />
            {errors.businessName && (
              <p className="error-text">{errors.businessName.message}</p>
            )}
          </div>
        )}

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <input
                {...register("email", {
                  validate: (value) =>
                    !value || validateEmail(value) || "Invalid email address",
                })}
                type="email"
                className={`input pl-10 ${errors.email ? "input-error" : ""}`}
                placeholder="Enter email address"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {errors.email && (
              <p className="error-text">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="label">Phone *</label>
            <div className="relative">
              <input
                {...register("phone", {
                  required: "Phone number is required",
                  validate: (value) =>
                    validatePhone(value) || "Invalid phone number",
                })}
                type="tel"
                className={`input pl-10 ${errors.phone ? "input-error" : ""}`}
                placeholder="+94 77 123 4567"
              />
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {errors.phone && (
              <p className="error-text">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Tax ID (for business customers) */}
        {watchCustomerType === "business" && (
          <div>
            <label className="label">Tax ID / VAT Number</label>
            <input
              {...register("taxId")}
              type="text"
              className="input"
              placeholder="Enter tax ID or VAT number"
            />
          </div>
        )}
      </div>

      {/* Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-green-600" />
          <span>Address</span>
        </h3>

        <div>
          <label className="label">Street Address</label>
          <input
            {...register("address.street")}
            type="text"
            className="input"
            placeholder="Enter street address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">City</label>
            <input
              {...register("address.city")}
              type="text"
              className="input"
              placeholder="City"
            />
          </div>

          <div>
            <label className="label">Province</label>
            <select {...register("address.province")} className="input">
              <option value="">Select province</option>
              <option value="Western">Western</option>
              <option value="Central">Central</option>
              <option value="Southern">Southern</option>
              <option value="Northern">Northern</option>
              <option value="Eastern">Eastern</option>
              <option value="North Western">North Western</option>
              <option value="North Central">North Central</option>
              <option value="Uva">Uva</option>
              <option value="Sabaragamuwa">Sabaragamuwa</option>
            </select>
          </div>

          <div>
            <label className="label">Postal Code</label>
            <input
              {...register("address.postalCode")}
              type="text"
              className="input"
              placeholder="Postal code"
            />
          </div>
        </div>
      </div>

      {/* Business Terms */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-purple-600" />
          <span>Business Terms</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Credit Limit</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                Rs
              </span>
              <input
                {...register("creditLimit")}
                type="number"
                min="0"
                className="input pl-10"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="label">Payment Terms (days)</label>
            <input
              {...register("paymentTerms")}
              type="number"
              min="0"
              className="input"
              placeholder="30"
            />
          </div>
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea
            {...register("notes")}
            rows={3}
            className="input resize-none"
            placeholder="Additional notes about this customer"
          />
        </div>

        <div>
          <label className="label">Status</label>
          <select {...register("status")} className="input">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
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
          {isEditing ? "Update Customer" : "Create Customer"}
        </Button>
      </div>
    </form>
  );
}

export default CustomerForm;
