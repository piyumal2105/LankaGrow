export const formatCurrency = (amount, currency = "LKR") => {
  if (!amount) return `${currency} 0`;
  return `${currency} ${amount.toLocaleString()}`;
};

export const formatDate = (date, format = "short") => {
  if (!date) return "";

  const d = new Date(date);
  if (format === "short") {
    return d.toLocaleDateString();
  } else if (format === "long") {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return d.toISOString().split("T")[0];
};

export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return ((value / total) * 100).toFixed(1);
};

export const generateSKU = (prefix = "SKU") => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};
