import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, User, Mail, Lock, Building, Phone } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../common/Button";

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const businessTypes = [
    "Retail",
    "E-commerce",
    "Manufacturing",
    "Services",
    "Food & Beverage",
    "Healthcare",
    "Education",
    "Technology",
    "Agriculture",
    "Other",
  ];

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      navigate("/dashboard");
    } catch (error) {
      // Error handling is done in the register function
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="label">
            First name
          </label>
          <div className="relative">
            <input
              {...register("firstName", { required: "First name is required" })}
              type="text"
              className={`input pl-10 ${errors.firstName ? "input-error" : ""}`}
              placeholder="First name"
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.firstName && (
            <p className="error-text">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="label">
            Last name
          </label>
          <input
            {...register("lastName", { required: "Last name is required" })}
            type="text"
            className={`input ${errors.lastName ? "input-error" : ""}`}
            placeholder="Last name"
          />
          {errors.lastName && (
            <p className="error-text">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="label">
          Email address
        </label>
        <div className="relative">
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            type="email"
            className={`input pl-10 ${errors.email ? "input-error" : ""}`}
            placeholder="Enter your email"
          />
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        {errors.email && <p className="error-text">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="label">
          Phone number
        </label>
        <div className="relative">
          <input
            {...register("phone", { required: "Phone number is required" })}
            type="tel"
            className={`input pl-10 ${errors.phone ? "input-error" : ""}`}
            placeholder="+94 77 123 4567"
          />
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        {errors.phone && <p className="error-text">{errors.phone.message}</p>}
      </div>

      {/* Business Information */}
      <div>
        <label htmlFor="businessName" className="label">
          Business name
        </label>
        <div className="relative">
          <input
            {...register("businessName", {
              required: "Business name is required",
            })}
            type="text"
            className={`input pl-10 ${
              errors.businessName ? "input-error" : ""
            }`}
            placeholder="Your business name"
          />
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        {errors.businessName && (
          <p className="error-text">{errors.businessName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="businessType" className="label">
          Business type
        </label>
        <select
          {...register("businessType", {
            required: "Business type is required",
          })}
          className={`input ${errors.businessType ? "input-error" : ""}`}
        >
          <option value="">Select business type</option>
          {businessTypes.map((type) => (
            <option key={type} value={type.toLowerCase()}>
              {type}
            </option>
          ))}
        </select>
        {errors.businessType && (
          <p className="error-text">{errors.businessType.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <div className="relative">
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, and one number",
              },
            })}
            type={showPassword ? "text" : "password"}
            className={`input pl-10 pr-10 ${
              errors.password ? "input-error" : ""
            }`}
            placeholder="Create a strong password"
          />
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-gray-400" />
            ) : (
              <Eye className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="error-text">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="label">
          Confirm password
        </label>
        <div className="relative">
          <input
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            type="password"
            className={`input pl-10 ${
              errors.confirmPassword ? "input-error" : ""
            }`}
            placeholder="Confirm your password"
          />
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        {errors.confirmPassword && (
          <p className="error-text">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Terms and conditions */}
      <div className="flex items-center">
        <input
          {...register("acceptTerms", {
            required: "You must accept the terms and conditions",
          })}
          id="accept-terms"
          name="acceptTerms"
          type="checkbox"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label
          htmlFor="accept-terms"
          className="ml-2 block text-sm text-gray-900"
        >
          I agree to the{" "}
          <a href="#" className="text-blue-600 hover:text-blue-500">
            Terms and Conditions
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:text-blue-500">
            Privacy Policy
          </a>
        </label>
      </div>
      {errors.acceptTerms && (
        <p className="error-text">{errors.acceptTerms.message}</p>
      )}

      {/* Submit button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        loading={isSubmitting}
      >
        Start Your Free Trial
      </Button>

      {/* Login link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}

export default RegisterForm;
