
import React from 'react';

interface NavigationProps {
  activeTab: 'dashboard' | 'list' | 'add' | 'budget' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'list' | 'add' | 'budget' | 'settings') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: '🏠' },
    { id: 'list', label: 'History', icon: '📜' },
    { id: 'add', label: '', icon: '➕', special: true },
    { id: 'budget', label: 'Budget', icon: '🎯' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 flex justify-around items-end px-2 safe-area-bottom z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`flex flex-col items-center py-3 px-2 flex-1 transition-all ${
            activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'
          }`}
        >
          {tab.special ? (
            <div className="bg-indigo-600 text-white w-14 h-14 rounded-full flex items-center justify-center -mt-8 shadow-lg shadow-indigo-200 active:scale-95 transition-transform">
              <span className="text-2xl leading-none">{tab.icon}</span>
            </div>
          ) : (
            <>
              <span className="text-xl mb-1">{tab.icon}</span>
              <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
            </>
          )}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
