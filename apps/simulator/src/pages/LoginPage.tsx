import React, { useState } from 'react';
import {
  Compass,
  Mail,
  Lock,
  User,
  Briefcase,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AppPage } from '../components/Navbar';

interface LoginPageProps {
  setCurrentPage: (page: AppPage) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setCurrentPage }) => {
  const { login, quickDemoLogin, register } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('alex.morgan@cloudscale.io');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Alex Morgan');
  const [targetRole, setTargetRole] = useState('Senior Full-Stack Cloud Engineer');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      await login(email, password);
      setCurrentPage('dashboard');
    } catch {
      setMessage('Failed to authenticate. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      await register(name, email, targetRole);
      setCurrentPage('dashboard');
    } catch {
      setMessage('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = () => {
    quickDemoLogin();
    setCurrentPage('dashboard');
  };

  return (
    <div className="login-page-container">
      {/* Ambient background glows */}
      <div className="ambient-glow glow-top-center" />
      <div className="ambient-glow glow-bottom-right" />

      <div className="login-card-wrapper">
        <div className="login-glass-card">
          {/* Brand header inside card */}
          <div className="login-card-header">
            <div className="login-brand-icon">
              <Compass size={24} />
            </div>
            <h2 className="login-title">
              {mode === 'signin' ? 'Welcome Back' : 'Create Candidate Profile'}
            </h2>
            <p className="login-subtitle">
              {mode === 'signin'
                ? 'Sign in to access your interview roadmap and skill gap analytics'
                : 'Join CareerPilot AI to get targeted technical interview preparation'}
            </p>
          </div>

          {/* Quick Demo One-Click Login Button */}
          <div className="quick-demo-banner">
            <div className="quick-demo-info">
              <span className="demo-chip">HACKATHON QUICK ACCESS</span>
              <p className="demo-text">Evaluate the platform immediately with pre-loaded candidate data</p>
            </div>
            <button
              type="button"
              className="quick-demo-cta"
              onClick={handleQuickDemo}
            >
              <Sparkles size={15} />
              <span>1-Click Demo Login</span>
            </button>
          </div>

          <div className="auth-divider">
            <span>or continue with credentials</span>
          </div>

          {/* Mode Tabs */}
          <div className="auth-tab-row">
            <button
              type="button"
              className={`auth-tab-btn ${mode === 'signin' ? 'active' : ''}`}
              onClick={() => {
                setMode('signin');
                setMessage(null);
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => {
                setMode('signup');
                setMessage(null);
              }}
            >
              Create Account
            </button>
          </div>

          {message && <div className="auth-alert-message">{message}</div>}

          {/* Form */}
          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="auth-form">
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    className="form-input"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="login-password">Password</label>
                <div className="input-with-icon">
                  <Lock size={16} className="input-icon" />
                  <input
                    id="login-password"
                    type="password"
                    required
                    className="form-input"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="auth-submit-btn"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="auth-form">
              <div className="form-group">
                <label className="form-label" htmlFor="signup-name">Full Name</label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input
                    id="signup-name"
                    type="text"
                    required
                    className="form-input"
                    placeholder="Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signup-email">Work / Personal Email</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    id="signup-email"
                    type="email"
                    required
                    className="form-input"
                    placeholder="alex@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signup-role">Target Engineering Role</label>
                <div className="input-with-icon">
                  <Briefcase size={16} className="input-icon" />
                  <input
                    id="signup-role"
                    type="text"
                    required
                    className="form-input"
                    placeholder="Senior Full-Stack Engineer"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="auth-submit-btn"
              >
                {isLoading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Profile & Continue</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="login-card-footer">
            <span className="privacy-badge">
              <ShieldCheck size={14} /> Private & Secured with PostgreSQL Isolated Sessions
            </span>
            <button
              type="button"
              className="back-home-link"
              onClick={() => setCurrentPage('home')}
            >
              ← Back to Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
