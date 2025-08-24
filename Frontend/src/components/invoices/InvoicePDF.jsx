import React from "react";

const InvoicePDF = ({ invoice }) => {
  const generatePDF = () => {
    window.print();
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">LankaGrow</h1>
            <p className="text-gray-600">AI-Powered Business Management</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
            <p className="text-gray-600">#{invoice.invoiceNumber}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
          <div className="text-gray-700">
            <p className="font-medium">{invoice.customer?.name}</p>
            <p>{invoice.customer?.email}</p>
            <p>{invoice.customer?.phone}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Invoice Details:</h3>
          <div className="text-gray-700">
            <p>
              <span className="font-medium">Date:</span>{" "}
              {new Date(invoice.createdAt).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Due Date:</span>{" "}
              {new Date(invoice.dueDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              <span className="capitalize">{invoice.status}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Description
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right">
                Qty
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right">
                Unit Price
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items?.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">
                  {item.productName}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {item.quantity}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  LKR {item.unitPrice.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span>Subtotal:</span>
            <span>LKR {invoice.subtotal?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Tax:</span>
            <span>LKR {invoice.taxAmount?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 border-t font-bold text-lg">
            <span>Total:</span>
            <span>LKR {invoice.totalAmount?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <button
        onClick={generatePDF}
        className="mt-8 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Download PDF
      </button>
    </div>
  );
};

export default InvoicePDF;
