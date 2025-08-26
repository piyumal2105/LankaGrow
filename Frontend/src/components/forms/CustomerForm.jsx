import React from "react";
import { User, Mail, Phone, Building, MapPin, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Select from "../ui/Select";
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card";
import { useForm } from "../../hooks/useForm";
import { useNotification } from "../../context/NotificationContext";
import { required, email, phone } from "../../utils/validation";
import { CUSTOMER_TYPES } from "../../utils/constants";

const CustomerForm = ({
  initialData = {},
  onSubmit,
  loading = false,
  mode = "create",
}) => {
  const { showSuccess, showError } = useNotification();

  const { values, errors, handleChange, handleBlur, handleSubmit, setValue } =
    useForm(
      {
        name: "",
        email: "",
        phone: "",
        customerType: "individual",
        businessName: "",
        address: {
          street: "",
          city: "",
          province: "",
          postalCode: "",
        },
        creditLimit: "",
        paymentTerms: "30",
        notes: "",
        ...initialData,
      },
      {
        name: [required],
        phone: [required, phone],
        email: [email],
      }
    );

  const handleFormSubmit = async (formData) => {
    try {
      await onSubmit(formData);
      showSuccess(
        `Customer ${mode === "create" ? "created" : "updated"} successfully!`
      );
    } catch (error) {
      showError(error.message || `Failed to ${mode} customer`);
    }
  };

  const handleAddressChange = (field, value) => {
    setValue("address", {
      ...values.address,
      [field]: value,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === "create" ? "Add New Customer" : "Edit Customer"}
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
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="name"
                  label="Full Name"
                  placeholder="John Doe"
                  leftIcon={User}
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.name}
                  required
                />

                <Select
                  label="Customer Type"
                  options={CUSTOMER_TYPES}
                  value={values.customerType}
                  onChange={(value) => setValue("customerType", value)}
                  error={errors.customerType}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="john@example.com"
                  leftIcon={Mail}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                />

                <Input
                  name="phone"
                  label="Phone Number"
                  placeholder="+94 71 234 5678"
                  leftIcon={Phone}
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.phone}
                  required
                />
              </div>

              {values.customerType === "business" && (
                <Input
                  name="businessName"
                  label="Business Name"
                  placeholder="ABC Company Ltd."
                  leftIcon={Building}
                  value={values.businessName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.businessName}
                />
              )}
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Address</h3>

              <Input
                name="address.street"
                label="Street Address"
                placeholder="123 Main Street"
                leftIcon={MapPin}
                value={values.address?.street || ""}
                onChange={(e) => handleAddressChange("street", e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  name="address.city"
                  label="City"
                  placeholder="Colombo"
                  value={values.address?.city || ""}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                />

                <Input
                  name="address.province"
                  label="Province"
                  placeholder="Western"
                  value={values.address?.province || ""}
                  onChange={(e) =>
                    handleAddressChange("province", e.target.value)
                  }
                />

                <Input
                  name="address.postalCode"
                  label="Postal Code"
                  placeholder="00100"
                  value={values.address?.postalCode || ""}
                  onChange={(e) =>
                    handleAddressChange("postalCode", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Business Terms */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Business Terms
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="creditLimit"
                  label="Credit Limit (LKR)"
                  type="number"
                  placeholder="0.00"
                  leftIcon={CreditCard}
                  value={values.creditLimit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.creditLimit}
                  helperText="Leave blank for no credit limit"
                />

                <Input
                  name="paymentTerms"
                  label="Payment Terms (Days)"
                  type="number"
                  placeholder="30"
                  value={values.paymentTerms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.paymentTerms}
                />
              </div>

              <Textarea
                name="notes"
                label="Notes"
                placeholder="Additional information about this customer..."
                rows={3}
                value={values.notes}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.notes}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                {mode === "create" ? "Add Customer" : "Update Customer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CustomerForm;
