import React, { useEffect, useState, useRef } from 'react';
import { FiSearch, FiGrid, FiList, FiFolder, FiTrendingUp, FiSettings, FiPlus, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const CommandPalette = ({ isOpen, onClose, setActiveTab, setIsModalOpen, handleLogout }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const commands = [
    { id: 'go-overview', label: 'Go to Overview', icon: FiGrid, action: () => setActiveTab('overview') },
    { id: 'go-tasks', label: 'Go to Tasks', icon: FiList, action: () => setActiveTab('tasks') },
    { id: 'go-projects', label: 'Go to Projects', icon: FiFolder, action: () => setActiveTab('projects') },
    { id: 'go-analytics', label: 'Go to Analytics', icon: FiTrendingUp, action: () => setActiveTab('analytics') },
    { id: 'go-settings', label: 'Go to Settings', icon: FiSettings, action: () => setActiveTab('settings') },
    { id: 'new-task', label: 'Create New Task', icon: FiPlus, action: () => setIsModalOpen(true) },
    { id: 'logout', label: 'Sign Out', icon: FiLogOut, action: handleLogout },
  ];

  const filteredCommands = commands.filter(cmd => cmd.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[activeIndex]) {
          filteredCommands[activeIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, activeIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      <div className="relative w-full max-w-[600px] bg-surface-elevated border border-border shadow-2xl rounded-2xl overflow-hidden animate-scale-in">
        <div className="flex items-center px-4 py-4 border-b border-border">
          <FiSearch className="w-5 h-5 text-text-secondary mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-text-primary text-[1.05rem] placeholder:text-text-muted"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
          />
          <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-bold text-text-secondary bg-surface border border-border rounded shadow-sm ml-2">ESC</kbd>
        </div>
        <div className="max-h-[300px] overflow-y-auto scrollbar-thin p-2">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => (
              <div
                key={cmd.id}
                className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-colors ${idx === activeIndex ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface'}`}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => { cmd.action(); onClose(); }}
              >
                <cmd.icon className={`w-5 h-5 mr-3 ${idx === activeIndex ? 'text-primary' : 'text-text-muted'}`} />
                <span className="font-medium">{cmd.label}</span>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-text-muted text-sm">
              No commands found for "{query}"
            </div>
          )}
        </div>
        <div className="px-4 py-3 border-t border-border bg-surface flex items-center justify-between text-xs text-text-muted">
          <span>Use <kbd className="bg-bg-base border border-border px-1 rounded mx-1">↑</kbd> <kbd className="bg-bg-base border border-border px-1 rounded mx-1">↓</kbd> to navigate</span>
          <span>Use <kbd className="bg-bg-base border border-border px-1 rounded mx-1">Enter</kbd> to select</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
