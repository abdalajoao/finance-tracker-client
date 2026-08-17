import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import SummaryCard from "../../components/SummaryCard";

import { getTransactions } from "../../services/api";

function Dashboard() {
  // Stores all transactions loaded from the backend
  const [transactions, setTransactions] = useState([]);

  // Controls the loading state
  const [isLoading, setIsLoading] = useState(true);

  // Stores an error message if loading transactions fails
  const [error, setError] = useState("");

  // Loads transactions from the backend when the Dashboard opens
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getTransactions();

        setTransactions(data);
      } catch (error) {
        console.error("Failed to load dashboard transactions:", error);

        setError(
          "Unable to load your transactions. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // Gets the current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Checks whether a transaction belongs to the current month
  const isCurrentMonth = (transaction) => {
    if (!transaction.date) {
      return false;
    }

    const transactionDate = new Date(transaction.date);

    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  };

  // Transactions from the current month
  const currentMonthTransactions = transactions.filter(
    isCurrentMonth
  );

  // Calculate total income for the current month
  const totalIncome = currentMonthTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  // Calculate total expenses for the current month
  const totalExpenses = currentMonthTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  // Calculate the current balance
  // Income increases the balance and expenses decrease it
  const totalBalance = transactions.reduce(
    (balance, transaction) => {
      const amount = Number(transaction.amount || 0);

      if (transaction.type === "income") {
        return balance + amount;
      }

      return balance - amount;
    },
    0
  );

  // Sort transactions from newest to oldest
  const sortedTransactions = [...transactions].sort(
    (a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();

      return dateB - dateA;
    }
  );

  // Show the four most recent transactions
  const recentTransactions = sortedTransactions.slice(0, 4);

  // Format money values as Euros
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  // Format transaction dates
  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get the category name whether category is populated or just an ID
  const getCategoryName = (category) => {
    if (!category) {
      return "Uncategorized";
    }

    if (typeof category === "object") {
      return category.name || "Uncategorized";
    }

    return category;
  };

  /*
   * Prepare data for the Financial Overview chart.
   *
   * We use the six most recent transactions and scale their
   * amounts into the same visual bar structure that already
   * exists in the Dashboard design.
   */
  const chartTransactions = sortedTransactions.slice(0, 6);

  const chartMaximum = Math.max(
    ...chartTransactions.map((transaction) =>
      Number(transaction.amount || 0)
    ),
    1
  );

  const getChartHeight = (amount) => {
    const percentage =
      (Number(amount || 0) / chartMaximum) * 100;

    // Keep bars between 20% and 85% of the chart height
    return Math.max(20, Math.min(85, percentage));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600">
          Overview
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Welcome back! Here's an overview of your finances.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Total Balance"
          value={
            isLoading
              ? "Loading..."
              : formatCurrency(totalBalance)
          }
          description="Available balance"
          icon={Wallet}
        />

        <SummaryCard
          title="Total Income"
          value={
            isLoading
              ? "Loading..."
              : formatCurrency(totalIncome)
          }
          description="This month"
          icon={TrendingUp}
        />

        <SummaryCard
          title="Total Expenses"
          value={
            isLoading
              ? "Loading..."
              : formatCurrency(totalExpenses)
          }
          description="This month"
          icon={TrendingDown}
        />
      </div>

      {/* Main Content */}
      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Financial Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Financial Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Income and expenses this month
              </p>
            </div>

            <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">
              This month
            </span>
          </div>

          {/* Financial Overview Chart */}
          <div className="mt-8 flex h-64 items-end justify-around gap-4 rounded-xl bg-slate-50 p-6">
            {isLoading ? (
              <>
                <div className="flex h-full w-10 items-end">
                  <div className="h-24 w-10 animate-pulse rounded-t-lg bg-slate-200" />
                </div>

                <div className="flex h-full w-10 items-end">
                  <div className="h-32 w-10 animate-pulse rounded-t-lg bg-slate-200" />
                </div>

                <div className="flex h-full w-10 items-end">
                  <div className="h-20 w-10 animate-pulse rounded-t-lg bg-slate-200" />
                </div>

                <div className="flex h-full w-10 items-end">
                  <div className="h-40 w-10 animate-pulse rounded-t-lg bg-slate-200" />
                </div>

                <div className="flex h-full w-10 items-end">
                  <div className="h-28 w-10 animate-pulse rounded-t-lg bg-slate-200" />
                </div>

                <div className="flex h-full w-10 items-end">
                  <div className="h-36 w-10 animate-pulse rounded-t-lg bg-slate-200" />
                </div>
              </>
            ) : chartTransactions.length === 0 ? (
              <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                No transaction data available
              </div>
            ) : (
              chartTransactions.map((transaction) => {
                const barHeight = getChartHeight(
                  transaction.amount
                );

                return (
                  <div
                    key={transaction._id}
                    className="flex h-full w-10 items-end"
                  >
                    <div
                      className="w-10 rounded-t-lg bg-blue-500 transition-all duration-500"
                      style={{
                        height: `${barHeight}%`,
                      }}
                      title={`${transaction.title || transaction.description} - ${formatCurrency(
                        Number(transaction.amount || 0)
                      )}`}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Transactions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest activity
              </p>
            </div>

            <Link
              to="/transactions"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {isLoading ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-100" />

                  <div className="flex-1">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />

                    <div className="mt-2 h-3 w-32 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-100" />

                  <div className="flex-1">
                    <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />

                    <div className="mt-2 h-3 w-36 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-100" />

                  <div className="flex-1">
                    <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />

                    <div className="mt-2 h-3 w-32 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
              </>
            ) : recentTransactions.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm font-medium text-slate-600">
                  No transactions yet
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Add your first transaction to see it here.
                </p>
              </div>
            ) : (
              recentTransactions.map((transaction) => {
                const isIncome =
                  transaction.type === "income";

                const transactionTitle =
                  transaction.title ||
                  transaction.description ||
                  "Untitled transaction";

                const categoryName = getCategoryName(
                  transaction.category
                );

                return (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between gap-4"
                  >
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
                        <p className="truncate text-sm font-medium text-slate-900">
                          {transactionTitle}
                        </p>

                        <p className="truncate text-xs text-slate-400">
                          {categoryName} •{" "}
                          {formatDate(transaction.date)}
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
                      {isIncome ? "+" : "-"}
                      {formatCurrency(
                        Number(transaction.amount || 0)
                      )}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;