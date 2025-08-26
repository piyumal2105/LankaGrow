import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Building,
  Phone,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { useForm } from "../../hooks/useForm";
import { useAuth } from "../../hooks/useAuth";
import { useNotification } from "../../context/NotificationContext";
import { required, email, minLength } from "../../utils/validation";
import { BUSINESS_TYPES } from "../../utils/constants";

const RegisterForm = () => {
  const { register, loading } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const businessTypeOptions = BUSINESS_TYPES.map((type) => ({
    value: type,
    label: type,
  }));

  const { values, errors, handleChange, handleBlur, handleSubmit, setValue } =
    useForm(
      {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        businessName: "",
        businessType: "",
        phone: "",
      },
      {
        firstName: [required],
        lastName: [required],
        email: [required, email],
        password: [required, minLength(6)],
        businessName: [required],
        businessType: [required],
        phone: [required],
      }
    );

  const onSubmit = async (formData) => {
    const result = await register(formData);

    if (result.success) {
      showSuccess("Welcome to LankaGrow! Your account has been created.");
      navigate("/dashboard");
    } else {
      showError(result.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full space-y-8"
      >
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div className="font-display text-2xl font-bold text-gray-900">
              Lanka<span className="text-gradient">Grow</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Start your AI journey
          </h2>
          <p className="text-gray-600">
            Create your account and transform your business with intelligent
            insights
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit);
          }}
          className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-soft"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              name="firstName"
              label="First Name"
              placeholder="John"
              leftIcon={User}
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.firstName}
              required
            />

            <Input
              name="lastName"
              label="Last Name"
              placeholder="Doe"
              leftIcon={User}
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.lastName}
              required
            />
          </div>

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
            required
          />

          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            leftIcon={Lock}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            helperText="Must be at least 6 characters"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              name="businessName"
              label="Business Name"
              placeholder="Your Business Name"
              leftIcon={Building}
              value={values.businessName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.businessName}
              required
            />

            <Select
              label="Business Type"
              options={businessTypeOptions}
              value={values.businessType}
              onChange={(value) => setValue("businessType", value)}
              placeholder="Select business type"
              error={errors.businessType}
            />
          </div>

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

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full group"
            size="lg"
          >
            Create your account
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in here
            </Link>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default RegisterForm;
