// src/components/UserProfile/profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserDocument, updateUserPreferences } from '../../services/authService';
import { auth } from '../../firebase/config';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { User, Mail, Calendar, Edit2, Save, X, Lock, Award, Bookmark, CheckCircle } from 'lucide-react';
import './profile.css';

import { uploadProfilePicture } from '../../services/authService';
import { Upload } from 'lucide-react';

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = React.useRef(null);
  
  // Password change states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const [editedPreferences, setEditedPreferences] = useState({
    favoriteTribes: [],
    interests: [],
    experienceLevel: 'beginner'
  });

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState({
    articles: [],
    events: [],
    tribes: []
  });

  // Achievements
  const achievements = [
    { id: 'profile_complete', name: 'Profile Complete', description: 'Complete your profile information', icon: CheckCircle, earned: false },
    { id: 'culture_explorer', name: 'Culture Explorer', description: 'Explore 5 different tribes', icon: Award, earned: false },
    { id: 'first_steps', name: 'First Steps', description: 'Join CultureLink Kenya', icon: Award, earned: true }
  ];

  const kenyanTribes = [
    'Kikuyu', 'Luhya', 'Kalenjin', 'Luo', 'Kamba',
    'Kisii', 'Meru', 'Mijikenda', 'Maasai', 'Turkana',
    'Embu', 'Taita', 'Somali', 'Samburu', 'Pokot'
  ];

  const interestOptions = [
    'Traditional Music', 'Dance', 'Food & Cuisine', 'Art & Crafts',
    'History', 'Language', 'Festivals', 'Traditional Clothing',
    'Stories & Folklore', 'Architecture'
  ];

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    loadUserData();
  }, [currentUser, navigate]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const data = await getUserDocument(currentUser.uid);
      setUserData(data);
      if (data?.culturalPreferences) {
        setEditedPreferences(data.culturalPreferences);
      }
      if (data?.bookmarks) {
        setBookmarks(data.bookmarks);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = () => {
    let completion = 0;
    
    // Basic info (20%)
    if (currentUser.displayName) completion += 10;
    if (currentUser.email) completion += 10;
    
    // Cultural preferences (30%)
    if (editedPreferences.favoriteTribes.length > 0) completion += 15;
    if (editedPreferences.interests.length > 0) completion += 15;
    
    // Profile picture (15%)
    if (currentUser.photoURL) completion += 15;
    
    // Experience level (10%)
    if (editedPreferences.experienceLevel) completion += 10;
    
    // Account verified (15%)
    if (currentUser.emailVerified) completion += 15;
    
    return completion;
  };

  const handleToggleTribe = (tribe) => {
    setEditedPreferences(prev => ({
      ...prev,
      favoriteTribes: prev.favoriteTribes.includes(tribe)
        ? prev.favoriteTribes.filter(t => t !== tribe)
        : [...prev.favoriteTribes, tribe]
    }));
  };

  const handleToggleInterest = (interest) => {
    setEditedPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    const { error: updateError, message } = await updateUserPreferences(
      currentUser.uid,
      editedPreferences
    );

    if (updateError) {
      setError(updateError);
    } else {
      setSuccess(message || 'Profile updated successfully');
      setEditing(false);
      await loadUserData();
    }

    setSaving(false);
  };

  const handleCancel = () => {
    if (userData?.culturalPreferences) {
      setEditedPreferences(userData.culturalPreferences);
    }
    setEditing(false);
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setPasswordLoading(false);
      return;
    }

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordData.currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update password
      await updatePassword(auth.currentUser, passwordData.newPassword);

      setSuccess('Password updated successfully');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Password change error:', error);
      if (error.code === 'auth/wrong-password') {
        setError('Current password is incorrect');
      } else if (error.code === 'auth/requires-recent-login') {
        setError('Please log out and log in again before changing password');
      } else {
        setError('Failed to change password. Please try again.');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    setError('Please select an image file');
    return;
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    setError('Image size must be less than 5MB');
    return;
  }
  
  setUploadingPhoto(true);
  setError('');
  setSuccess('');
  
  const { photoURL, error: uploadError, message } = await uploadProfilePicture(
    currentUser.uid,
    file
  );
  
  if (uploadError) {
    setError(uploadError);
  } else {
    setSuccess(message);
    // Reload user data to get updated photo
    await loadUserData();
    // Force refresh the currentUser
    await auth.currentUser.reload();
  }
  
  setUploadingPhoto(false);
};

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 10) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password) && /[^a-zA-Z\d]/.test(password)) strength += 25;
    
    let label = 'Weak';
    let color = '#e74c3c';
    
    if (strength >= 75) {
      label = 'Strong';
      color = '#27ae60';
    } else if (strength >= 50) {
      label = 'Medium';
      color = '#f39c12';
    }
    
    return { strength, label, color };
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Loading profile...</div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const profileCompletion = calculateProfileCompletion();
  const passwordStrength = getPasswordStrength(passwordData.newPassword);
  

  return (
    <div className="profile-container">
      <div className="profile-content">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-container">
  <div className="profile-avatar">
    {currentUser.photoURL ? (
      <img src={currentUser.photoURL} alt="Profile" />
    ) : (
      <div className="avatar-placeholder">
        {currentUser.displayName?.charAt(0) || 'U'}
      </div>
    )}
        </div>
        <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: 'none' }}
        />
        <button
            onClick={() => fileInputRef.current?.click()}
            className="upload-photo-btn"
            disabled={uploadingPhoto}
        >
            <Upload size={16} />
            {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
        </button>
        </div>
          <div className="profile-info">
            <h1>{currentUser.displayName || 'User'}</h1>
            <div className="profile-details">
              <span className="detail-item">
                <Mail size={16} />
                {currentUser.email}
              </span>
              {userData?.createdAt && (
                <span className="detail-item">
                  <Calendar size={16} />
                  Joined {new Date(userData.createdAt.seconds * 1000).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Completion Progress */}
        <div className="profile-section">
          <h2>Profile Completion</h2>
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
            <span className="progress-text">{profileCompletion}% Complete</span>
          </div>
          <div className="completion-tips">
            {profileCompletion < 100 && (
              <div className="tip-box">
                <strong>Tips to complete your profile:</strong>
                <ul>
                  {!currentUser.displayName && <li>Add your display name</li>}
                  {editedPreferences.favoriteTribes.length === 0 && <li>Select your favorite tribes</li>}
                  {editedPreferences.interests.length === 0 && <li>Choose your cultural interests</li>}
                  {!currentUser.photoURL && <li>Upload a profile picture</li>}
                  {!currentUser.emailVerified && <li>Verify your email address</li>}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div className="profile-section">
          <h2>Achievements</h2>
          <div className="achievements-grid">
            {achievements.map(achievement => (
              <div 
                key={achievement.id} 
                className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}
              >
                <achievement.icon size={32} />
                <h3>{achievement.name}</h3>
                <p>{achievement.description}</p>
                {achievement.earned && <span className="earned-badge">Earned</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="alert alert-error">
            <span>Warning:</span>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span>Success:</span>
            {success}
          </div>
        )}

        {/* Cultural Preferences Section */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Cultural Preferences</h2>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="edit-btn">
                <Edit2 size={18} />
                Edit Preferences
              </button>
            ) : (
              <div className="edit-actions">
                <button onClick={handleSave} disabled={saving} className="save-btn">
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={handleCancel} disabled={saving} className="cancel-btn">
                  <X size={18} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Experience Level */}
          <div className="preference-group">
            <label>Experience Level</label>
            {editing ? (
              <select
                value={editedPreferences.experienceLevel}
                onChange={(e) => setEditedPreferences(prev => ({
                  ...prev,
                  experienceLevel: e.target.value
                }))}
                className="experience-select"
              >
                <option value="beginner">Beginner - Just starting to learn</option>
                <option value="intermediate">Intermediate - Some knowledge</option>
                <option value="expert">Expert - Deep cultural knowledge</option>
              </select>
            ) : (
              <div className="experience-badge">
                {editedPreferences.experienceLevel.charAt(0).toUpperCase() + 
                 editedPreferences.experienceLevel.slice(1)}
              </div>
            )}
          </div>

          {/* Favorite Tribes */}
          <div className="preference-group">
            <label>Favorite Kenyan Tribes</label>
            <div className="tags-container">
              {editing ? (
                kenyanTribes.map(tribe => (
                  <button
                    key={tribe}
                    onClick={() => handleToggleTribe(tribe)}
                    className={`tag ${editedPreferences.favoriteTribes.includes(tribe) ? 'tag-selected' : ''}`}
                  >
                    {tribe}
                  </button>
                ))
              ) : (
                editedPreferences.favoriteTribes.length > 0 ? (
                  editedPreferences.favoriteTribes.map(tribe => (
                    <span key={tribe} className="tag tag-selected">{tribe}</span>
                  ))
                ) : (
                  <p className="no-data">No tribes selected yet</p>
                )
              )}
            </div>
          </div>

          {/* Interests */}
          <div className="preference-group">
            <label>Cultural Interests</label>
            <div className="tags-container">
              {editing ? (
                interestOptions.map(interest => (
                  <button
                    key={interest}
                    onClick={() => handleToggleInterest(interest)}
                    className={`tag ${editedPreferences.interests.includes(interest) ? 'tag-selected' : ''}`}
                  >
                    {interest}
                  </button>
                ))
              ) : (
                editedPreferences.interests.length > 0 ? (
                  editedPreferences.interests.map(interest => (
                    <span key={interest} className="tag tag-selected">{interest}</span>
                  ))
                ) : (
                  <p className="no-data">No interests selected yet</p>
                )
              )}
            </div>
          </div>
        </div>

        {/* Bookmarked Content */}
        <div className="profile-section">
          <h2>
            <Bookmark size={20} />
            Saved Content
          </h2>
          <div className="bookmarks-grid">
            <div className="bookmark-category">
              <h3>Articles</h3>
              <p className="bookmark-count">{bookmarks.articles?.length || 0} saved</p>
            </div>
            <div className="bookmark-category">
              <h3>Events</h3>
              <p className="bookmark-count">{bookmarks.events?.length || 0} saved</p>
            </div>
            <div className="bookmark-category">
              <h3>Tribes</h3>
              <p className="bookmark-count">{bookmarks.tribes?.length || 0} saved</p>
            </div>
          </div>
        </div>

        {/* Account Information & Security */}
        <div className="profile-section">
          <h2>Account Information & Security</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Email Verified</label>
              <span className={currentUser.emailVerified ? 'verified' : 'not-verified'}>
                {currentUser.emailVerified ? 'Verified' : 'Not Verified'}
              </span>
            </div>
            <div className="info-item">
              <label>Account Provider</label>
              <span>{currentUser.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Email/Password'}</span>
            </div>
          </div>
          
          {currentUser.providerData[0]?.providerId !== 'google.com' && (
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="change-password-btn"
            >
              <Lock size={18} />
              Change Password
            </button>
          )}
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Password</h2>
              <button 
                className="modal-close"
                onClick={() => setShowPasswordModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    currentPassword: e.target.value
                  }))}
                  required
                  placeholder="Enter current password"
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    newPassword: e.target.value
                  }))}
                  required
                  placeholder="Enter new password (min 6 characters)"
                />
                {passwordData.newPassword && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill"
                        style={{ 
                          width: `${passwordStrength.strength}%`,
                          backgroundColor: passwordStrength.color
                        }}
                      ></div>
                    </div>
                    <span style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    confirmPassword: e.target.value
                  }))}
                  required
                  placeholder="Confirm new password"
                />
                {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                  <small className="error-text">Passwords do not match</small>
                )}
              </div>

              <div className="modal-actions">
                <button 
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="cancel-btn"
                  disabled={passwordLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="save-btn"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};



export default Profile;