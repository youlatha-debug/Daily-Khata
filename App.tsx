
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, Category, Budget, AppState } from './types';
import { DEFAULT_CATEGORIES, CURRENCIES } from './constants';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import BudgetManager from './components/BudgetManager';
import Settings from './components/Settings';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'add' | 'budget' | 'settings'>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('dk_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('dk_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('dk_budgets');
    return saved ? JSON.parse(saved) : [];
  });
  const [currencyCode, setCurrencyCode] = useState(() => {
    return localStorage.getItem('dk_currency') || 'BDT';
  });

  useEffect(() => {
    localStorage.setItem('dk_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('dk_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('dk_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('dk_currency', currencyCode);
  }, [currencyCode]);

  const currency = useMemo(() => 
    CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0], 
    [currencyCode]
  );

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...t, id: Date.now().toString() };
    setTransactions(prev => [newTransaction, ...prev]);
    setActiveTab('dashboard');
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addCategory = (cat: Omit<Category, 'id'>): Category => {
    const newCat = { ...cat, id: Date.now().toString() };
    setCategories(prev => [...prev, newCat]);
    return newCat;
  };

  const updateBudget = (budget: Budget) => {
    setBudgets(prev => {
      const existingIdx = prev.findIndex(b => b.categoryId === budget.categoryId);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = budget;
        return updated;
      }
      return [...prev, budget];
    });
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 max-w-md mx-auto bg-white shadow-xl relative">
      <header className="bg-white border-b sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-indigo-600">Daily Khata</h1>
        <div className="text-sm font-medium bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
          {currency.symbol} {currencyCode}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <Dashboard 
            transactions={transactions} 
            categories={categories} 
            currency={currency} 
            budgets={budgets}
          />
        )}
        {activeTab === 'list' && (
          <TransactionList 
            transactions={transactions} 
            categories={categories} 
            currency={currency}
            onDelete={deleteTransaction}
          />
        )}
        {activeTab === 'add' && (
          <TransactionForm 
            categories={categories} 
            onSave={addTransaction}
            onCancel={() => setActiveTab('dashboard')}
            onAddCategory={addCategory}
          />
        )}
        {activeTab === 'budget' && (
          <BudgetManager 
            categories={categories} 
            budgets={budgets} 
            transactions={transactions}
            currency={currency}
            onUpdateBudget={updateBudget}
          />
        )}
        {activeTab === 'settings' && (
          <Settings 
            currencyCode={currencyCode} 
            onCurrencyChange={setCurrencyCode}
            categories={categories}
            onAddCategory={addCategory}
          />
        )}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
