
import React, { useMemo, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Transaction, TransactionType, Category, FinancialInsight, Budget } from '../types';
import { getFinancialInsights } from '../services/geminiService';

interface DashboardProps {
  transactions: Transaction[];
  categories: Category[];
  currency: { symbol: string; code: string };
  budgets: Budget[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, categories, currency, budgets }) => {
  const [insights, setInsights] = useState<FinancialInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const summary = useMemo(() => {
    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const barData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayTransactions = transactions.filter(t => t.date.split('T')[0] === date);
      return {
        name: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
        income: dayTransactions.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0),
        expense: dayTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0),
      };
    });
  }, [transactions]);

  const pieData = useMemo(() => {
    const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);
    const groupByCategory: Record<string, number> = {};
    
    expenseTransactions.forEach(t => {
      const cat = categories.find(c => c.id === t.categoryId);
      const name = cat ? cat.name : 'Other';
      groupByCategory[name] = (groupByCategory[name] || 0) + t.amount;
    });

    return Object.entries(groupByCategory).map(([name, value]) => ({ name, value }));
  }, [transactions, categories]);

  const COLORS = ['#6366f1', '#f59e0b', '#ec4899', '#10b981', '#3b82f6', '#8b5cf6'];

  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingInsights(true);
      const data = await getFinancialInsights(transactions, categories, currency.code);
      setInsights(data);
      setLoadingInsights(false);
    };

    if (transactions.length > 0) {
      fetchInsights();
    }
  }, [transactions, categories, currency.code]);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
          <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">Income</p>
          <p className="text-xl font-bold text-green-700">{currency.symbol} {summary.income.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
          <p className="text-xs text-red-600 font-semibold uppercase tracking-wider">Expense</p>
          <p className="text-xl font-bold text-red-700">{currency.symbol} {summary.expense.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
        <p className="text-sm text-gray-500 font-medium">Net Balance</p>
        <p className={`text-4xl font-black mt-1 ${summary.balance >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
          {currency.symbol} {summary.balance.toLocaleString()}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center">
          <span className="mr-2">📊</span> Weekly Overview
        </h2>
        <div className="h-64 w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <YAxis hide />
              <Tooltip cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center">
          <span className="mr-2">✨</span> AI Insights
        </h2>
        <div className="space-y-3">
          {loadingInsights ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : insights.length > 0 ? (
            insights.map((insight, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-xl border ${
                  insight.type === 'warning' ? 'bg-amber-50 border-amber-100' :
                  insight.type === 'positive' ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50 border-blue-100'
                }`}
              >
                <div className="flex items-center mb-1">
                  <span className="mr-2">{insight.type === 'warning' ? '⚠️' : insight.type === 'positive' ? '✅' : '💡'}</span>
                  <h3 className="font-bold text-sm">{insight.title}</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{insight.content}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center py-4 italic">No insights available yet. Keep tracking!</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center">
          <span className="mr-2">🍰</span> Category Split
        </h2>
        <div className="h-64 w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col space-y-1 ml-4 overflow-y-auto max-h-full">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center text-xs text-gray-600">
                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="truncate max-w-[80px]">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
