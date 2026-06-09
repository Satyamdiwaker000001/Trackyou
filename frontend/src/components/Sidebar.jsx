import React from 'react';
import { FiGrid, FiList, FiFolder, FiTrendingUp, FiSettings, FiPlus } from 'react-icons/fi';

/**
 * Sidebar component for the dashboard.
 * Props:
 *  - activeTab: current active tab string
 *  - setActiveTab: function to change active tab
 *  - setIsModalOpen: function to open the New Task modal
 */
const Sidebar = ({ activeTab, setActiveTab, setIsModalOpen }) => {
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo-wrap">
          <span className="brand-dot"></span>
        </div>
        <h2>TrackYourDay</h2>
      </div>

      <nav className="sidebar-menu">
        <div className="menu-group">
          <span className="menu-group-title">Main Menu</span>
          <button
            className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FiGrid className="menu-icon" /> Overview
          </button>
          <button
            className={`menu-item ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <FiList className="menu-icon" /> Tasks
          </button>
          <button
            className={`menu-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <FiFolder className="menu-icon" /> Projects
          </button>
          <button
            className={`menu-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <FiTrendingUp className="menu-icon" /> Analytics
          </button>
        </div>
        <div className="menu-group">
          <span className="menu-group-title">Preferences</span>
          <button
            className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FiSettings className="menu-icon" /> Settings
          </button>
        </div>
      </nav>

      {/* Sidebar Footer Action */}
      <div className="sidebar-action">
        <button className="primary-btn sidebar-btn-add" onClick={() => setIsModalOpen(true)}>
          <FiPlus className="btn-icon-svg" /> New Task
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
