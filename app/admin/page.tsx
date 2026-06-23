'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_ID = 'beyondweddings';
const ADMIN_PASSWORD = 'beyond2024';

export default function AdminLoginPage() {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (adminId === ADMIN_ID && password === ADMIN_PASSWORD) {
        sessionStorage.setItem('bw_admin_auth', 'true');
        router.push('/admin/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <h1>Beyond Weddings</h1>
        <div className="subtitle">Admin Panel</div>

        <form onSubmit={handleLogin}>
          {error && <div className="admin-login-error">{error}</div>}

          <input
            type="text"
            className="admin-input"
            placeholder="Admin ID"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            autoFocus
            disabled={loading}
            autoComplete="username"
            style={{ marginBottom: 12 }}
          />

          <input
            type="password"
            className="admin-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            autoComplete="current-password"
          />

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
            disabled={loading || !adminId.trim() || !password.trim()}
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: 24, fontSize: '0.7rem', color: 'var(--admin-text-muted)', letterSpacing: '0.5px' }}>
          Access restricted to studio administrators
        </p>
      </div>
    </div>
  );
}
