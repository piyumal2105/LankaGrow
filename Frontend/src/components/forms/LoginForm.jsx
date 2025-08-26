import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useForm } from "../../hooks/useForm";
import { useAuth } from "../../hooks/useAuth";
import { useNotification } from "../../context/NotificationContext";
import { required, email } from "../../utils/validation";

const LoginForm = () => {
  const { login, loading } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const { values, errors, handleChange, handleBlur, handleSubmit } = useForm(
    { email: "", password: "" },
    {
      email: [required, email],
      password: [required],
    }
  );

  const onSubmit = async (formData) => {
    const result = await login(formData.email, formData.password);

    if (result.success) {
      showSuccess("Welcome back!");
      navigate("/dashboard");
    } else {
      showError(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
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
            Welcome back
          </h2>
          <p className="text-gray-600">
            Sign in to your account to continue growing your business with AI
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
          <div className="space-y-5">
            <Input
              name="email"
              type="email"
              label="Email Address"
              placeholder="your@email.com"
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
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <Link
              to="/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full group"
            size="lg"
          >
            Sign in to your account
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign up for free
            </Link>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default LoginForm;
