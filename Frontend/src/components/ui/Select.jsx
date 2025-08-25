import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { cn } from "../../utils/helpers";

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  label,
  error,
  disabled = false,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useClickOutside(() => setIsOpen(false));

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          className={cn(
            "input-field flex items-center justify-between w-full",
            error && "border-error-500 focus:ring-error-500",
            disabled && "bg-gray-50 cursor-not-allowed",
            className
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          {...props}
        >
          <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-gray-400 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center justify-between transition-colors first:rounded-t-xl last:rounded-b-xl",
                  option.value === value && "bg-primary-50 text-primary-600"
                )}
                onClick={() => handleSelect(option)}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <Check className="h-4 w-4 text-primary-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-error-500">{error}</p>}
    </div>
  );
};

export default Select;
