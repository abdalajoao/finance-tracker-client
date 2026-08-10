import {
  Plus,
  Tag,
  MoreVertical,
  ShoppingCart,
  Car,
  Home,
  Utensils,
  Gamepad2,
  Briefcase,
  ArrowLeft,
} from "lucide-react";

import { Link } from "react-router-dom";

function Categories() {
  const categories = [
    {
      id: 1,
      name: "Food",
      description: "Restaurants, groceries and meals",
      color: "bg-orange-50 text-orange-600",
      icon: Utensils,
      transactions: 12,
      amount: "€285.50",
    },
    {
      id: 2,
      name: "Transport",
      description: "Uber, fuel and public transport",
      color: "bg-blue-50 text-blue-600",
      icon: Car,
      transactions: 8,
      amount: "€142.75",
    },
    {
      id: 3,
      name: "Shopping",
      description: "Clothes, electronics and other purchases",
      color: "bg-purple-50 text-purple-600",
      icon: ShoppingCart,
      transactions: 6,
      amount: "€320.90",
    },
    {
      id: 4,
      name: "Housing",
      description: "Rent, utilities and home expenses",
      color: "bg-emerald-50 text-emerald-600",
      icon: Home,
      transactions: 4,
      amount: "€950.00",
    },
    {
      id: 5,
      name: "Entertainment",
      description: "Movies, games and subscriptions",
      color: "bg-pink-50 text-pink-600",
      icon: Gamepad2,
      transactions: 5,
      amount: "€85.99",
    },
    {
      id: 6,
      name: "Work",
      description: "Professional and business expenses",
      color: "bg-slate-100 text-slate-600",
      icon: Briefcase,
      transactions: 3,
      amount: "€120.00",
    },
  ];

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

          <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700">
            <Plus size={20} />
            Add Category
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <div
              key={category.id}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`rounded-xl p-3 ${category.color}`}
                >
                  <Icon size={22} />
                </div>

                <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="mt-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  {category.name}
                </h2>

                <p className="mt-1 min-h-[40px] text-sm text-slate-500">
                  {category.description}
                </p>
              </div>

              <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-5">
                <div>
                  <p className="text-xs text-slate-400">
                    Transactions
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {category.transactions}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400">
                    Total spent
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {category.amount}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Tag size={22} />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          Manage your categories
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Create and organize categories to keep your financial
          transactions easy to understand.
        </p>
      </div>
    </div>
  );
}

export default Categories;