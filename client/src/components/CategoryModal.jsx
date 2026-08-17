import { useEffect, useState } from "react";
import {
  X,
  Utensils,
  Car,
  Home,
  ShoppingCart,
  Gamepad2,
  HeartPulse,
  Lightbulb,
  GraduationCap,
  Wallet,
  Briefcase,
  TrendingUp,
  Gift,
  Tag,
} from "lucide-react";

const iconOptions = [
  { name: "Utensils", label: "Food", component: Utensils },
  { name: "Car", label: "Transport", component: Car },
  { name: "Home", label: "Housing", component: Home },
  { name: "ShoppingCart", label: "Shopping", component: ShoppingCart },
  { name: "Gamepad2", label: "Entertainment", component: Gamepad2 },
  { name: "HeartPulse", label: "Health", component: HeartPulse },
  { name: "Lightbulb", label: "Bills", component: Lightbulb },
  {
    name: "GraduationCap",
    label: "Education",
    component: GraduationCap,
  },
  { name: "Wallet", label: "Salary", component: Wallet },
  { name: "Briefcase", label: "Freelance", component: Briefcase },
  { name: "TrendingUp", label: "Investments", component: TrendingUp },
  { name: "Gift", label: "Other Income", component: Gift },
  { name: "Tag", label: "Other", component: Tag },
];

const colorOptions = [
  {
    name: "blue",
    className: "bg-blue-500",
  },
  {
    name: "green",
    className: "bg-green-500",
  },
  {
    name: "orange",
    className: "bg-orange-500",
  },
  {
    name: "purple",
    className: "bg-purple-500",
  },
  {
    name: "pink",
    className: "bg-pink-500",
  },
  {
    name: "red",
    className: "bg-red-500",
  },
  {
    name: "yellow",
    className: "bg-yellow-500",
  },
  {
    name: "indigo",
    className: "bg-indigo-500",
  },
  {
    name: "cyan",
    className: "bg-cyan-500",
  },
  {
    name: "slate",
    className: "bg-slate-500",
  },
];

function CategoryModal({
  isOpen,
  onClose,
  category,
  onCategorySubmit,
}) {
  // Category name
  const [name, setName] = useState("");

  // Category type
  const [type, setType] = useState("expense");

  // Category icon
  const [icon, setIcon] = useState("Tag");

  // Category color
  const [color, setColor] = useState("blue");

  // Determines whether the modal is in edit mode
  const isEditMode = Boolean(category);

  // Load category data when editing
  useEffect(() => {
    if (category) {
      setName(category.name);
      setType(category.type);
      setIcon(category.icon || "Tag");
      setColor(category.color || "blue");
    } else {
      setName("");
      setType("expense");
      setIcon("Tag");
      setColor("blue");
    }
  }, [category]);

  // Handles form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    const categoryData = {
      name: name.trim(),
      type,
      icon,
      color,
    };

    try {
      await onCategorySubmit(categoryData);

      // Clear form after successful submission
      setName("");
      setType("expense");
      setIcon("Tag");
      setColor("blue");

      // Close modal
      onClose();
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  // Do not render when closed
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
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
              required
            />
          </div>

          {/* Category type */}
          <div className="mb-5">
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

          {/* Icon selection */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Icon
            </label>

            <div className="grid grid-cols-6 gap-2">
              {iconOptions.map((option) => {
                const Icon = option.component;
                const isSelected = icon === option.name;

                return (
                  <button
                    key={option.name}
                    type="button"
                    title={option.label}
                    onClick={() => setIcon(option.name)}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 text-blue-600 ring-2 ring-blue-200"
                        : "border-slate-200 text-slate-500 hover:border-blue-300 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={20} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color selection */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Color
            </label>

            <div className="flex flex-wrap gap-3">
              {colorOptions.map((option) => {
                const isSelected = color === option.name;

                return (
                  <button
                    key={option.name}
                    type="button"
                    title={option.name}
                    onClick={() => setColor(option.name)}
                    className={`h-8 w-8 rounded-full ${option.className} transition ${
                      isSelected
                        ? "ring-2 ring-offset-2 ring-slate-500"
                        : "hover:scale-110"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">
              Preview
            </p>

            <div className="flex items-center gap-3">
              {(() => {
                const selectedIcon = iconOptions.find(
                  (option) => option.name === icon
                );

                const PreviewIcon =
                  selectedIcon?.component || Tag;

                const selectedColor = colorOptions.find(
                  (option) => option.name === color
                );

                return (
                  <>
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        selectedColor?.className || "bg-blue-500"
                      } text-white`}
                    >
                      <PreviewIcon size={21} />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        {name || "Category Name"}
                      </p>

                      <p className="text-sm capitalize text-slate-500">
                        {type}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
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