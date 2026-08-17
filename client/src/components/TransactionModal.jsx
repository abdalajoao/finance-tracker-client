import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { getCategories } from "../services/api";

function TransactionModal({
  isOpen,
  onClose,
  onAddTransaction,
  editingTransaction,
}) {
  // Stores the transaction title/description
  const [description, setDescription] = useState("");

  // Stores the transaction amount
  const [amount, setAmount] = useState("");

  // Stores the transaction type
  const [type, setType] = useState("expense");

  // Stores the selected category ID
  const [category, setCategory] = useState("");

  // Stores the transaction date
  const [date, setDate] = useState("");

  // Stores categories loaded from the backend
  const [categories, setCategories] = useState([]);

  // Stores validation or API errors
  const [error, setError] = useState("");

  // Controls the loading state while categories are being fetched
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Determines whether the modal is being used to edit a transaction
  const isEditing = Boolean(editingTransaction);

  // Loads categories from MongoDB when the modal opens
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        setError("");

        const data = await getCategories();

        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setError("Failed to load categories.");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, [isOpen]);

  // Loads the selected transaction data into the form when editing
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // If there is a transaction being edited, populate the form
    if (editingTransaction) {
      setDescription(
        editingTransaction.title ||
          editingTransaction.description ||
          ""
      );

      setAmount(String(editingTransaction.amount || ""));

      setType(editingTransaction.type || "expense");

      // Category can be either an ObjectId string or a populated object
      if (typeof editingTransaction.category === "object") {
        setCategory(editingTransaction.category?._id || "");
      } else {
        setCategory(editingTransaction.category || "");
      }

      // Convert the MongoDB date into the format required by input type="date"
      if (editingTransaction.date) {
        setDate(
          new Date(editingTransaction.date)
            .toISOString()
            .split("T")[0]
        );
      } else {
        setDate("");
      }

      setError("");
    } else {
      // If we are adding a new transaction, start with an empty form
      setDescription("");
      setAmount("");
      setType("expense");
      setCategory("");
      setDate("");
      setError("");
    }
  }, [isOpen, editingTransaction]);

  // Handles transaction form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    // Validate description
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    // Validate amount
    if (!amount.trim() || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    // Validate category
    if (!category) {
      setError("Please select a category.");
      return;
    }

    // Validate date
    if (!date) {
      setError("Please select a date.");
      return;
    }

    // Prepare transaction data
    const transaction = {
      description: description.trim(),
      amount: Number(amount),
      type,
      category,
      date,
    };

    // Send transaction data to the parent component
    onAddTransaction(transaction);
  };

  // Reset form fields
  const resetForm = () => {
    setDescription("");
    setAmount("");
    setType("expense");
    setCategory("");
    setDate("");
    setError("");
  };

  // Handle modal closing
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Do not render the modal when it is closed
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {isEditing ? "Edit Transaction" : "Add Transaction"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? "Update your transaction details."
                : "Add a new income or expense."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Error message */}
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <input
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="e.g. Grocery shopping"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Amount
            </label>

            <input
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Transaction type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Type
              </label>

              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category
              </label>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                disabled={isLoadingCategories}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                <option value="">
                  {isLoadingCategories
                    ? "Loading categories..."
                    : "Select a category"}
                </option>

                {categories.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Modal actions */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoadingCategories}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isEditing ? "Save Changes" : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionModal;