// src/pages/Blog/CreatePost.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createBlogPost, uploadBlogImage, updateBlogPost } from '../../services/blogService';
import { ArrowLeft, Save, Image as ImageIcon, X } from 'lucide-react';
import './CreatePost.css';

const CreatePost = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tribe: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const kenyanTribes = [
    'Kikuyu', 'Luhya', 'Kalenjin', 'Luo', 'Kamba',
    'Kisii', 'Meru', 'Mijikenda', 'Maasai', 'Turkana',
    'Embu', 'Taita', 'Somali', 'Samburu', 'Pokot', 'Other'
  ];

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

    setLoading(true);

    try {
      console.log('Step 1: Creating post...');
      
      const { id: postId, error: createError } = await createBlogPost(
        { ...formData, imageURL: '' },
        currentUser.uid,
        currentUser.displayName || 'Anonymous'
      );

      if (createError || !postId) {
        console.error('Create error:', createError);
        setError(createError || 'Failed to create post');
        setLoading(false);
        return;
      }

      console.log('Step 2: Post created with ID:', postId);

      if (imageFile) {
        console.log('Step 3: Uploading image...');
        setUploadingImage(true);
        
        const { imageURL: uploadedURL, error: uploadError } = await uploadBlogImage(imageFile, postId);
        
        console.log('Step 4: Upload result:', { uploadedURL, uploadError });
        
        if (uploadError) {
          console.error('Upload error:', uploadError);
          setError('Post created but image upload failed');
          setUploadingImage(false);
          setLoading(false);
          navigate(`/blog/${postId}`);
          return;
        }

        if (uploadedURL) {
          console.log('Step 5: Updating post with image URL:', uploadedURL);
          
          const { error: updateError } = await updateBlogPost(postId, { imageURL: uploadedURL });
          
          console.log('Step 6: Update result:', { updateError });
          
          if (updateError) {
            console.error('Update error:', updateError);
            setError('Post created and image uploaded, but failed to link them');
          } else {
            console.log('Success! Image URL saved to post');
          }
        }
        
        setUploadingImage(false);
      }

      console.log('Step 7: Navigating to post...');
      setLoading(false);
      navigate(`/blog/${postId}`);
      
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="create-post-container">
      <div className="create-post-content">
        <button 
          onClick={() => navigate('/blog')}
          className="back-btn"
        >
          <ArrowLeft size={20} />
          Back to Blog
        </button>

        <div className="create-post-header">
          <h1>Share Your Cultural Experience</h1>
          <p>Tell the community about your journey discovering Kenyan culture</p>
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

          <div className="form-group">
            <label>Featured Image (Optional)</label>
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
                <button
                  type="button"
                  onClick={removeImage}
                  className="remove-image-btn"
                >
                  <X size={20} />
                  Remove Image
                </button>
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
              onClick={() => navigate('/blog')}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading || uploadingImage}
            >
              <Save size={20} />
              {loading ? 'Publishing...' : uploadingImage ? 'Uploading Image...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;