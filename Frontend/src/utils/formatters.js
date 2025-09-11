import { format } from "date-fns";

export const formatCurrency = (amount, currency = "LKR") => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat("en-LK").format(number || 0);
};

export const formatDate = (date, formatString = "PPP") => {
  if (!date) return "";
  return format(new Date(date), formatString);
};

export const formatDateTime = (date) => {
  if (!date) return "";
  return format(new Date(date), "PPP p");
};

export const formatRelativeTime = (date) => {
  if (!date) return "";

  const now = new Date();
  const targetDate = new Date(date);
  const diffInHours = Math.abs(now - targetDate) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return format(targetDate, "h:mm a");
  } else if (diffInHours < 168) {
    // 7 days
    return format(targetDate, "EEE h:mm a");
  } else {
    return format(targetDate, "MMM d, yyyy");
  }
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatPercentage = (value, decimals = 1) => {
  return `${(value || 0).toFixed(decimals)}%`;
};
