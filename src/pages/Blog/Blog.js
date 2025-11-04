// src/pages/Blog/Blog.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllBlogPosts, getBlogPostsByTribe } from '../../services/blogService';
import { PenSquare, Calendar, User, Eye, Filter, Search } from 'lucide-react';
import './Blog.css';

const Blog = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTribe, setSelectedTribe] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const kenyanTribes = [
    'All', 'Kikuyu', 'Luhya', 'Kalenjin', 'Luo', 'Kamba',
    'Kisii', 'Meru', 'Mijikenda', 'Maasai', 'Turkana',
    'Embu', 'Taita', 'Somali', 'Samburu', 'Pokot', 'Other'
  ];

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, selectedTribe, searchQuery]);

  const loadPosts = async () => {
    setLoading(true);
    const { posts: fetchedPosts, error: fetchError } = await getAllBlogPosts();
    
    if (fetchError) {
      setError(fetchError);
    } else {
      setPosts(fetchedPosts);
    }
    
    setLoading(false);
  };

  const filterPosts = () => {
    let filtered = [...posts];

    // Filter by tribe
    if (selectedTribe !== 'All') {
      filtered = filtered.filter(post => post.tribe === selectedTribe);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.tribe.toLowerCase().includes(query)
      );
    }

    setFilteredPosts(filtered);
  };

  const handleCreatePost = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    navigate('/blog/create');
  };

  const handlePostClick = (postId) => {
    navigate(`/blog/${postId}`);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="blog-container">
        <div className="loading-spinner">Loading blog posts...</div>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <div className="blog-content">
        {/* Hero Section */}
        <div className="blog-hero">
          <h1>Cultural Stories & Experiences</h1>
          <p>Share your journey discovering Kenyan culture</p>
          <button onClick={handleCreatePost} className="create-post-btn">
            <PenSquare size={20} />
            Share Your Story
          </button>
        </div>

        {/* Filters and Search */}
        <div className="blog-filters">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="tribe-filter">
            <Filter size={18} />
            <select 
              value={selectedTribe} 
              onChange={(e) => setSelectedTribe(e.target.value)}
            >
              {kenyanTribes.map(tribe => (
                <option key={tribe} value={tribe}>{tribe}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="no-posts">
            <PenSquare size={48} />
            <h3>No posts found</h3>
            <p>Be the first to share your cultural experience!</p>
            <button onClick={handleCreatePost} className="create-post-btn-secondary">
              Create Post
            </button>
          </div>
        ) : (
          <div className="posts-grid">
            {filteredPosts.map(post => (
              <article 
                key={post.id} 
                className="post-card"
                onClick={() => handlePostClick(post.id)}
              >
                <div className="post-header">
                  <span className="post-tribe">{post.tribe}</span>
                  <div className="post-meta">
                    <span className="post-views">
                      <Eye size={14} />
                      {post.views || 0}
                    </span>
                  </div>
                </div>

                <h2 className="post-title">{post.title}</h2>
                <p className="post-excerpt">{truncateContent(post.content)}</p>

                <div className="post-footer">
                  <div className="post-author">
                    <User size={16} />
                    <span>{post.authorName}</span>
                  </div>
                  <div className="post-date">
                    <Calendar size={14} />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;