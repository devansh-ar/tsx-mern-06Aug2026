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
          <span className="navbar-logo">⭐</span>
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
