import React from 'react';
import { FiMenu, FiBell } from 'react-icons/fi';

const Header = ({ activeTab, setIsSidebarOpen }) => {
  return (
    <header className="h-[72px] w-full flex items-center justify-between px-8 bg-bg-base border-b border-border sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface" onClick={() => setIsSidebarOpen(true)}>
          <FiMenu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center text-[0.95rem] font-semibold text-text-secondary">
          <span className="hover:text-text-primary cursor-pointer transition-colors">Workspace</span>
          <span className="mx-3 text-border">/</span>
          <span className="text-text-primary capitalize">{activeTab}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2.5 text-text-secondary hover:text-text-primary hover:bg-surface-elevated border border-transparent hover:border-border rounded-xl transition-all">
          <FiBell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-danger border-2 border-bg-base"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
