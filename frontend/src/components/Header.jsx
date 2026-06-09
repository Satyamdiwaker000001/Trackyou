import React from 'react';
import { FiLogOut } from 'react-icons/fi';

/**
 * Helper functions for user formatting
 */
const formatName = userData => {
  if (userData?.name) return userData.name;
  if (!userData?.email) return 'Achiever';
  const part = userData.email.split('@')[0];
  return part.split(/[-._]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const getInitials = userData => {
  if (!userData) return 'U';
  const name = formatName(userData);
  const parts = name.split(' ');
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const getLoginProvider = userData => {
  if (!userData) return 'Email Account';
  if (userData.provider === 'google') return 'Google OAuth';
  if (userData.provider === 'github') return 'GitHub OAuth';
  return 'Email Account';
};

/**
 * Header component for the dashboard.
 * Props:
 *  - activeTab: current active tab string (used for breadcrumb)
 *  - user: user object containing photo, name etc.
 *  - handleLogout: function to log out the user
 */
const Header = ({ activeTab, user, handleLogout }) => {
  return (
    <header className="panel-header">
      <div className="header-breadcrumbs">
        <span className="breadcrumb-parent">Dashboard</span>
        <span className="breadcrumb-divider">/</span>
        <span className="breadcrumb-current" style={{ textTransform: 'capitalize' }}>{activeTab}</span>
      </div>

      <div className="header-actions">
        {/* User Profile Info */}
        <div className="user-profile-menu">
          <div className="user-avatar-circle" style={user && user.photo ? { background: 'none' } : {}}>
            {user && user.photo ? (
              <img src={user.photo} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
            ) : (
              getInitials(user)
            )}
          </div>
          <div className="user-meta">
            <span className="user-name">{user ? formatName(user) : 'Loading...'}</span>
            <span className="user-provider-tag">{user ? getLoginProvider(user) : ''}</span>
          </div>
          <button className="btn-panel-logout" onClick={handleLogout} title="Logout">
            <FiLogOut />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
