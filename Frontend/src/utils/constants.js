export const USER_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  STAFF: "staff",
};

export const INVOICE_STATUS = {
  DRAFT: "draft",
  SENT: "sent",
  PAID: "paid",
  OVERDUE: "overdue",
  CANCELLED: "cancelled",
};

export const PRODUCT_UNITS = [
  { value: "pieces", label: "Pieces" },
  { value: "kg", label: "Kilograms" },
  { value: "liters", label: "Liters" },
  { value: "meters", label: "Meters" },
];

export const SRI_LANKA_PROVINCES = [
  "Western",
  "Central",
  "Southern",
  "Northern",
  "Eastern",
  "North Western",
  "North Central",
  "Uva",
  "Sabaragamuwa",
];

export const EXPENSE_CATEGORIES = [
  "Office Supplies",
  "Marketing",
  "Travel",
  "Utilities",
  "Equipment",
  "Professional Services",
  "Inventory",
  "Maintenance",
  "Insurance",
  "Rent",
];

export const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Credit/Debit Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cheque", label: "Cheque" },
];
