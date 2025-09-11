import React, { useState } from "react";
import { useQuery } from "react-query";
import { Menu, Plus, Search, Filter, AlertTriangle } from "lucide-react";
import Sidebar from "../components/common/Sidebar";
import InvoiceList from "../components/invoices/InvoiceList";
import InvoiceForm from "../components/invoices/InvoiceForm";
import OverdueInvoices from "../components/invoices/OverdueInvoices";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import { invoiceService } from "../services/invoiceService";
import { useDebounce } from "../hooks/useDebounce";

function InvoicesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 300);

  const {
    data: invoices,
    isLoading,
    refetch,
  } = useQuery(
    ["invoices", { search: debouncedSearch, status: selectedStatus }],
    () =>
      invoiceService.getInvoices({
        search: debouncedSearch,
        status: selectedStatus,
      }),
    {
      keepPreviousData: true,
    }
  );

  const { data: overdueInvoices } = useQuery(
    "overdue-invoices",
    invoiceService.getOverdueInvoices
  );

  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setShowInvoiceForm(true);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceForm(true);
  };

  const handleFormClose = () => {
    setShowInvoiceForm(false);
    setEditingInvoice(null);
    refetch();
  };

  const invoiceStatuses = [
    "All Status",
    "draft",
    "sent",
    "paid",
    "overdue",
    "cancelled",
  ];

  const getStatusLabel = (status) => {
    const labels = {
      "All Status": "All Status",
      draft: "Draft",
      sent: "Sent",
      paid: "Paid",
      overdue: "Overdue",
      cancelled: "Cancelled",
    };
    return labels[status] || status;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
                <p className="text-gray-600">
                  Create, send, and track your invoices with AI-powered insights
                </p>
              </div>
            </div>
            <Button
              onClick={handleCreateInvoice}
              className="flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Invoice</span>
            </Button>
          </div>
        </header>

        {/* Overdue Invoices Alert */}
        {overdueInvoices?.data?.length > 0 && (
          <div className="px-6 py-4">
            <OverdueInvoices invoices={overdueInvoices.data} />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(
                    e.target.value === "All Status" ? "" : e.target.value
                  )
                }
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {invoiceStatuses.map((status) => (
                  <option key={status} value={status}>
                    {getStatusLabel(status)}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <InvoiceList
            invoices={invoices?.data || []}
            isLoading={isLoading}
            onEdit={handleEditInvoice}
            onRefresh={refetch}
          />
        </main>
      </div>

      {/* Invoice Form Modal */}
      <Modal
        isOpen={showInvoiceForm}
        onClose={handleFormClose}
        title={editingInvoice ? "Edit Invoice" : "Create New Invoice"}
        size="xl"
      >
        <InvoiceForm
          invoice={editingInvoice}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />
      </Modal>
    </div>
  );
}

export default InvoicesPage;
