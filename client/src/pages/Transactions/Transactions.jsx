import {
  ArrowDownRight,
  ArrowUpRight,
  Search,
  Plus,
  Filter,
  ArrowLeft,
  Trash2,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";


import Toast from "../../components/Toast";
import TransactionModal from "../../components/TransactionModal";
import ConfirmModal from "../../components/ConfirmModal";

import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../services/api";

function Transactions() {
  // Controls whether the Add Transaction modal is open
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Stores the text entered in the search field
  const [searchTerm, setSearchTerm] = useState("");

  // Stores the selected transaction type filter
  const [typeFilter, setTypeFilter] = useState("all");

  // Controls whether the filters panel is visible
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Available transaction type filters
  const types = ["all", "income", "expense"];

  // Stores the transaction currently being edited
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Main transactions data
  const [transactions, setTransactions] = useState([]);

  // Stores the transaction waiting for delete confirmation
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const [toast, setToast] = useState(null);

  // ==========================================
  // Load transactions
  // ==========================================

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await getTransactions();

        setTransactions(data);
      } catch (error) {
        console.error("Failed to load transactions:", error);

        setToast({
          message: "Failed to load transactions.",
          type: "error",
        });
      }
    };

    loadTransactions();
  }, []);

  // ==========================================
  // Create or update transaction
  // ==========================================

  const handleAddTransaction = async (transaction) => {
    try {
      // Prepare the data expected by the backend
      const transactionData = {
        title: transaction.description,
        amount: Number(transaction.amount),
        type: transaction.type,
        category: transaction.category,
        date: transaction.date,
      };

      // If a transaction is being edited, update it
      if (editingTransaction) {
        const updatedTransaction = await updateTransaction(
          editingTransaction._id,
          transactionData
        );

        // Replace the old transaction with the updated transaction
        setTransactions((previousTransactions) =>
          previousTransactions.map((item) =>
            item._id === editingTransaction._id
              ? updatedTransaction
              : item
          )
        );

        // Clear the editing state
        setEditingTransaction(null);

        // Close the modal
        setIsModalOpen(false);

        setToast({
          message: "Transaction updated successfully!",
          type: "success",
        });

        return;
      }

      // If there is no transaction being edited, create a new one
      const newTransaction = await createTransaction(transactionData);

      // Add the new transaction returned by MongoDB to the list
      setTransactions((previousTransactions) => [
        ...previousTransactions,
        newTransaction,
      ]);

      // Close the modal after successful creation
      setIsModalOpen(false);

      setToast({
        message: "Transaction created successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to save transaction:", error);

      setToast({
        message: "Failed to save transaction.",
        type: "error",
      });
    }
  };

  // ==========================================
  // Open delete confirmation
  // ==========================================

  const handleDeleteTransaction = (transactionId) => {
    const transactionToDelete = transactions.find(
      (transaction) => transaction._id === transactionId
    );

    if (!transactionToDelete) {
      return;
    }

    setTransactionToDelete(transactionToDelete);
  };

  // ==========================================
  // Confirm delete transaction
  // ==========================================

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) {
      return;
    }

    try {
      // Delete the transaction from MongoDB
      await deleteTransaction(transactionToDelete._id);

      // Remove the deleted transaction from local state
      setTransactions((previousTransactions) =>
        previousTransactions.filter(
          (transaction) =>
            transaction._id !== transactionToDelete._id
        )
      );

      // Close the confirmation modal
      setTransactionToDelete(null);

      setToast({
        message: "Transaction deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to delete transaction:", error);

      setToast({
        message: "Failed to delete transaction.",
        type: "error",
      });
    }
  };

  // ==========================================
  // Close delete confirmation
  // ==========================================

  const handleCloseDeleteModal = () => {
    setTransactionToDelete(null);
  };

  // ==========================================
  // Reset filters
  // ==========================================

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
  };

  // ==========================================
  // Filter transactions
  // ==========================================

  const filteredTransactions = transactions.filter((transaction) => {
    // Get the category name when the category was populated by MongoDB
    const categoryName =
      typeof transaction.category === "object"
        ? transaction.category?.name
        : transaction.category;

    // Get the transaction title from the backend
    const transactionTitle =
      transaction.title || transaction.description || "";

    // Checks if the search matches the title or category
    const searchMatches =
      String(transactionTitle)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(categoryName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Checks if the selected type matches the transaction type
    const typeMatches =
      typeFilter === "all" ||
      transaction.type === typeFilter;

    // Transaction must match both conditions
    return searchMatches && typeMatches;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-5 lg:p-6">

      {/* ==========================================
          Page Header
      ========================================== */}

      <div className="mb-8">
        <Link
          to="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Finance
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Transactions
            </h1>

            <p className="mt-2 text-slate-500">
              Manage and track all your financial transactions.
            </p>
          </div>

          {/* Opens the Add Transaction modal */}
          <button
            onClick={() => {
              setEditingTransaction(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={20} />
            Add Transaction
          </button>
        </div>
      </div>

      {/* ==========================================
          Search and Filters Section
      ========================================== */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">

          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Filters Toggle Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        {isFilterOpen && (
          <div className="mt-4 border-t border-slate-200 pt-4">
            <p className="mb-3 text-sm font-semibold text-slate-700">
              Filter by type
            </p>

            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    typeFilter === type
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {type === "all"
                    ? "All"
                    : type === "income"
                    ? "Income"
                    : "Expense"}
                </button>
              ))}
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={handleClearFilters}
              className="mt-3 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* ==========================================
          Transactions List
      ========================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {filteredTransactions.length === 0 ? (

          /* Empty State */
          <div className="px-6 py-16 text-center">
            <p className="text-lg font-semibold text-slate-900">
              No transactions found
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Try adjusting your search or filters.
            </p>
          </div>

        ) : (
          <>
            {/* ==========================================
                Desktop Transactions Table
            ========================================== */}

            <div className="hidden md:block">

              <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <div className="col-span-3">
                  Transaction
                </div>

                <div className="col-span-2">
                  Category
                </div>

                <div className="col-span-2">
                  Date
                </div>

                <div className="col-span-3 text-right">
                  Amount
                </div>

                <div className="col-span-2 text-right">
                  Actions
                </div>
              </div>

              {filteredTransactions.map((transaction) => {
                const isIncome =
                  transaction.type === "income";

                const transactionTitle =
                  transaction.title ||
                  transaction.description ||
                  "";

                const categoryName =
                  typeof transaction.category === "object"
                    ? transaction.category?.name
                    : transaction.category;

                return (
                  <div
                    key={transaction._id || transaction.id}
                    className="grid grid-cols-12 items-center border-b border-slate-100 px-6 py-5 last:border-b-0 hover:bg-slate-50"
                  >

                    {/* Transaction */}
                    <div className="col-span-3 flex items-center gap-3">
                      <div
                        className={`rounded-lg p-2 ${
                          isIncome
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUpRight size={18} />
                        ) : (
                          <ArrowDownRight size={18} />
                        )}
                      </div>

                      <span className="font-medium text-slate-900">
                        {transactionTitle}
                      </span>
                    </div>

                    {/* Category */}
                    <div className="col-span-2 text-sm text-slate-500">
                      {categoryName}
                    </div>

                    {/* Date */}
                    <div className="col-span-2 text-sm text-slate-500">
                      {transaction.date
                        ? new Date(
                            transaction.date
                          ).toLocaleDateString()
                        : "-"}
                    </div>

                    {/* Amount */}
                    <div
                      className={`col-span-3 text-right font-semibold ${
                        isIncome
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {isIncome ? "+" : "-"}€
                      {Number(transaction.amount).toFixed(2)}
                    </div>

                    {/* Transaction Actions */}
                    <div className="col-span-2 flex items-center justify-end gap-4">

                      {/* Edit Transaction */}
                      <button
                        onClick={() => {
                          setEditingTransaction(transaction);
                          setIsModalOpen(true);
                        }}
                        className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
                      >
                        Edit
                      </button>

                      {/* Delete Transaction */}
                      <button
                        onClick={() =>
                          handleDeleteTransaction(
                            transaction._id
                          )
                        }
                        className="text-red-500 transition hover:text-red-700"
                        title="Delete transaction"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* ==========================================
                Mobile Transactions List
            ========================================== */}

            <div className="divide-y divide-slate-100 md:hidden">

              {filteredTransactions.map((transaction) => {
                const isIncome =
                  transaction.type === "income";

                const transactionTitle =
                  transaction.title ||
                  transaction.description ||
                  "";

                const categoryName =
                  typeof transaction.category === "object"
                    ? transaction.category?.name
                    : transaction.category;

                return (
                  <div
                    key={transaction._id || transaction.id}
                    className="p-5"
                  >
                    <div className="flex items-center justify-between gap-4">

                      <div className="flex min-w-0 items-center gap-3">

                        <div
                          className={`rounded-lg p-2 ${
                            isIncome
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpRight size={18} />
                          ) : (
                            <ArrowDownRight size={18} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">
                            {transactionTitle}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {categoryName} •{" "}
                            {transaction.date
                              ? new Date(
                                  transaction.date
                                ).toLocaleDateString()
                              : "-"}
                          </p>
                        </div>

                      </div>

                      <div className="flex flex-col items-end gap-2">

                        <span
                          className={`whitespace-nowrap text-sm font-semibold ${
                            isIncome
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {isIncome ? "+" : "-"}€
                          {Number(transaction.amount).toFixed(2)}
                        </span>

                        {/* Transaction Actions */}
                        <div className="flex items-center gap-3">

                          {/* Edit Transaction */}
                          <button
                            onClick={() => {
                              setEditingTransaction(
                                transaction
                              );

                              setIsModalOpen(true);
                            }}
                            className="text-xs font-medium text-blue-600 transition hover:text-blue-700"
                          >
                            Edit
                          </button>

                          {/* Delete Transaction */}
                          <button
                            onClick={() =>
                              handleDeleteTransaction(
                                transaction._id
                              )
                            }
                            className="text-red-500 transition hover:text-red-700"
                            title="Delete transaction"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {toast && (
        <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
      )}

      {/* ==========================================
          Add / Edit Transaction Modal
      ========================================== */}

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onAddTransaction={handleAddTransaction}
        editingTransaction={editingTransaction}
      />

      {/* ==========================================
          Delete Confirmation Modal
      ========================================== */}

      <ConfirmModal
        isOpen={Boolean(transactionToDelete)}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction?"
        message={
          transactionToDelete
            ? `Are you sure you want to delete "${transactionToDelete.title || transactionToDelete.description}"?`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
      />

    </div>
  );
}

export default Transactions;