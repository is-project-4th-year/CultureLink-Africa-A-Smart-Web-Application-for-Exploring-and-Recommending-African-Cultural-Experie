// src/pages/Blog/EditPost.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getBlogPostById, updateBlogPost, uploadBlogImage } from '../../services/blogService';
import { ArrowLeft, Save, Image as ImageIcon, X } from 'lucide-react';
import './CreatePost.css';

const EditPost = () => {
  const { postId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tribe: '',
    imageURL: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const kenyanTribes = [
    'Kikuyu', 'Luhya', 'Kalenjin', 'Luo', 'Kamba',
    'Kisii', 'Meru', 'Mijikenda', 'Maasai', 'Turkana',
    'Embu', 'Taita', 'Somali', 'Samburu', 'Pokot', 'Other'
  ];

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    setLoading(true);
    const { post, error: fetchError } = await getBlogPostById(postId);
    
    if (fetchError || !post) {
      setError(fetchError || 'Post not found');
      setLoading(false);
      return;
    }

    if (!currentUser || currentUser.uid !== post.authorId) {
      navigate(`/blog/${postId}`);
      return;
    }

    setFormData({
      title: post.title,
      content: post.content,
      tribe: post.tribe,
      imageURL: post.imageURL || ''
    });

    if (post.imageURL) {
      setImagePreview(post.imageURL);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    setError('');
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, imageURL: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!formData.content.trim()) {
      setError('Please enter content');
      return;
    }

    if (!formData.tribe) {
      setError('Please select a tribe/culture');
      return;
    }

    if (formData.content.trim().length < 50) {
      setError('Content must be at least 50 characters');
      return;
    }

    setSaving(true);

    let imageURL = formData.imageURL;

    // Upload new image if one was selected
    if (imageFile) {
      setUploadingImage(true);
      const { imageURL: uploadedURL, error: uploadError } = await uploadBlogImage(imageFile, postId);
      
      if (uploadError) {
        setError('Failed to upload new image');
        setSaving(false);
        setUploadingImage(false);
        return;
      }
      imageURL = uploadedURL;
      setUploadingImage(false);
    }

    const { error: updateError } = await updateBlogPost(postId, {
      ...formData,
      imageURL
    });

    if (updateError) {
      setError(updateError);
      setSaving(false);
    } else {
      navigate(`/blog/${postId}`);
    }
  };

  if (loading) {
    return (
      <div className="create-post-container">
        <div className="loading-spinner">Loading post...</div>
      </div>
    );
  }

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="create-post-container">
      <div className="create-post-content">
        <button 
          onClick={() => navigate(`/blog/${postId}`)}
          className="back-btn"
        >
          <ArrowLeft size={20} />
          Back to Post
        </button>

        <div className="create-post-header">
          <h1>Edit Your Post</h1>
          <p>Update your cultural story</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="title">Post Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a catchy title for your post"
              maxLength={100}
              required
            />
            <small className="char-count">{formData.title.length}/100</small>
          </div>

          <div className="form-group">
            <label htmlFor="tribe">Tribe/Culture</label>
            <select
              id="tribe"
              name="tribe"
              value={formData.tribe}
              onChange={handleChange}
              required
            >
              <option value="">Select a tribe or culture</option>
              {kenyanTribes.map(tribe => (
                <option key={tribe} value={tribe}>{tribe}</option>
              ))}
            </select>
          </div>

          {/* Image Upload/Edit */}
          <div className="form-group">
            <label>Featured Image</label>
            {!imagePreview ? (
              <div className="image-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="image-upload-label">
                  <ImageIcon size={32} />
                  <span>Click to upload an image</span>
                  <small>Max size: 5MB</small>
                </label>
              </div>
            ) : (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Preview" className="image-preview" />
                <div className="image-actions">
                  <label htmlFor="image-upload" className="change-image-btn">
                    <ImageIcon size={18} />
                    Change Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="remove-image-btn"
                  >
                    <X size={18} />
                    Remove Image
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="content">Your Story</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Share your experience, what you learned, interesting facts, or cultural insights..."
              rows={12}
              required
            />
            <small className="char-count">{formData.content.length} characters (minimum 50)</small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(`/blog/${postId}`)}
              className="cancel-btn"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={saving || uploadingImage}
            >
              <Save size={20} />
              {saving ? 'Saving...' : uploadingImage ? 'Uploading Image...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;