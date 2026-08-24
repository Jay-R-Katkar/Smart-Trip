import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  TrendingUp, 
  PieChart, 
  DollarSign, 
  Calendar, 
  Tag, 
  Receipt, 
  CheckCircle2, 
  ArrowDownRight,
  Sparkles,
  X,
  AlertCircle
} from 'lucide-react';

export function BudgetTracker({ 
  budgetData, 
  onAddExpense, 
  onDeleteExpense 
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Food');
  const [newNotes, setNewNotes] = useState('');
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);

  const categories = [
    { id: 'Accommodation', icon: '🏨', color: 'bg-indigo-500' },
    { id: 'Food', icon: '🍽️', color: 'bg-amber-500' },
    { id: 'Activities', icon: '🎟️', color: 'bg-emerald-500' },
    { id: 'Transport', icon: '🚕', color: 'bg-sky-500' },
    { id: 'Shopping', icon: '🛍️', color: 'bg-purple-500' },
    { id: 'Miscellaneous', icon: '📦', color: 'bg-slate-500' }
  ];

  const totalBudget = budgetData?.total_budget || 1200;
  const totalSpent = budgetData?.total_spent || 0;
  const remainingBudget = Math.max(0, totalBudget - totalSpent);
  const percentageSpent = budgetData?.percentage_spent || (totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0);

  const expenses = budgetData?.expenses || [];
  const categoryBreakdown = budgetData?.category_breakdown || [];

  // Filter expenses
  const filteredExpenses = expenses.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCat = selectedCategoryFilter === 'All' || e.category === selectedCategoryFilter;
    return matchSearch && matchCat;
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;

    if (onAddExpense) {
      onAddExpense({
        trip_id: budgetData?.trip_id || 1,
        title: newTitle.trim(),
        amount: parseFloat(newAmount),
        category: newCategory,
        date: newDate,
        notes: newNotes.trim()
      });
    }

    setNewTitle('');
    setNewAmount('');
    setNewNotes('');
    setShowAddModal(false);
  };

  // Progress Bar styling logic
  const isOverBudget = percentageSpent >= 100;
  const isWarning80 = percentageSpent >= 80 && percentageSpent < 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
            Module 3: Real-Time Financial Tracker
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Trip Budget & Expense Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Automatic threshold alerts at 80% and 100% capacity with category-wise breakdown.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Expense</span>
        </button>
      </div>

      {/* 80% & 100% ALERT NOTIFICATION BANNERS */}
      {isOverBudget && (
        <div className="p-5 rounded-3xl bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-500 text-rose-900 dark:text-rose-200 flex items-start gap-4 shadow-lg animate-bounce">
          <div className="p-2 rounded-2xl bg-rose-500 text-white flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-base text-rose-700 dark:text-rose-300">
              🚨 100% Total Budget Limit Exceeded!
            </h4>
            <p className="text-xs sm:text-sm mt-0.5 text-rose-600 dark:text-rose-300">
              You have spent <strong>${totalSpent.toFixed(2)}</strong> which exceeds your allocated limit of <strong>${totalBudget.toFixed(2)}</strong> by ${(totalSpent - totalBudget).toFixed(2)}. Consider reviewing discretionary shopping or dining expenses.
            </p>
          </div>
        </div>
      )}

      {isWarning80 && (
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-500 text-amber-900 dark:text-amber-200 flex items-start gap-4 shadow-md">
          <div className="p-2 rounded-2xl bg-amber-500 text-white flex-shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-base text-amber-700 dark:text-amber-300">
              ⚠️ 80% Budget Threshold Warning Activated
            </h4>
            <p className="text-xs sm:text-sm mt-0.5 text-amber-800 dark:text-amber-300">
              You have utilized <strong>{percentageSpent}%</strong> of your funds. You have <strong>${remainingBudget.toFixed(2)}</strong> left for the remainder of the trip.
            </p>
          </div>
        </div>
      )}

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total Budget Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Total Allocated Budget</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            ${totalBudget.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1 font-medium">
            <span>Target Pacing: ${Math.round(totalBudget / 3)} / day</span>
          </div>
        </div>

        {/* Total Spent Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Total Logged Spend</span>
          <div className={`text-3xl font-black mt-1 ${isOverBudget ? 'text-rose-600' : isWarning80 ? 'text-amber-600' : 'text-emerald-600'}`}>
            ${totalSpent.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-2 font-medium">
            {expenses.length} individual transactions
          </div>
        </div>

        {/* Remaining Budget Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Remaining Buffer</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            ${remainingBudget.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-2 font-medium">
            {isOverBudget ? 'Deficit' : `${(100 - percentageSpent).toFixed(1)}% Available`}
          </div>
        </div>

      </div>

      {/* Progress Bar & Meter */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex justify-between items-center text-xs font-extrabold text-slate-700 dark:text-slate-300">
          <span>Overall Consumption Meter</span>
          <span className={isOverBudget ? 'text-rose-600' : isWarning80 ? 'text-amber-600' : 'text-emerald-600'}>
            {percentageSpent}% Consumed
          </span>
        </div>

        <div className="relative w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-700 rounded-full ${
              isOverBudget 
                ? 'bg-rose-500' 
                : isWarning80 
                ? 'bg-amber-500' 
                : 'bg-gradient-to-r from-emerald-500 to-teal-400'
            }`}
            style={{ width: `${Math.min(100, percentageSpent)}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-slate-400 font-medium pt-1">
          <span>$0.00</span>
          <span className="text-amber-500 font-bold">80% Warning Mark (${(totalBudget * 0.8).toFixed(0)})</span>
          <span>100% (${totalBudget.toFixed(0)})</span>
        </div>
      </div>

      {/* Category Breakdown Charts */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Category Spending Distribution</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">Automatic Categorization</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categoryBreakdown.map((cat) => (
            <div key={cat.category} className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">{cat.category}</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">${cat.amount.toFixed(2)}</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 font-medium text-right">
                {cat.percentage}% of total spend
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EXPENSE LOGS TABLE */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Expense History ({filteredExpenses.length})</span>
            </h3>
          </div>

          {/* Search & Category Filter */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="All">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {filteredExpenses.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No expenses recorded yet. Click "Log New Expense" above to start tracking.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Description</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Notes</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pl-2 font-bold text-slate-900 dark:text-white">
                      {exp.title}
                    </td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-500">
                      {exp.date}
                    </td>
                    <td className="py-3.5 text-slate-400 text-[11px] max-w-[200px] truncate">
                      {exp.notes || '-'}
                    </td>
                    <td className="py-3.5 text-right font-extrabold text-sm text-slate-900 dark:text-white">
                      ${exp.amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 pr-2 text-right">
                      <button
                        onClick={() => onDeleteExpense && onDeleteExpense(exp.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* ADD EXPENSE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    Log Real-Time Expense
                  </h3>
                  <p className="text-xs text-slate-500">Calculates updated threshold instantaneously</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Expense Title / Receipt</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Louvre Museum tickets x2, Dinner at Le Marais"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Amount ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.id}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Optional Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Paid in cash, split with traveling partner"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
              >
                Save & Update Budget Status
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
