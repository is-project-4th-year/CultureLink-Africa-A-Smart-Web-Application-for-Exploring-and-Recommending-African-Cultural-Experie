// src/components/Auth/ForgotPassword.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ResetPassword } from '../../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    try {
      const result = await ResetPassword(email);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(result.message);
        setEmailSent(true);
      }
    } catch (error) {
      setError('Failed to send password reset email');
    }

    setLoading(false);
  };

  const handleResendEmail = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await ResetPassword(email);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Password reset email sent again! Please check your inbox.');
      }
    } catch (error) {
      setError('Failed to resend password reset email');
    }

    setLoading(false);
  };

  // Success screen after email is sent
  if (emailSent) {
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
          {/* Success Icon */}
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📧</div>
          
          <h1 style={{ 
            color: '#27ae60', 
            marginBottom: '1rem',
            fontSize: '1.8rem'
          }}>
            Password Reset Email Sent!
          </h1>
          
          <p style={{ 
            color: '#2c3e50', 
            marginBottom: '1.5rem',
            fontSize: '1.1rem',
            lineHeight: '1.5'
          }}>
            We've sent a password reset link to:
            <br />
            <strong style={{ color: '#e67e22' }}>{email}</strong>
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
              <li>Click the password reset link in the email</li>
              <li>Create a new password</li>
              <li>Return here and log in with your new password</li>
            </ol>
          </div>

          {success && (
            <div style={{
              background: '#d4edda',
              color: '#155724',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              border: '1px solid #c3e6cb'
            }}>
              {success}
            </div>
          )}

          {error && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              border: '1px solid #fcc'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={handleResendEmail}
              disabled={loading}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                marginRight: '1rem'
              }}
            >
              {loading ? '📧 Sending...' : '📧 Resend Email'}
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
              <strong>Can't find the email?</strong> Check your spam/junk folder. The email may take a few minutes to arrive.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Password reset form
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
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔑</div>
          <h1 style={{ 
            color: '#2c3e50', 
            marginTop: '0.5rem', 
            fontSize: '2rem',
            marginBottom: '0.5rem'
          }}>
            Reset Your Password
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.5' }}>
            Enter your email address and we'll send you a link to reset your password
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
            textAlign: 'center',
            border: '1px solid #fcc'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Reset Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 'bold',
              color: '#2c3e50',
              fontSize: '1rem'
            }}>
              📧 Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              We'll send a password reset link to this email
            </small>
          </div>

          {/* Send Reset Email Button */}
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
              marginBottom: '2rem',
              transition: 'background-color 0.3s'
            }}
          >
            {loading ? '📧 Sending Reset Link...' : '📧 Send Reset Link'}
          </button>
        </form>

        {/* Back to Login */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '0.5rem' }}>
            Remember your password?{' '}
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
          <p style={{ color: '#666' }}>
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              style={{ 
                color: '#3498db', 
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Create one here
            </Link>
          </p>
        </div>

        {/* Info Box */}
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem',
          backgroundColor: '#e8f4fd',
          border: '1px solid #bee5eb',
          borderRadius: '0.5rem'
        }}>
          <p style={{ color: '#0c5460', margin: 0, fontSize: '0.9rem' }}>
            <strong>Security Note:</strong> For your security, password reset links expire after 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;