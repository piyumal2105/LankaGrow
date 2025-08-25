import React from "react";
import { cn } from "../../utils/helpers";

const badgeVariants = {
  primary: "badge-primary",
  secondary: "bg-gray-100 text-gray-800",
  success: "badge-success",
  warning: "badge-warning",
  error: "badge-error",
  info: "bg-blue-100 text-blue-800",
};

const Badge = ({ children, variant = "primary", className, ...props }) => {
  return (
    <span className={cn("badge", badgeVariants[variant], className)} {...props}>
      {children}
    </span>
  );
};

export default Badge;
