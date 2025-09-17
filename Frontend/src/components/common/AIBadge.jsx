import React from "react";
import { Sparkles, Zap } from "lucide-react";

const AIBadge = ({ size = "sm", variant = "default", className = "" }) => {
  const sizeClasses = {
    xs: "text-xs px-1.5 py-0.5",
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
  };

  const variantClasses = {
    default: "bg-purple-100 text-purple-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      <Sparkles className="w-3 h-3" />
      AI
    </span>
  );
};

export default AIBadge;
