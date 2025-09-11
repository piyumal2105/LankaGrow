import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../common/Button";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate("/dashboard");
    } catch (error) {
      // Error handling is done in the login function
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type={showPassword ? "text" : "password"}
            className={`input pl-10 pr-10 ${
              errors.password ? "input-error" : ""
            }`}
            placeholder="Enter your password"
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

      {/* Remember me and forgot password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-900"
          >
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Forgot your password?
          </a>
        </div>
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        loading={isSubmitting}
      >
        Sign in
      </Button>

      {/* Register link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Start your free trial
          </Link>
        </p>
      </div>
    </form>
  );
}

export default LoginForm;
