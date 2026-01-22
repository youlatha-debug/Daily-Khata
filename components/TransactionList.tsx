
import React, { useState, useMemo } from 'react';
import { Transaction, Category, TransactionType } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  currency: { symbol: string; code: string };
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, categories, currency, onDelete }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | TransactionType>('ALL');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const cat = categories.find(c => c.id === t.categoryId);
      const matchesSearch = 
        t.note.toLowerCase().includes(search.toLowerCase()) || 
        cat?.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'ALL' || t.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, search, filterType, categories]);

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Note'];
    const rows = filteredTransactions.map(t => {
      const cat = categories.find(c => c.id === t.categoryId);
      return [
        new Date(t.date).toLocaleDateString(),
        t.type,
        cat?.name || 'Unknown',
        t.amount,
        t.note
      ].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DailyKhata_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-white min-h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-gray-800">History</h2>
        <button 
          onClick={exportToCSV}
          className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg"
        >
          Export CSV
        </button>
      </div>

      <div className="space-y-4 mb-8">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
          <input
            type="text"
            placeholder="Search notes or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none outline-none text-sm font-medium"
          />
        </div>

        <div className="flex space-x-2">
          {['ALL', TransactionType.EXPENSE, TransactionType.INCOME].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filterType === type ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {type === 'ALL' ? 'All' : type.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pb-12">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((t) => {
            const cat = categories.find(c => c.id === t.categoryId);
            return (
              <div key={t.id} className="group flex items-center p-4 rounded-2xl border border-gray-100 hover:border-indigo-100 transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mr-4 ${cat?.color || 'bg-gray-100'} bg-opacity-10 text-opacity-100`}>
                  {cat?.icon || '❓'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-800 truncate">{cat?.name || 'Unknown'}</h3>
                    <p className={`text-sm font-black ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === TransactionType.INCOME ? '+' : '-'} {currency.symbol} {t.amount}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-gray-400 font-medium truncate max-w-[120px]">{t.note || 'No note'}</p>
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">
                      {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => onDelete(t.id)}
                  className="hidden group-hover:flex ml-4 w-8 h-8 rounded-full bg-red-50 text-red-500 items-center justify-center text-xs"
                >
                  🗑️
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-400 font-medium italic">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
