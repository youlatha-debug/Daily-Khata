
import React, { useState } from 'react';
import { Budget, Category, Transaction, TransactionType } from '../types';

interface BudgetManagerProps {
  categories: Category[];
  budgets: Budget[];
  transactions: Transaction[];
  currency: { symbol: string; code: string };
  onUpdateBudget: (budget: Budget) => void;
}

const BudgetManager: React.FC<BudgetManagerProps> = ({ categories, budgets, transactions, currency, onUpdateBudget }) => {
  const [selectedCat, setSelectedCat] = useState('');
  const [amount, setAmount] = useState('');

  const expenseCategories = categories.filter(c => c.type === TransactionType.EXPENSE);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const getSpent = (catId: string) => {
    return transactions
      .filter(t => {
        const d = new Date(t.date);
        return t.categoryId === catId && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleSave = () => {
    if (!selectedCat || !amount) return;
    onUpdateBudget({
      categoryId: selectedCat,
      amount: parseFloat(amount),
      period: 'monthly'
    });
    setAmount('');
    setSelectedCat('');
  };

  return (
    <div className="p-6 bg-white min-h-full">
      <h2 className="text-2xl font-black text-gray-800 mb-8">Budgets</h2>

      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 mb-8">
        <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">Set New Budget</h3>
        <div className="space-y-4">
          <select 
            value={selectedCat} 
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-xl border-none outline-none font-medium text-gray-700 text-sm shadow-sm"
          >
            <option value="">Select Category</option>
            {expenseCategories.map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
          <div className="flex space-x-2">
            <input 
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 px-4 py-3 bg-white rounded-xl border-none outline-none font-medium text-gray-700 text-sm shadow-sm"
            />
            <button 
              onClick={handleSave}
              disabled={!selectedCat || !amount}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm shadow-md active:scale-95 transition-all disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Budgets</h3>
        {budgets.length > 0 ? budgets.map(budget => {
          const cat = categories.find(c => c.id === budget.categoryId);
          const spent = getSpent(budget.categoryId);
          const percent = Math.min((spent / budget.amount) * 100, 100);
          
          return (
            <div key={budget.categoryId} className="space-y-2">
              <div className="flex justify-between items-end">
                <div className="flex items-center">
                  <span className="text-xl mr-2">{cat?.icon}</span>
                  <span className="text-sm font-bold text-gray-800">{cat?.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-medium">Spent: {currency.symbol}{spent}</p>
                  <p className="text-sm font-black text-indigo-600">Limit: {currency.symbol}{budget.amount}</p>
                </div>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${percent > 90 ? 'bg-red-500' : percent > 70 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                <span>{percent.toFixed(0)}% Used</span>
                <span>{currency.symbol}{Math.max(0, budget.amount - spent)} Remaining</span>
              </div>
            </div>
          );
        }) : (
          <p className="text-sm text-gray-400 italic py-4">No budgets set yet.</p>
        )}
      </div>
    </div>
  );
};

export default BudgetManager;
