import {
  Plus,
  Tag,
  MoreVertical,
  ArrowLeft,
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
  Pencil,
  Trash2,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/api";

import CategoryModal from "../../components/CategoryModal";
import ConfirmModal from "../../components/ConfirmModal";

// ==========================================
// Icon mapping
// ==========================================

const iconMap = {
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
};

// ==========================================
// Color mapping
// ==========================================

const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  orange: "bg-orange-50 text-orange-600",
  purple: "bg-purple-50 text-purple-600",
  pink: "bg-pink-50 text-pink-600",
  red: "bg-red-50 text-red-600",
  yellow: "bg-yellow-50 text-yellow-600",
  indigo: "bg-indigo-50 text-indigo-600",
  cyan: "bg-cyan-50 text-cyan-600",
  slate: "bg-slate-100 text-slate-600",
  emerald: "bg-emerald-50 text-emerald-600",
  rose: "bg-rose-50 text-rose-600",
};

function Categories() {
  // ==========================================
  // State
  // ==========================================

  const [categories, setCategories] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);

  // Controls which three-dot menu is open
  const [openMenuId, setOpenMenuId] = useState(null);

  // Category waiting for delete confirmation
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Reference to the currently open three-dot menu
  const menuRef = useRef(null);

  // ==========================================
  // Load categories
  // ==========================================

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();

        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadCategories();
  }, []);

  // ==========================================
  // Close three-dot menu when clicking outside
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ==========================================
  // Open create modal
  // ==========================================

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setOpenMenuId(null);
    setIsModalOpen(true);
  };

  // ==========================================
  // Open edit modal
  // ==========================================

  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setOpenMenuId(null);
    setIsModalOpen(true);
  };

  // ==========================================
  // Create category
  // ==========================================

  const handleCreateCategory = async (category) => {
    try {
      const newCategory = await createCategory(category);

      setCategories((previousCategories) => [
        ...previousCategories,
        newCategory,
      ]);
    } catch (error) {
      console.error("Failed to create category:", error);

      throw error;
    }
  };

  // ==========================================
  // Update category
  // ==========================================

  const handleUpdateCategory = async (category) => {
    try {
      const updatedCategory = await updateCategory(
        editingCategory._id,
        category
      );

      setCategories((previousCategories) =>
        previousCategories.map((item) =>
          item._id === updatedCategory._id
            ? updatedCategory
            : item
        )
      );

      setEditingCategory(null);
    } catch (error) {
      console.error("Failed to update category:", error);

      throw error;
    }
  };

  // ==========================================
  // Open delete confirmation
  // ==========================================

  const handleDeleteCategory = (categoryId) => {
    const categoryToDelete = categories.find(
      (category) => category._id === categoryId
    );

    if (!categoryToDelete) {
      return;
    }

    setCategoryToDelete(categoryToDelete);
    setOpenMenuId(null);
  };

  // ==========================================
  // Confirm delete category
  // ==========================================

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) {
      return;
    }

    try {
      await deleteCategory(categoryToDelete._id);

      setCategories((previousCategories) =>
        previousCategories.filter(
          (category) =>
            category._id !== categoryToDelete._id
        )
      );

      setCategoryToDelete(null);
    } catch (error) {
      console.error("Failed to delete category:", error);

      alert(
        "Failed to delete category. Please try again."
      );
    }
  };

  // ==========================================
  // Create or update category
  // ==========================================

  const handleCategorySubmit = async (category) => {
    if (editingCategory) {
      await handleUpdateCategory(category);
    } else {
      await handleCreateCategory(category);
    }
  };

  // ==========================================
  // Close category modal
  // ==========================================

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  // ==========================================
  // Close delete confirmation
  // ==========================================

  const handleCloseDeleteModal = () => {
    setCategoryToDelete(null);
  };

  // ==========================================
  // Toggle three-dot menu
  // ==========================================

  const handleToggleMenu = (categoryId) => {
    setOpenMenuId((currentId) =>
      currentId === categoryId ? null : categoryId
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-5 lg:p-6">

      {/* ==========================================
          Header
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
              Organization
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Categories
            </h1>

            <p className="mt-2 text-slate-500">
              Organize your transactions into categories.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={20} />
            Add Category
          </button>

        </div>
      </div>

      {/* ==========================================
          Categories
      ========================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

        {categories.map((category) => {

          const Icon =
            iconMap[category.icon] || Tag;

          const iconColor =
            colorMap[category.color] ||
            colorMap.blue;

          const isMenuOpen =
            openMenuId === category._id;

          return (
            <div
              key={category._id}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              {/* Card Header */}

              <div className="flex items-start justify-between">

                <div
                  className={`rounded-xl p-3 ${iconColor}`}
                >
                  <Icon size={22} />
                </div>

                {/* Three dots menu */}

                <div
                  ref={isMenuOpen ? menuRef : null}
                  className="relative"
                >

                  <button
                    type="button"
                    onClick={() =>
                      handleToggleMenu(category._id)
                    }
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Category options"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {/* Dropdown */}

                  {isMenuOpen && (
                    <div className="absolute right-0 top-11 z-20 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">

                      {/* Edit */}

                      <button
                        type="button"
                        onClick={() =>
                          handleOpenEditModal(category)
                        }
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      {/* Delete */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteCategory(category._id)
                        }
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>

                    </div>
                  )}

                </div>

              </div>

              {/* Category Information */}

              <div className="mt-5">

                <h2 className="text-lg font-semibold text-slate-900">
                  {category.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Type:{" "}
                  <span className="capitalize">
                    {category.type}
                  </span>
                </p>

              </div>

            </div>
          );
        })}

      </div>

      {/* ==========================================
          Category Modal
      ========================================== */}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
        onCategorySubmit={handleCategorySubmit}
      />

      {/* ==========================================
          Delete Confirmation Modal
      ========================================== */}

      <ConfirmModal
        isOpen={Boolean(categoryToDelete)}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Category?"
        message={
          categoryToDelete
            ? `Are you sure you want to delete "${categoryToDelete.name}"?`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
      />

    </div>
  );
}

export default Categories;