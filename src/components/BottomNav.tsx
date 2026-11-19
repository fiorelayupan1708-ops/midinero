import React from 'react';
import { Home, ReceiptText, BarChart3, User } from 'lucide-react';

export type NavTab = 'home' | 'transactions' | 'stats' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Inicio', icon: Home },
    { id: 'transactions' as NavTab, label: 'Movimientos', icon: ReceiptText },
    { id: 'stats' as NavTab, label: 'Estadísticas', icon: BarChart3 },
    { id: 'profile' as NavTab, label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 max-w-md mx-auto">
      <div className="grid grid-cols-4 items-center h-15">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative ${
                isActive
                  ? 'text-emerald-600 font-semibold'
                  : 'text-slate-400 hover:text-slate-700 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute top-1.5 w-1 h-1 rounded-full bg-emerald-600" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
