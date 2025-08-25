export const required = (value) => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return "This field is required";
  }
  return null;
};

export const email = (value) => {
  if (value && !validateEmail(value)) {
    return "Please enter a valid email address";
  }
  return null;
};

export const phone = (value) => {
  if (value && !validatePhone(value)) {
    return "Please enter a valid Sri Lankan phone number";
  }
  return null;
};

export const minLength = (min) => (value) => {
  if (value && value.length < min) {
    return `Must be at least ${min} characters long`;
  }
  return null;
};

export const maxLength = (max) => (value) => {
  if (value && value.length > max) {
    return `Must be no more than ${max} characters long`;
  }
  return null;
};

export const minValue = (min) => (value) => {
  if (value !== undefined && value !== null && Number(value) < min) {
    return `Must be at least ${min}`;
  }
  return null;
};

export const maxValue = (max) => (value) => {
  if (value !== undefined && value !== null && Number(value) > max) {
    return `Must be no more than ${max}`;
  }
  return null;
};

export const positiveNumber = (value) => {
  if (value !== undefined && value !== null && Number(value) <= 0) {
    return "Must be a positive number";
  }
  return null;
};

export const validateForm = (values, validationRules) => {
  const errors = {};

  Object.keys(validationRules).forEach((field) => {
    const rules = validationRules[field];
    const value = values[field];

    for (let rule of rules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
