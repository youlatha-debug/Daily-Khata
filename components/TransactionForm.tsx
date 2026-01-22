
import React, { useState } from 'react';
import { Category, TransactionType, Transaction } from '../types';

interface TransactionFormProps {
  categories: Category[];
  onSave: (t: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
  onAddCategory: (cat: Omit<Category, 'id'>) => Category;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ categories, onSave, onCancel, onAddCategory }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [image, setImage] = useState<string | undefined>();
  
  // States for adding a new category inline
  const [isAddingOther, setIsAddingOther] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📂');

  const filteredCategories = categories.filter(c => c.type === type);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNewCategory = () => {
    if (!newCatName.trim()) return;
    const newCat = onAddCategory({
      name: newCatName,
      icon: newCatIcon,
      type: type,
      color: 'bg-gray-500' // Default color for custom categories
    });
    setCategoryId(newCat.id);
    setIsAddingOther(false);
    setNewCatName('');
    setNewCatIcon('📂');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId) return;
    onSave({
      amount: parseFloat(amount),
      categoryId,
      date: new Date(date).toISOString(),
      note,
      type,
      image,
    });
  };

  return (
    <div className="p-6 bg-white min-h-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-gray-800">Add Entry</h2>
        <button onClick={onCancel} className="text-gray-400 p-2">✕</button>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
        <button
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
            type === TransactionType.EXPENSE ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'
          }`}
          onClick={() => {
            setType(TransactionType.EXPENSE);
            setCategoryId('');
            setIsAddingOther(false);
          }}
        >
          Expense
        </button>
        <button
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
            type === TransactionType.INCOME ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'
          }`}
          onClick={() => {
            setType(TransactionType.INCOME);
            setCategoryId('');
            setIsAddingOther(false);
          }}
        >
          Income
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Amount</label>
          <div className="relative border-b-2 border-gray-100 focus-within:border-indigo-600 transition-all">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-bold text-gray-400">৳</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full pl-8 py-3 text-4xl font-bold bg-transparent outline-none placeholder:text-gray-200"
              required
              autoFocus
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
          {isAddingOther ? (
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">New {type.toLowerCase()} category</span>
                <button type="button" onClick={() => setIsAddingOther(false)} className="text-[10px] font-bold text-red-400 uppercase">Cancel</button>
              </div>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="w-12 h-12 bg-white rounded-xl border-none text-center text-xl shadow-sm outline-none"
                  placeholder="Icon"
                />
                <input 
                  type="text" 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Category Name"
                  className="flex-1 px-4 py-2 bg-white rounded-xl border-none outline-none font-medium text-gray-700 text-sm shadow-sm"
                  autoFocus
                />
              </div>
              <button 
                type="button"
                onClick={handleAddNewCategory}
                className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg text-xs shadow-sm"
              >
                Add Category
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {filteredCategories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${
                    categoryId === cat.id ? 'border-indigo-600 bg-indigo-50' : 'border-transparent bg-gray-50'
                  }`}
                >
                  <span className="text-2xl mb-1">{cat.icon}</span>
                  <span className="text-[10px] text-gray-600 font-medium truncate w-full text-center">{cat.name}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsAddingOther(true)}
                className="flex flex-col items-center p-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:bg-gray-100"
              >
                <span className="text-2xl mb-1 text-gray-300">➕</span>
                <span className="text-[10px] text-gray-400 font-medium">Other</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none font-medium text-gray-700"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Receipt (Optional)</label>
            <label className="flex items-center justify-center w-full h-[52px] px-4 bg-gray-50 rounded-xl border-none font-medium text-gray-700 cursor-pointer overflow-hidden relative">
              {image ? (
                <img src={image} className="w-full h-full object-cover" alt="Receipt preview" />
              ) : (
                <span className="text-xl">📷</span>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What was this for?"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none font-medium text-gray-700 h-24 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={!amount || !categoryId || isAddingOther}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 disabled:bg-gray-200 disabled:shadow-none transition-all active:scale-[0.98] mt-4"
        >
          Save Transaction
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
