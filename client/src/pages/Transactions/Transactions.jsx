import {
  ArrowDownRight,
  ArrowUpRight,
  Search,
  Plus,
  Filter,
  ArrowLeft,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useState } from "react";
import TransactionModal from "../../components/TransactionModal";

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

  // Main transactions data
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      description: "Salary",
      category: "Income",
      date: "Aug 10, 2026",
      amount: 3200,
      type: "income",
    },
    {
      id: 2,
      description: "Supermarket",
      category: "Food",
      date: "Aug 9, 2026",
      amount: 85.5,
      type: "expense",
    },
    {
      id: 3,
      description: "Netflix",
      category: "Entertainment",
      date: "Aug 8, 2026",
      amount: 15.99,
      type: "expense",
    },
    {
      id: 4,
      description: "Freelance Project",
      category: "Income",
      date: "Aug 7, 2026",
      amount: 450,
      type: "income",
    },
    {
      id: 5,
      description: "Restaurant",
      category: "Food",
      date: "Aug 6, 2026",
      amount: 42.5,
      type: "expense",
    },
    {
      id: 6,
      description: "Uber",
      category: "Transport",
      date: "Aug 5, 2026",
      amount: 18.75,
      type: "expense",
    },
  ]);

  // Adds a new transaction to the transactions array
  const handleAddTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now(),
      ...transaction,
    };

    setTransactions((previousTransactions) => [
      ...previousTransactions,
      newTransaction,
    ]);

    setIsModalOpen(false);
  };

  // Filters transactions based on search text and transaction type
  const filteredTransactions = transactions.filter((transaction) => {
    // Checks if the search matches the description or category
    const searchMatches =
      String(transaction.description)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(transaction.category)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Checks if the selected type matches the transaction type
    // "all" allows every transaction type to pass
    const typeMatches =
      typeFilter === "all" ||
      transaction.type === typeFilter;

    // Transaction must match both conditions
    return searchMatches && typeMatches;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-5 lg:p-6">
      {/* Page Header */}
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
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={20} />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Search and Filters Section */}
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
              onChange={(event) => setSearchTerm(event.target.value)}
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
          </div>
        )}
      </div>

      {/* Transactions List */}
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
            {/* Desktop Transactions Table */}
            <div className="hidden md:block">
              <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <div className="col-span-4">Transaction</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-3">Date</div>
                <div className="col-span-3 text-right">Amount</div>
              </div>

              {filteredTransactions.map((transaction) => {
                const isIncome = transaction.type === "income";

                return (
                  <div
                    key={transaction.id}
                    className="grid grid-cols-12 items-center border-b border-slate-100 px-6 py-5 last:border-b-0 hover:bg-slate-50"
                  >
                    <div className="col-span-4 flex items-center gap-3">
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
                        {transaction.description}
                      </span>
                    </div>

                    <div className="col-span-2 text-sm text-slate-500">
                      {transaction.category}
                    </div>

                    <div className="col-span-3 text-sm text-slate-500">
                      {transaction.date}
                    </div>

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
                  </div>
                );
              })}
            </div>

            {/* Mobile Transactions List */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredTransactions.map((transaction) => {
                const isIncome = transaction.type === "income";

                return (
                  <div key={transaction.id} className="p-5">
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
                            {transaction.description}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {transaction.category} • {transaction.date}
                          </p>
                        </div>
                      </div>

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
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Add Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
}

export default Transactions;