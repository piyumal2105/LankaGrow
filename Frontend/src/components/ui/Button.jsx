import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/helpers";

const buttonVariants = {
  default: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  ghost: "btn-ghost",
  outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
  danger: "bg-error-500 hover:bg-error-600 text-white",
  success: "bg-success-500 hover:bg-success-600 text-white",
  warning: "bg-warning-500 hover:bg-warning-600 text-white",
};

const sizeVariants = {
  sm: "px-3 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
  xl: "px-10 py-5 text-xl",
};

const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "md",
      loading = false,
      disabled = false,
      children,
      onClick,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed",
          buttonVariants[variant],
          sizeVariants[size],
          className
        )}
        disabled={isDisabled}
        onClick={onClick}
        whileHover={!isDisabled ? { scale: 1.02, y: -1 } : {}}
        whileTap={!isDisabled ? { scale: 0.98, y: 0 } : {}}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
