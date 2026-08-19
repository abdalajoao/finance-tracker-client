import { useEffect, useState } from "react";

import { getCategories } from "../services/api";

import Modal from "./Modal";

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
  const [isLoadingCategories, setIsLoadingCategories] =
    useState(false);

  // Determines whether the modal is being used to edit
  const isEditing = Boolean(editingTransaction);

  // ==========================================
  // Load categories
  // ==========================================

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
        console.error(
          "Failed to load categories:",
          error
        );

        setError("Failed to load categories.");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, [isOpen]);

  // ==========================================
  // Load transaction data when editing
  // ==========================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (editingTransaction) {
      setDescription(
        editingTransaction.title ||
          editingTransaction.description ||
          ""
      );

      setAmount(
        String(editingTransaction.amount || "")
      );

      setType(
        editingTransaction.type || "expense"
      );

      // Category can be either an ID or populated object
      if (
        typeof editingTransaction.category === "object"
      ) {
        setCategory(
          editingTransaction.category?._id || ""
        );
      } else {
        setCategory(
          editingTransaction.category || ""
        );
      }

      // Convert MongoDB date to input date format
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
      // New transaction
      setDescription("");
      setAmount("");
      setType("expense");
      setCategory("");
      setDate("");
      setError("");
    }
  }, [isOpen, editingTransaction]);

  // ==========================================
  // Handle form submit
  // ==========================================

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    // Validate description
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    // Validate amount
    if (
      !amount.trim() ||
      Number(amount) <= 0
    ) {
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

    // Send transaction data to parent
    onAddTransaction(transaction);
  };

  // ==========================================
  // Reset form
  // ==========================================

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setType("expense");
    setCategory("");
    setDate("");
    setError("");
  };

  // ==========================================
  // Handle close
  // ==========================================

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        isEditing
          ? "Edit Transaction"
          : "Add Transaction"
      }
      maxWidth="max-w-lg"
    >

      {/* Modal subtitle */}

      <p className="mb-5 text-sm text-slate-500">
        {isEditing
          ? "Update your transaction details."
          : "Add a new income or expense."}
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

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
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="e.g. Description"
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
            onChange={(event) =>
              setAmount(event.target.value)
            }
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Type + Category */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          {/* Type */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Type
            </label>

            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="expense">
                Expense
              </option>

              <option value="income">
                Income
              </option>
            </select>
          </div>

          {/* Category */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              disabled={isLoadingCategories}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              <option value="">
                {isLoadingCategories
                  ? "Loading categories..."
                  : "Select a category"}
              </option>

              {categories.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
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
            onChange={(event) =>
              setDate(event.target.value)
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Actions */}

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
            {isEditing
              ? "Save Changes"
              : "Add Transaction"}
          </button>

        </div>

      </form>
    </Modal>
  );
}

export default TransactionModal;