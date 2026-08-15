import {
  Plus,
  Tag,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/api";

import CategoryModal from "../../components/CategoryModal";

function Categories() {
  // Stores categories loaded from the backend
  const [categories, setCategories] = useState([]);

  // Controls whether the category modal is open
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Stores the category currently being edited
  const [editingCategory, setEditingCategory] = useState(null);

  // Stores the category whose action menu is currently open
  const [openMenuId, setOpenMenuId] = useState(null);

  // Loads categories from the backend when the page opens
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

  // Opens the modal for creating a new category
  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  // Opens the modal for editing an existing category
  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  // Creates a new category
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

  // Updates an existing category
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

  // Deletes an existing category
  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);

      setCategories((previousCategories) =>
        previousCategories.filter(
          (category) => category._id !== categoryId
        )
      );
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  // Handles category creation or update
  const handleCategorySubmit = async (category) => {
    if (editingCategory) {
      await handleUpdateCategory(category);
    } else {
      await handleCreateCategory(category);
    }
  };

  // Closes the modal and clears edit mode
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-5 lg:p-6">
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          return (
            <div
              key={category._id}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* Category header */}
              <div className="flex items-start justify-between">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Tag size={22} />
                </div>

                {/* Category action menu */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === category._id
                          ? null
                          : category._id
                      )
                    }
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {openMenuId === category._id && (
                    <div className="absolute right-0 top-11 z-10 w-32 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                      {/* Edit category */}
                      <button
                        type="button"
                        onClick={() => {
                          handleOpenEditModal(category);
                          setOpenMenuId(null);
                        }}
                        className="block w-full px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        Edit
                      </button>

                      {/* Delete category */}
                      <button
                        type="button"
                        onClick={() => {
                          handleDeleteCategory(category._id);
                          setOpenMenuId(null);
                        }}
                        className="block w-full px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Category information */}
              <div className="mt-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  {category.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Type: {category.type}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category creation/edit modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
        onCategorySubmit={handleCategorySubmit}
      />
    </div>
  );
}

export default Categories;