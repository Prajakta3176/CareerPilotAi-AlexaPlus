import React, { useState } from 'react';
import {
  Compass,
  Home,
  LayoutDashboard,
  FileCheck2,
  Calendar,
  HelpCircle,
  MessageSquareCode,
  Sparkles,
  RotateCcw,
  Moon,
  Sun,
  LogIn,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSimulator } from '../context/SimulatorContext';

export type AppPage = 'home' | 'login' | 'dashboard' | 'simulator';

interface NavbarProps {
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  theme,
  toggleTheme,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isSampleLoaded, loadSampleData, resetSession, setActiveTab } = useSimulator();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigateToSimulatorTab = (tab: 'onboarding' | 'analysis' | 'plan' | 'quiz') => {
    setActiveTab(tab);
    setCurrentPage('simulator');
  };

  return (
    <header className="site-navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => setCurrentPage('home')}>
          <div className="brand-logo-icon">
            <Compass size={22} className="compass-icon" />
          </div>
          <div className="brand-text-group">
            <span className="brand-name">CareerPilot <span className="brand-accent">AI</span></span>
            <span className="brand-badge-pill">Alexa+ 2026</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="navbar-links" aria-label="Main Navigation">
          <button
            type="button"
            className={`nav-link-btn ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentPage('home')}
          >
            <Home size={15} />
            <span>Home</span>
          </button>

          <button
            type="button"
            className={`nav-link-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            <LayoutDashboard size={15} />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className={`nav-link-btn ${currentPage === 'simulator' ? 'active' : ''}`}
            onClick={() => navigateToSimulatorTab('onboarding')}
          >
            <FileCheck2 size={15} />
            <span>Skill Gaps</span>
          </button>

          <button
            type="button"
            className="nav-link-btn"
            onClick={() => navigateToSimulatorTab('plan')}
          >
            <Calendar size={15} />
            <span>Study Plan</span>
          </button>

          <button
            type="button"
            className="nav-link-btn"
            onClick={() => navigateToSimulatorTab('quiz')}
          >
            <HelpCircle size={15} />
            <span>Quiz</span>
          </button>

          <button
            type="button"
            className={`nav-link-btn nav-link-special ${currentPage === 'simulator' ? 'active' : ''}`}
            onClick={() => setCurrentPage('simulator')}
          >
            <MessageSquareCode size={15} />
            <span>AI Copilot</span>
            <span className="pulse-dot" />
          </button>
        </nav>

        {/* Right Action Tools */}
        <div className="navbar-actions">
          {/* Load Sample Demo */}
          <button
            type="button"
            className={`action-btn sample-btn ${isSampleLoaded ? 'loaded' : ''}`}
            onClick={loadSampleData}
            title="Load sample Full-Stack Engineer job description and candidate resume"
          >
            <Sparkles size={14} />
            <span className="btn-label">{isSampleLoaded ? 'Sample Loaded' : 'Load Demo'}</span>
          </button>

          {/* Reset session button */}
          <button
            type="button"
            className="action-btn icon-only"
            onClick={resetSession}
            title="Reset session state"
          >
            <RotateCcw size={14} />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            className="action-btn icon-only theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* User Auth Profile / Login */}
          {/* {isAuthenticated && user ? (
            <div className="user-dropdown-wrap">
              <button
                type="button"
                className="user-pill-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar-tiny">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} />
                  ) : (
                    <span>{user.name.charAt(0)}</span>
                  )}
                </div>
                <div className="user-info-tiny">
                  <span className="user-name-short">{user.name}</span>
                </div>
                <ChevronDown size={12} className="chevron-icon" />
              </button>

              {showUserMenu && (
                <div className="user-menu-dropdown">
                  <div className="user-menu-header">
                    <p className="menu-user-name">{user.name}</p>
                    <p className="menu-user-role">{user.targetRole}</p>
                    <p className="menu-user-email">{user.email}</p>
                  </div>
                  <div className="dropdown-divider" />
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      setCurrentPage('dashboard');
                      setShowUserMenu(false);
                    }}
                  >
                    <LayoutDashboard size={14} />
                    <span>My Dashboard</span>
                  </button>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      setCurrentPage('simulator');
                      setShowUserMenu(false);
                    }}
                  >
                    <User size={14} />
                    <span>Interview Simulator</span>
                  </button>
                  <div className="dropdown-divider" />
                  <button
                    type="button"
                    className="dropdown-item logout"
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="action-btn primary-btn signin-btn"
              onClick={() => setCurrentPage('login')}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
          )} */}
        </div>
      </div>
    </header>
  );
};
