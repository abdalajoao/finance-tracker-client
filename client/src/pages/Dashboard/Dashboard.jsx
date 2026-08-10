import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import SummaryCard from "../../components/SummaryCard";

function Dashboard() {
  const recentTransactions = [
    {
      id: 1,
      description: "Salary",
      category: "Income",
      amount: 3200,
      type: "income",
      date: "Aug 10, 2026",
    },
    {
      id: 2,
      description: "Supermarket",
      category: "Food",
      amount: 85.5,
      type: "expense",
      date: "Aug 9, 2026",
    },
    {
      id: 3,
      description: "Netflix",
      category: "Entertainment",
      amount: 15.99,
      type: "expense",
      date: "Aug 8, 2026",
    },
    {
      id: 4,
      description: "Freelance Project",
      category: "Income",
      amount: 450,
      type: "income",
      date: "Aug 7, 2026",
    },
  ];

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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Total Balance"
          value="€2,450.00"
          description="Available balance"
          icon={Wallet}
        />

        <SummaryCard
          title="Total Income"
          value="€3,650.00"
          description="This month"
          icon={TrendingUp}
        />

        <SummaryCard
          title="Total Expenses"
          value="€1,200.00"
          description="This month"
          icon={TrendingDown}
        />
      </div>

      {/* Main Content */}
      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Overview */}
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

          {/* Temporary chart area */}
          <div className="mt-8 flex h-64 items-end justify-around gap-4 rounded-xl bg-slate-50 p-6">
            <div className="flex h-full items-end">
              <div className="h-32 w-10 rounded-t-lg bg-blue-500" />
            </div>

            <div className="flex h-full items-end">
              <div className="h-44 w-10 rounded-t-lg bg-blue-500" />
            </div>

            <div className="flex h-full items-end">
              <div className="h-24 w-10 rounded-t-lg bg-blue-500" />
            </div>

            <div className="flex h-full items-end">
              <div className="h-52 w-10 rounded-t-lg bg-blue-500" />
            </div>

            <div className="flex h-full items-end">
              <div className="h-36 w-10 rounded-t-lg bg-blue-500" />
            </div>

            <div className="flex h-full items-end">
              <div className="h-48 w-10 rounded-t-lg bg-blue-500" />
            </div>
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

            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View all
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {recentTransactions.map((transaction) => {
              const isIncome = transaction.type === "income";

              return (
                <div
                  key={transaction.id}
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
                        {transaction.description}
                      </p>

                      <p className="truncate text-xs text-slate-400">
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
                    {transaction.amount.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;