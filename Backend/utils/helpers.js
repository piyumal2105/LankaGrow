export const generateSKU = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 5);
  return `SKU-${timestamp}-${randomStr}`.toUpperCase();
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(amount);
};

export const calculateProfitMargin = (sellingPrice, purchasePrice) => {
  return ((sellingPrice - purchasePrice) / sellingPrice) * 100;
};
