import React from "react";
import { cn } from "../../utils/helpers";

const Input = React.forwardRef(
  (
    {
      className,
      type = "text",
      error,
      label,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LeftIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <input
            type={type}
            className={cn(
              "input-field",
              LeftIcon && "pl-10",
              RightIcon && "pr-10",
              error && "border-error-500 focus:ring-error-500",
              className
            )}
            ref={ref}
            {...props}
          />
          {RightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <RightIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}
        </div>
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

Input.displayName = "Input";

export default Input;
