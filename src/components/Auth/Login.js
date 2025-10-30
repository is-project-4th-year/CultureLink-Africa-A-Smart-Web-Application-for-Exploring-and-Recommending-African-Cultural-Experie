// src/components/Auth/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmail, signInWithGoogle, resendVerificationEmail } from '../../services/authService';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear messages when user types
    setError('');
    setSuccess('');
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setNeedsVerification(false);

    const { user, error: authError, requiresVerification, message } = await signInWithEmail(formData.email, formData.password);
    
    if (authError) {
      setError(authError);
      if (requiresVerification) {
        setNeedsVerification(true);
      }
      setLoading(false);
      return;
    }

    if (user) {
      setSuccess(message || 'Login successful!');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
    
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const { user, error: authError, message } = await signInWithGoogle();
    
    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }

    if (user) {
      setSuccess(message || 'Login successful!');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
    
    setLoading(false);
  };

  const handleResendVerification = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    const { error: resendError, message } = await resendVerificationEmail();

    if (resendError) {
      setError(resendError);
    } else {
      setSuccess(message || 'Verification email sent!');
    }

    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '450px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🇰🇪</div>
          <h1 style={{ 
            color: '#2c3e50', 
            marginTop: '0.5rem', 
            fontSize: '2rem',
            marginBottom: '0.5rem'
          }}>
            Welcome Back
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Sign in to explore Kenyan culture
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#fee',
            color: '#c33',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            border: '1px solid #fcc',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            <div style={{ flex: 1 }}>
              <strong>Error:</strong> {error}
              {needsVerification && (
                <div style={{ marginTop: '0.5rem' }}>
                  <button 
                    onClick={handleResendVerification}
                    disabled={loading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0984e3',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      padding: 0
                    }}
                  >
                    Resend verification email
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div style={{
            background: '#efe',
            color: '#3c3',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            border: '1px solid #cfc',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.2rem' }}>✅</span>
            <span><strong>Success:</strong> {success}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleEmailLogin}>
          {/* Email Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 'bold',
              color: '#2c3e50',
              fontSize: '1rem'
            }}>
               Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid #ddd',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 'bold',
              color: '#2c3e50',
              fontSize: '1rem'
            }}>
               Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  paddingRight: '3rem',
                  border: '2px solid #ddd',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3498db'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                {showPassword ? (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: loading ? '#bdc3c7' : '#e67e22',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '1rem',
              transition: 'background-color 0.3s'
            }}
          >
            {loading ? ' Signing In...' : ' Sign In to CultureLink'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ 
          textAlign: 'center', 
          margin: '1.5rem 0',
          position: 'relative'
        }}>
          <span style={{ 
            color: '#666',
            backgroundColor: 'white',
            padding: '0 1rem',
            position: 'relative',
            zIndex: 1
          }}>
            or continue with
          </span>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '1px',
            backgroundColor: '#ddd',
            zIndex: 0
          }}></div>
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: loading ? '#bdc3c7' : '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'background-color 0.3s'
          }}
        >
           Continue with Google
        </button>

        {/* Footer Links */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              style={{ 
                color: '#e67e22', 
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Create one here
            </Link>
          </p>
          <Link 
            to="/forgot-password" 
            style={{ 
              color: '#3498db', 
              textDecoration: 'none',
              fontSize: '0.9rem'
            }}
          >
             Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;