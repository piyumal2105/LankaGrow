import React, { useState } from "react";
import { ChevronDown, Check, X } from "lucide-react";
import { useClickOutside } from "../../hooks/useClickOutside";

const FilterDropdown = ({
  options = [],
  value = [],
  onChange,
  placeholder = "Select filters",
  multiple = true,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useClickOutside(() => setIsOpen(false));

  const handleOptionClick = (optionValue) => {
    if (multiple) {
      const newValue = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      onChange(newValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const clearAll = () => {
    onChange(multiple ? [] : "");
  };

  const selectedCount = multiple ? value.length : value ? 1 : 0;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          {selectedCount > 0 ? (
            <>
              <span className="text-gray-900">{selectedCount} selected</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearAll();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => {
            const isSelected = multiple
              ? value.includes(option.value)
              : value === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <span className="text-gray-900">{option.label}</span>
                {isSelected && <Check className="h-4 w-4 text-primary-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
