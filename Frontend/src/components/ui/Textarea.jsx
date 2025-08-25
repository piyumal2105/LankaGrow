import React from "react";
import { cn } from "../../utils/helpers";

const Textarea = React.forwardRef(
  ({ className, label, error, helperText, rows = 4, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <textarea
          rows={rows}
          className={cn(
            "input-field resize-vertical",
            error && "border-error-500 focus:ring-error-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {(error || helperText) && (
          <p
            className={cn(
              "text-sm",
              error ? "text-error-500" : "text-gray-500"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
