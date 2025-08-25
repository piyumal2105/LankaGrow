export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PRODUCTS: "/dashboard/products",
  CUSTOMERS: "/dashboard/customers",
  INVOICES: "/dashboard/invoices",
  EXPENSES: "/dashboard/expenses",
  REPORTS: "/dashboard/reports",
  SETTINGS: "/dashboard/settings",
};

export const SUBSCRIPTION_PLANS = {
  SMART_START: "Smart Start",
  BUSINESS_PRO: "Business Pro",
  GROWTH_MASTER: "Growth Master",
};

export const SUBSCRIPTION_PRICES = {
  [SUBSCRIPTION_PLANS.SMART_START]: 750,
  [SUBSCRIPTION_PLANS.BUSINESS_PRO]: 2000,
  [SUBSCRIPTION_PLANS.GROWTH_MASTER]: 4000,
};

export const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cheque", label: "Cheque" },
  { value: "mobile_payment", label: "Mobile Payment" },
];

export const EXPENSE_CATEGORIES = [
  "Office Supplies",
  "Travel",
  "Marketing",
  "Utilities",
  "Equipment",
  "Professional Services",
  "Inventory",
  "Maintenance",
  "Insurance",
  "Rent",
  "Telecommunications",
  "Software",
  "Training",
  "Legal",
  "Accounting",
  "Other",
];

export const CUSTOMER_TYPES = [
  { value: "individual", label: "Individual" },
  { value: "business", label: "Business" },
];

export const PRODUCT_UNITS = [
  "pieces",
  "kg",
  "g",
  "liters",
  "ml",
  "meters",
  "cm",
  "boxes",
  "packs",
  "bottles",
  "cans",
  "hours",
  "days",
  "units",
];

export const INVOICE_STATUSES = [
  { value: "draft", label: "Draft", color: "gray" },
  { value: "sent", label: "Sent", color: "blue" },
  { value: "paid", label: "Paid", color: "green" },
  { value: "overdue", label: "Overdue", color: "red" },
  { value: "cancelled", label: "Cancelled", color: "gray" },
];

export const BUSINESS_TYPES = [
  "Retail",
  "Wholesale",
  "Manufacturing",
  "Service",
  "Restaurant",
  "Grocery",
  "Fashion",
  "Electronics",
  "Pharmacy",
  "Automotive",
  "Construction",
  "Consulting",
  "Education",
  "Healthcare",
  "Real Estate",
  "Other",
];
