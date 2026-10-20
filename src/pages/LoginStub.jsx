import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, LogIn, ArrowLeft, Check, Shield } from 'lucide-react';
import TicketCard from '../components/common/TicketCard';
import Button from '../components/common/Button';
import FormField from '../components/common/FormField';
import './LoginStub.css';

export default function LoginStub() {
  const navigate = useNavigate();
  const { user, login, logout, userRole, setRole } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('aarav.mehta@wanderwise.demo');
  const [name, setName] = useState('Aarav Mehta');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login({
      id: 'usr-442',
      name: name.trim() || 'Aarav Mehta',
      email: email.trim(),
      avatar: '/images/guide-portrait.jpg',
      handle: '@aarav_travels'
    });
    showToast('Logged in as demo user', 'success');
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out', 'info');
  };

  return (
    <main id="main-content" className="login-stub-page">
      <div className="container login-container">
        <Link to="/" className="stub-back-link">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <TicketCard
          className="login-stub-card"
          header={
            <div className="login-card-header">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                <span>AUTH STUB</span>
              </div>
              <h3>ABEON Account Access</h3>
            </div>
          }
          stub={
            <div className="login-card-stub">
              <small>Teammates' auth & role selection stub route (/login)</small>
            </div>
          }
        >
          {user ? (
            <div className="logged-in-box">
              <div className="user-profile-summary">
                <div className="user-avatar-placeholder">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                  <div className="current-role-badge">
                    Role: <strong>{userRole === 'guide' ? 'Local Guide' : 'Traveler'}</strong>
                  </div>
                </div>
              </div>

              <div className="role-switch-buttons">
                <button
                  type="button"
                  className={`role-btn ${userRole === 'traveler' ? 'is-active' : ''}`}
                  onClick={() => {
                    setRole('traveler');
                    showToast('Role switched to Traveler', 'info');
                  }}
                >
                  Switch to Traveler
                </button>
                <button
                  type="button"
                  className={`role-btn ${userRole === 'guide' ? 'is-active' : ''}`}
                  onClick={() => {
                    setRole('guide');
                    showToast('Role switched to Local Guide', 'info');
                  }}
                >
                  Switch to Local Guide
                </button>
              </div>

              <div className="logged-in-actions">
                <Button variant="outline" size="md" onClick={handleLogout}>
                  Log out
                </Button>
                <Button variant="primary" size="md" onClick={() => navigate('/dashboard')}>
                  Proceed to Dashboard
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLoginSubmit} className="login-form">
              <FormField
                label="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <FormField
                type="email"
                label="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="role-selector-form">
                <label className="ww-form-field__label">Select Starting Role</label>
                <div className="role-radio-group">
                  <label className="role-radio-item">
                    <input
                      type="radio"
                      name="startingRole"
                      checked={userRole === 'traveler'}
                      onChange={() => setRole('traveler')}
                    />
                    <span>Traveler</span>
                  </label>
                  <label className="role-radio-item">
                    <input
                      type="radio"
                      name="startingRole"
                      checked={userRole === 'guide'}
                      onChange={() => setRole('guide')}
                    />
                    <span>Local Guide</span>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                leftIcon={<LogIn size={16} />}
                className="login-submit-btn"
              >
                Log in as Demo User
              </Button>
            </form>
          )}
        </TicketCard>
      </div>
    </main>
  );
}
