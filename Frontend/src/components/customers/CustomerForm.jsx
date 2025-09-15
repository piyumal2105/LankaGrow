import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";
import { customerService } from "../../services/customerService";
import { validateEmail, validatePhone } from "../../utils/validators";
import Button from "../common/Button";

function CustomerForm({ customer, onClose, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const isEditing = !!customer;
  const queryClient = useQueryClient();

  // Manual form state - no react-hook-form to avoid any automatic submission
  const [formData, setFormData] = useState({
    customerType: "individual",
    name: "",
    businessName: "",
    email: "",
    phone: "",
    taxId: "",
    address: {
      street: "",
      city: "",
      province: "",
      postalCode: "",
    },
    creditLimit: 0,
    paymentTerms: 30,
    notes: "",
    status: "active",
    loyaltyPoints: 0,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when editing
  useEffect(() => {
    if (customer) {
      setFormData({
        customerType: customer.customerType || "individual",
        name: customer.name || "",
        businessName: customer.businessName || "",
        email: customer.email || "",
        phone: customer.phone || "",
        taxId: customer.taxId || "",
        address: {
          street: customer.address?.street || "",
          city: customer.address?.city || "",
          province: customer.address?.province || "",
          postalCode: customer.address?.postalCode || "",
        },
        creditLimit: customer.creditLimit || 0,
        paymentTerms: customer.paymentTerms || 30,
        notes: customer.notes || "",
        status: customer.status || "active",
        loyaltyPoints: customer.loyaltyPoints || 0,
      });
    }
  }, [customer]);

  const createMutation = useMutation({
    mutationFn: customerService.createCustomer,
    onSuccess: () => {
      toast.success("Customer created successfully");
      queryClient.invalidateQueries(["customers"]);
      setIsSubmitting(false);
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create customer");
      setIsSubmitting(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => customerService.updateCustomer(customer._id, data),
    onSuccess: () => {
      toast.success("Customer updated successfully");
      queryClient.invalidateQueries(["customers"]);
      setIsSubmitting(false);
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update customer");
      setIsSubmitting(false);
    },
  });

  const steps = [
    {
      title: "Customer Type",
      subtitle: "Select customer type and basic info",
      icon: <User className="w-5 h-5" />,
      fields: ["customerType", "name", "businessName"],
    },
    {
      title: "Contact Information",
      subtitle: "Email, phone, and tax details",
      icon: <Mail className="w-5 h-5" />,
      fields: ["email", "phone", "taxId"],
    },
    {
      title: "Address",
      subtitle: "Location and address details",
      icon: <MapPin className="w-5 h-5" />,
      fields: [
        "address.street",
        "address.city",
        "address.province",
        "address.postalCode",
      ],
    },
    {
      title: "Business Terms",
      subtitle: "Credit limit, payment terms, and notes",
      icon: <CreditCard className="w-5 h-5" />,
      fields: ["creditLimit", "paymentTerms", "notes", "status"],
    },
  ];

  // Update form data
  const updateFormData = (path, value) => {
    setFormData((prev) => {
      const newData = { ...prev };
      if (path.includes(".")) {
        const [parent, child] = path.split(".");
        newData[parent] = { ...newData[parent], [child]: value };
      } else {
        newData[path] = value;
      }
      return newData;
    });

    // Clear error when user starts typing
    if (errors[path]) {
      setErrors((prev) => ({ ...prev, [path]: null }));
    }
  };

  // Validation function
  const validateStep = (stepIndex) => {
    const stepFields = steps[stepIndex].fields;
    const newErrors = {};

    stepFields.forEach((field) => {
      if (field === "name" && !formData.name.trim()) {
        newErrors.name = "Name is required";
      }
      if (
        field === "businessName" &&
        formData.customerType === "business" &&
        !formData.businessName.trim()
      ) {
        newErrors.businessName = "Business name is required";
      }
      if (field === "phone" && !formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      }
      if (
        field === "phone" &&
        formData.phone.trim() &&
        !validatePhone(formData.phone)
      ) {
        newErrors.phone = "Invalid phone number";
      }
      if (
        field === "email" &&
        formData.email.trim() &&
        !validateEmail(formData.email)
      ) {
        newErrors.email = "Invalid email address";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    console.log("Next step clicked, current step:", currentStep);

    if (validateStep(currentStep - 1) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    console.log("Previous step clicked, current step:", currentStep);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Submit button clicked");
    console.log("Current step:", currentStep);
    console.log("Total steps:", totalSteps);
    console.log("Form data:", formData);

    if (currentStep !== totalSteps) {
      console.log("Not on final step, preventing submission");
      return;
    }

    if (isSubmitting) {
      console.log("Already submitting, preventing duplicate submission");
      return;
    }

    // Validate all steps
    let allValid = true;
    for (let i = 0; i < totalSteps; i++) {
      if (!validateStep(i)) {
        allValid = false;
        break;
      }
    }

    if (!allValid) {
      console.log("Validation failed");
      return;
    }

    console.log("Validation passed, submitting...");
    setIsSubmitting(true);

    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                index + 1 < currentStep
                  ? "bg-green-500 border-green-500 text-white"
                  : index + 1 === currentStep
                  ? "border-blue-500 text-blue-500 bg-blue-50"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              {index + 1 < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                step.icon
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-1 mx-2 transition-colors ${
                  index + 1 < currentStep ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {steps[currentStep - 1].title}
        </h3>
        <p className="text-sm text-gray-500">
          {steps[currentStep - 1].subtitle}
        </p>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Customer Type */}
      <div>
        <label className="label">Customer Type *</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => updateFormData("customerType", "individual")}
            className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-colors ${
              formData.customerType === "individual"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <User className="w-5 h-5" />
            <span>Individual</span>
          </button>
          <button
            type="button"
            onClick={() => updateFormData("customerType", "business")}
            className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-colors ${
              formData.customerType === "business"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Building className="w-5 h-5" />
            <span>Business</span>
          </button>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="label">
          {formData.customerType === "business"
            ? "Contact Person Name"
            : "Full Name"}{" "}
          *
        </label>
        <input
          type="text"
          className={`input ${errors.name ? "input-error" : ""}`}
          placeholder="Enter full name"
          value={formData.name}
          onChange={(e) => updateFormData("name", e.target.value)}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}
      </div>

      {/* Business Name (for business customers) */}
      {formData.customerType === "business" && (
        <div>
          <label className="label">Business Name *</label>
          <input
            type="text"
            className={`input ${errors.businessName ? "input-error" : ""}`}
            placeholder="Enter business name"
            value={formData.businessName}
            onChange={(e) => updateFormData("businessName", e.target.value)}
          />
          {errors.businessName && (
            <p className="error-text">{errors.businessName}</p>
          )}
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Email */}
      <div>
        <label className="label">Email</label>
        <div className="relative">
          <input
            type="email"
            className={`input pl-10 ${errors.email ? "input-error" : ""}`}
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
          />
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="label">Phone *</label>
        <div className="relative">
          <input
            type="tel"
            className={`input pl-10 ${errors.phone ? "input-error" : ""}`}
            placeholder="+94 77 123 4567"
            value={formData.phone}
            onChange={(e) => updateFormData("phone", e.target.value)}
          />
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        {errors.phone && <p className="error-text">{errors.phone}</p>}
      </div>

      {/* Tax ID (for business customers) */}
      {formData.customerType === "business" && (
        <div>
          <label className="label">Tax ID / VAT Number</label>
          <input
            type="text"
            className="input"
            placeholder="Enter tax ID or VAT number"
            value={formData.taxId}
            onChange={(e) => updateFormData("taxId", e.target.value)}
          />
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Street Address */}
      <div>
        <label className="label">Street Address</label>
        <input
          type="text"
          className="input"
          placeholder="Enter street address"
          value={formData.address.street}
          onChange={(e) => updateFormData("address.street", e.target.value)}
        />
      </div>

      {/* City, Province, Postal Code */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">City</label>
          <input
            type="text"
            className="input"
            placeholder="City"
            value={formData.address.city}
            onChange={(e) => updateFormData("address.city", e.target.value)}
          />
        </div>

        <div>
          <label className="label">Province</label>
          <select
            className="input"
            value={formData.address.province}
            onChange={(e) => updateFormData("address.province", e.target.value)}
          >
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
            type="text"
            className="input"
            placeholder="Postal code"
            value={formData.address.postalCode}
            onChange={(e) =>
              updateFormData("address.postalCode", e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      {/* Credit Limit and Payment Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Credit Limit</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              Rs
            </span>
            <input
              type="number"
              min="0"
              className="input pl-10"
              placeholder="0.00"
              value={formData.creditLimit}
              onChange={(e) =>
                updateFormData("creditLimit", parseFloat(e.target.value) || 0)
              }
            />
          </div>
        </div>

        <div>
          <label className="label">Payment Terms (days)</label>
          <input
            type="number"
            min="0"
            className="input"
            placeholder="30"
            value={formData.paymentTerms}
            onChange={(e) =>
              updateFormData("paymentTerms", parseInt(e.target.value) || 0)
            }
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="label">Notes</label>
        <textarea
          rows={3}
          className="input resize-none"
          placeholder="Additional notes about this customer"
          value={formData.notes}
          onChange={(e) => updateFormData("notes", e.target.value)}
        />
      </div>

      {/* Status */}
      <div>
        <label className="label">Status</label>
        <select
          className="input"
          value={formData.status}
          onChange={(e) => updateFormData("status", e.target.value)}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      {renderProgressBar()}

      {/* Current Step Content */}
      <div className="min-h-[300px]">{renderCurrentStep()}</div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <div className="flex space-x-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {currentStep > 1 && (
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>
          )}
        </div>

        <div>
          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={nextStep}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              loading={isSubmitting}
              className="flex items-center space-x-2"
            >
              <span>{isEditing ? "Update Customer" : "Create Customer"}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Step indicator */}
      <div className="text-center text-sm text-gray-500">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
}

export default CustomerForm;
