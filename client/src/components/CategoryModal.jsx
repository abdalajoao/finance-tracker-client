import { useEffect, useState } from "react";
import { X } from "lucide-react";

function CategoryModal({
  isOpen,
  onClose,
  category,
  onCategorySubmit,
}) {
  // Stores the category name entered by the user
  const [name, setName] = useState("");

  // Stores the category type
  const [type, setType] = useState("expense");

  // Determines whether the modal is in edit mode
  const isEditMode = Boolean(category);

  // Loads the selected category data when editing
  useEffect(() => {
    if (category) {
      setName(category.name);
      setType(category.type);
    } else {
      setName("");
      setType("expense");
    }
  }, [category]);

  // Handles form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prevents submitting an empty category name
    if (!name.trim()) {
      return;
    }

    const categoryData = {
      name: name.trim(),
      type,
    };

    try {
      await onCategorySubmit(categoryData);

      // Clear the form after successful submission
      setName("");
      setType("expense");

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  // Do not render the modal when it is closed
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Modal header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            {isEditMode ? "Edit Category" : "Add Category"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Category name */}
          <div className="mb-5">
            <label
              htmlFor="category-name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Category Name
            </label>

            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Food"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
            />
          </div>

          {/* Category type */}
          <div className="mb-6">
            <label
              htmlFor="category-type"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Type
            </label>

            <select
              id="category-type"
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Modal actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              {isEditMode ? "Save Changes" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryModal;