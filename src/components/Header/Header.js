// src/components/Header/Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, User, LogOut, LogIn, UserPlus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logOut } from '../../services/authService';
import './Header.css';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className="professional-header">
        <div className="header-container">
          {/* Menu Button - Left Side with Hover */}
          <div 
            className="sidebar-trigger"
            onMouseEnter={() => setIsSidebarOpen(true)}
          >
            <button className="sidebar-menu-btn">
              <Menu size={24} />
            </button>
          </div>

          {/* Logo Section - Left aligned with more space */}
          <div className="logo-section">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
              <img src="/images/KE.png" alt="Logo" className="logo-icon" />
              <h1 className="logo-text">CultureLink KE</h1>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="header-actions">
            {/* Search */}
            <form onSubmit={handleSearch} className="search-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search Kenyan culture..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            {/* Authentication Section */}
         {/* Authentication Section */}
{currentUser ? (
  <div className="auth-section" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
   <Link 
  to="/profile"
  className="user-info" 
  style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '0.5rem',
    textDecoration: 'none',
    color: '#ffffffff',
    cursor: 'pointer',
    transition: 'color 0.3s'
  }}
  onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
  onMouseLeave={(e) => e.currentTarget.style.color = '#cccccc'}
>
  {currentUser.photoURL ? (
    <img 
      src={currentUser.photoURL} 
      alt="Profile" 
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #b4a3a3ff'
      }}
    />
  ) : (
    <User size={20} />
  )}
  <span style={{ fontSize: '0.9rem' }}>
    {currentUser.displayName || 'User'}
  </span>
</Link>
    <button 
      onClick={handleLogout}
      className="logout-btn"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '0.25rem',
        cursor: 'pointer',
        fontSize: '0.9rem'
      }}
    >
      <LogOut size={16} />
      Logout
    </button>
  </div>
            ) : (
              <div className="auth-buttons" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link 
                  to="/login"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#c7ad4dff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '0.25rem',
                    fontSize: '0.9rem'
                  }}
                >
                  <LogIn size={12} />
                  Login
                </Link>
                <Link 
                  to="/signup"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#916945ff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '0.25rem',
                    fontSize: '0.9rem'
                  }}
                >
                  <UserPlus size={16} />
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sliding Sidebar */}
      <nav 
        className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}
        onMouseLeave={closeSidebar}
      >
        <div className="sidebar-header">
          <h2 className="sidebar-title">Menu</h2>
          <button className="sidebar-close-btn" onClick={closeSidebar}>
            <X size={24} />
          </button>
        </div>
        
        <div className="sidebar-nav">
          <Link to="/" className="sidebar-item" onClick={closeSidebar}>Home</Link>
          <Link to="/explore" className="sidebar-item" onClick={closeSidebar}>Explore</Link>
          <Link to="/chat" className="sidebar-item" onClick={closeSidebar}>Chat</Link>
          <Link to="/map" className="sidebar-item" onClick={closeSidebar}>Tribes Map</Link>
          <Link to="/blog" className="sidebar-item" onClick={closeSidebar}>Blog</Link>
          <Link to="/contact" className="sidebar-item" onClick={closeSidebar}>Contact Us</Link>
          <Link to="/learn" className="sidebar-item" onClick={closeSidebar}>Learn Languages</Link>
 
        </div>
        
      </nav>
    </>
  );
};

export default Header;