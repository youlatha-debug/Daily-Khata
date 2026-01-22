
import React, { useState } from 'react';
import { CURRENCIES } from '../constants';
import { Category, TransactionType } from '../types';

interface SettingsProps {
  currencyCode: string;
  onCurrencyChange: (code: string) => void;
  categories: Category[];
  onAddCategory: (cat: Omit<Category, 'id'>) => void;
}

const Settings: React.FC<SettingsProps> = ({ currencyCode, onCurrencyChange, categories, onAddCategory }) => {
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📦');
  const [newCatType, setNewCatType] = useState<TransactionType>(TransactionType.EXPENSE);

  const handleAddCategory = () => {
    if (!newCatName) return;
    onAddCategory({
      name: newCatName,
      icon: newCatIcon,
      type: newCatType,
      color: 'bg-gray-500'
    });
    setNewCatName('');
  };

  return (
    <div className="p-6 space-y-8 bg-white min-h-full">
      <h2 className="text-2xl font-black text-gray-800">Settings</h2>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Currency</h3>
        <div className="grid grid-cols-2 gap-3">
          {CURRENCIES.map(curr => (
            <button
              key={curr.code}
              onClick={() => onCurrencyChange(curr.code)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                currencyCode === curr.code ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold">{curr.code}</span>
                <span className="text-indigo-600 font-black">{curr.symbol}</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">{curr.name}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Add Category</h3>
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
          <div className="flex bg-white p-1 rounded-xl">
            <button
              onClick={() => setNewCatType(TransactionType.EXPENSE)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg ${newCatType === TransactionType.EXPENSE ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400'}`}
            >
              Expense
            </button>
            <button
              onClick={() => setNewCatType(TransactionType.INCOME)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg ${newCatType === TransactionType.INCOME ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400'}`}
            >
              Income
            </button>
          </div>
          <div className="flex space-x-2">
            <input 
              type="text" 
              placeholder="📦" 
              value={newCatIcon}
              onChange={(e) => setNewCatIcon(e.target.value)}
              className="w-12 h-12 bg-white rounded-xl border-none text-center text-xl shadow-sm outline-none"
            />
            <input 
              type="text" 
              placeholder="Category Name" 
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="flex-1 px-4 py-2 bg-white rounded-xl border-none outline-none font-medium text-gray-700 text-sm shadow-sm"
            />
          </div>
          <button 
            onClick={handleAddCategory}
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm shadow-md active:scale-95 transition-all"
          >
            Add Category
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Danger Zone</h3>
        <button 
          onClick={() => {
            if(confirm("Clear all app data? This cannot be undone.")) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="w-full py-4 text-red-600 bg-red-50 font-bold rounded-2xl border border-red-100 active:bg-red-100 transition-colors"
        >
          Reset All Data
        </button>
      </section>

      <div className="text-center pt-8 pb-12">
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">Daily Khata v1.0.0</p>
      </div>
    </div>
  );
};

export default Settings;
