// src/pages/Blog/ViewPost.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  getBlogPostById, 
  deleteBlogPost, 
  incrementPostViews,
  likeBlogPost,
  unlikeBlogPost,
  saveBlogPost,
  unsaveBlogPost
} from '../../services/blogService';
import { getUserDocument } from '../../services/authService';
import { ArrowLeft, Edit, Trash2, Calendar, User, Eye, Heart, Bookmark, X } from 'lucide-react';
import './ViewPost.css';

const ViewPost = () => {
  const { postId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [liking, setLiking] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPost();
  }, [postId]);

  useEffect(() => {
    if (currentUser && post) {
      checkUserInteractions();
    }
  }, [currentUser, post]);

  const loadPost = async () => {
    setLoading(true);
    const { post: fetchedPost, error: fetchError } = await getBlogPostById(postId);
    
    if (fetchError) {
      setError(fetchError);
    } else {
      setPost(fetchedPost);
      await incrementPostViews(postId);
    }
    
    setLoading(false);
  };

  const checkUserInteractions = async () => {
    const userData = await getUserDocument(currentUser.uid);
    if (userData) {
      setIsLiked(userData.likedPosts?.includes(postId) || false);
      setIsSaved(userData.savedPosts?.includes(postId) || false);
    }
  };

  const handleEdit = () => {
    navigate(`/blog/edit/${postId}`);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error: deleteError } = await deleteBlogPost(postId);
    
    if (deleteError) {
      setError(deleteError);
      setDeleting(false);
    } else {
      navigate('/blog');
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setLiking(true);
    
    if (isLiked) {
      await unlikeBlogPost(postId, currentUser.uid);
      setIsLiked(false);
      setPost(prev => ({ ...prev, likes: (prev.likes || 1) - 1 }));
    } else {
      await likeBlogPost(postId, currentUser.uid);
      setIsLiked(true);
      setPost(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
    }
    
    setLiking(false);
  };

  const handleSave = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setSaving(true);
    
    if (isSaved) {
      await unsaveBlogPost(postId, currentUser.uid);
      setIsSaved(false);
    } else {
      await saveBlogPost(postId, currentUser.uid);
      setIsSaved(true);
    }
    
    setSaving(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isAuthor = currentUser && post && currentUser.uid === post.authorId;

  if (loading) {
    return (
      <div className="view-post-container">
        <div className="loading-spinner">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="view-post-container">
        <div className="error-container">
          <h2>Post not found</h2>
          <p>{error || 'This post may have been deleted'}</p>
          <button onClick={() => navigate('/blog')} className="back-btn">
            <ArrowLeft size={20} />
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-post-container">
      <div className="view-post-content">
        <button 
          onClick={() => navigate('/blog')}
          className="back-btn"
        >
          <ArrowLeft size={20} />
          Back to Blog
        </button>

        <article className="post-article">
          <div className="post-tribe-badge">{post.tribe}</div>
          
          <h1 className="post-title">{post.title}</h1>
          
          {post.imageURL && (
            <div className="post-featured-image">
              <img src={post.imageURL} alt={post.title} />
            </div>
          )}

          <div className="post-meta-bar">
            <div className="meta-left">
              <div className="meta-item">
                <User size={18} />
                <span>{post.authorName}</span>
              </div>
              <div className="meta-item">
                <Calendar size={16} />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="meta-item">
                <Eye size={16} />
                <span>{post.views || 0} views</span>
              </div>
            </div>

            <div className="post-actions-container">
              {isAuthor && (
                <div className="post-actions">
                  <button onClick={handleEdit} className="edit-btn">
                    <Edit size={18} />
                    Edit
                  </button>
                  <button onClick={() => setShowDeleteModal(true)} className="delete-btn">
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              )}

              {currentUser && !isAuthor && (
                <div className="post-interaction">
                  <button onClick={handleLike} className="like-btn" disabled={liking}>
                    <Heart size={18} fill={isLiked ? '#ce1126' : 'none'} color={isLiked ? '#ce1126' : '#666'} />
                    {isLiked ? 'Liked' : 'Like'}
                  </button>
                  <button onClick={handleSave} className="save-btn" disabled={saving}>
                    <Bookmark size={18} fill={isSaved ? '#006600' : 'none'} color={isSaved ? '#006600' : '#666'} />
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="post-content">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {post.updatedAt && post.updatedAt !== post.createdAt && (
            <div className="post-updated">
              Last updated: {formatDate(post.updatedAt)}
            </div>
          )}
        </article>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Post</h2>
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="cancel-btn"
                disabled={deleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="confirm-delete-btn"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPost;