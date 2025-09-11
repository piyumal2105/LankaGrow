import React from "react";
import { clsx } from "clsx";

function LoadingSpinner({ size = "md", className = "", color = "primary" }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colors = {
    primary: "border-primary-600",
    white: "border-white",
    gray: "border-gray-600",
  };

  return (
    <div
      className={clsx(
        "animate-spin rounded-full border-2 border-transparent border-t-current",
        sizes[size],
        colors[color],
        className
      )}
    />
  );
}

export default LoadingSpinner;
