// src/components/Auth/Signup.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUpWithEmail, signInWithGoogle, resendVerificationEmail } from '../../services/authService';

const Signup = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
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

  const validateForm = () => {
    if (formData.displayName.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const { user, error: authError, message } = await signUpWithEmail(
      formData.email, 
      formData.password, 
      formData.displayName
    );
    
    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }

    if (user) {
      setSuccess(message || 'Account created! Please check your email for verification.');
      setAccountCreated(true);
      setUserEmail(formData.email);
      
      // Clear form
      setFormData({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    }
    
    setLoading(false);
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const { error: resendError, message } = await resendVerificationEmail();
    
    if (resendError) {
      setError(resendError);
    } else {
      setSuccess(message || 'Verification email sent!');
    }

    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const { user, error: authError, isNewUser, message } = await signInWithGoogle();
    
    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }

    if (user) {
      setSuccess(message || 'Account created successfully!');
      setTimeout(() => {
        if (isNewUser) {
          navigate('/cultural-preferences');
        } else {
          navigate('/');
        }
      }, 1000);
    }
    
    setLoading(false);
  };

  // Email verification success screen
  if (accountCreated) {
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
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📧</div>
          
          <h1 style={{ 
            color: '#27ae60', 
            marginBottom: '1rem',
            fontSize: '1.8rem'
          }}>
            Account Created Successfully!
          </h1>
          
          <p style={{ 
            color: '#2c3e50', 
            marginBottom: '1.5rem',
            fontSize: '1.1rem',
            lineHeight: '1.5'
          }}>
            We've sent a verification email to:
            <br />
            <strong style={{ color: '#e67e22' }}>{userEmail}</strong>
          </p>

          <div style={{
            background: '#e8f5e8',
            border: '1px solid #c3e6c3',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ color: '#155724', marginBottom: '1rem' }}>Next Steps:</h3>
            <ol style={{ 
              color: '#155724', 
              textAlign: 'left', 
              lineHeight: '1.6',
              paddingLeft: '1.5rem'
            }}>
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the verification link in the email</li>
              <li>Return here and log in with your credentials</li>
            </ol>
          </div>

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
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '1.2rem' }}>✅</span>
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              border: '1px solid #fcc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '1.2rem' }}></span>
              <span>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={handleResendVerification}
              disabled={loading}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: loading ? '#bdc3c7' : '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              {loading ? ' Sending...' : ' Resend Verification Email'}
            </button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link 
              to="/login" 
              style={{ 
                color: '#e67e22', 
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}
            >
              ← Back to Login
            </Link>
          </div>

          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '0.5rem'
          }}>
            <p style={{ color: '#856404', margin: 0, fontSize: '0.9rem' }}>
              <strong>Can't find the email?</strong> Check your spam/junk folder or contact support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Regular signup form
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
        maxWidth: '500px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🇰🇪</div>
          <h1 style={{ 
            color: '#2c3e50', 
            marginTop: '0.5rem', 
            fontSize: '2rem',
            marginBottom: '0.5rem'
          }}>
            Join CultureLink Kenya
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Create your account to explore Kenyan culture
          </p>
        </div>

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
            <span style={{ fontSize: '1.2rem' }}></span>
            <span><strong>Error:</strong> {error}</span>
          </div>
        )}

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
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 'bold',
              color: '#2c3e50',
              fontSize: '1rem'
            }}>
               Full Name
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Enter your full name"
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
            <small style={{ color: '#666', fontSize: '0.85rem' }}>
              This will be your display name on CultureLink
            </small>
          </div>

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
            <small style={{ color: '#666', fontSize: '0.85rem' }}>
              We'll send a verification email to this address
            </small>
          </div>

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
                placeholder="Create a strong password"
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
            <small style={{ color: '#666', fontSize: '0.85rem' }}>
              Must be at least 6 characters long
            </small>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 'bold',
              color: '#2c3e50',
              fontSize: '1rem'
            }}>
               Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <small style={{ color: '#e74c3c', fontSize: '0.85rem' }}>
                 Passwords do not match
              </small>
            )}
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <small style={{ color: '#27ae60', fontSize: '0.85rem' }}>
                 Passwords match
              </small>
            )}
          </div>

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
            {loading ? ' Creating Account...' : ' Create Account'}
          </button>
        </form>

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

        <button
          onClick={handleGoogleSignup}
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

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '0.5rem' }}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: '#e67e22', 
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;