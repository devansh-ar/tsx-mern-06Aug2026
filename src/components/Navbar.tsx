import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginModal } from './LoginModal';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <header className="navbar">
        <div className="navbar-brand">
          <svg className="navbar-logo" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            {/* Lightsaber */}
            <rect x="14.5" y="2" width="3" height="18" rx="1.5" fill="#ffe81f"/>
            <rect x="14" y="18" width="4" height="7" rx="1" fill="#888"/>
            <rect x="12.5" y="23" width="7" height="2" rx="1" fill="#aaa"/>
            <rect x="13" y="25" width="6" height="1.5" rx="0.75" fill="#666"/>
            <ellipse cx="16" cy="3" rx="1.5" ry="1" fill="#fff" opacity="0.8"/>
          </svg>
          <span className="navbar-title">Star Wars Universe</span>
        </div>
        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="user-info">
              <span className="username">👤 {user?.username}</span>
              <button className="auth-btn logout-btn" onClick={logout}>Sign Out</button>
            </div>
          ) : (
            <button className="auth-btn login-btn-nav" onClick={() => setShowLogin(true)}>
              Sign In
            </button>
          )}
        </div>
      </header>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
