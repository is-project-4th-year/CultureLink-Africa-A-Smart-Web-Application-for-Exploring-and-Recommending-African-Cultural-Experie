// src/services/blogService.js
import { arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

// Upload blog post image
export const uploadBlogImage = async (file, postId) => {
  if (!file) return { error: 'No file provided' };
  
  try {
    // Create a reference to the storage location
    const storageRef = ref(storage, `blog-images/${postId}-${Date.now()}`);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const imageURL = await getDownloadURL(storageRef);
    
    return { 
      imageURL,
      error: null
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { 
      imageURL: null,
      error: 'Failed to upload image'
    };
  }
};

// Create a new blog post
export const createBlogPost = async (postData, userId, userName) => {
  try {
    const blogPost = {
      ...postData,
      authorId: userId,
      authorName: userName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likes: 0,
      views: 0
    };

    const docRef = await addDoc(collection(db, 'blogPosts'), blogPost);
    
    return {
      id: docRef.id,
      error: null,
      message: 'Blog post created successfully!'
    };
  } catch (error) {
    console.error('Error creating blog post:', error);
    return {
      id: null,
      error: 'Failed to create blog post',
      code: error.code
    };
  }
};

// Get all blog posts
export const getAllBlogPosts = async () => {
  try {
    const q = query(
      collection(db, 'blogPosts'), 
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { posts, error: null };
  } catch (error) {
    console.error('Error getting blog posts:', error);
    return {
      posts: [],
      error: 'Failed to load blog posts'
    };
  }
};

// Get single blog post by ID
export const getBlogPostById = async (postId) => {
  try {
    const docRef = doc(db, 'blogPosts', postId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        post: { id: docSnap.id, ...docSnap.data() },
        error: null
      };
    } else {
      return {
        post: null,
        error: 'Blog post not found'
      };
    }
  } catch (error) {
    console.error('Error getting blog post:', error);
    return {
      post: null,
      error: 'Failed to load blog post'
    };
  }
};

// Get blog posts by user
export const getBlogPostsByUser = async (userId) => {
  try {
    const q = query(
      collection(db, 'blogPosts'),
      where('authorId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { posts, error: null };
  } catch (error) {
    console.error('Error getting user blog posts:', error);
    return {
      posts: [],
      error: 'Failed to load user posts'
    };
  }
};

// Get blog posts by tribe/category
export const getBlogPostsByTribe = async (tribe) => {
  try {
    const q = query(
      collection(db, 'blogPosts'),
      where('tribe', '==', tribe),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { posts, error: null };
  } catch (error) {
    console.error('Error getting tribe blog posts:', error);
    return {
      posts: [],
      error: 'Failed to load posts'
    };
  }
};

// Update blog post
export const updateBlogPost = async (postId, updatedData) => {
  try {
    const postRef = doc(db, 'blogPosts', postId);
    
    await updateDoc(postRef, {
      ...updatedData,
      updatedAt: serverTimestamp()
    });
    
    return {
      error: null,
      message: 'Blog post updated successfully!'
    };
  } catch (error) {
    console.error('Error updating blog post:', error);
    return {
      error: 'Failed to update blog post',
      code: error.code
    };
  }
};

// Delete blog post
export const deleteBlogPost = async (postId) => {
  try {
    await deleteDoc(doc(db, 'blogPosts', postId));
    
    return {
      error: null,
      message: 'Blog post deleted successfully!'
    };
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return {
      error: 'Failed to delete blog post',
      code: error.code
    };
  }
};

// Increment post views
export const incrementPostViews = async (postId) => {
  try {
    const postRef = doc(db, 'blogPosts', postId);
    const postSnap = await getDoc(postRef);
    
    if (postSnap.exists()) {
      const currentViews = postSnap.data().views || 0;
      await updateDoc(postRef, {
        views: currentViews + 1
      });
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error incrementing views:', error);
    return { error: 'Failed to update views' };
  }
  
};

// Like a blog post
export const likeBlogPost = async (postId, userId) => {
  try {
    const postRef = doc(db, 'blogPosts', postId);
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      likedPosts: arrayUnion(postId)
    });
    
    await updateDoc(postRef, {
      likes: increment(1),
      likedBy: arrayUnion(userId)
    });
    
    return { error: null, message: 'Post liked!' };
  } catch (error) {
    console.error('Error liking post:', error);
    return { error: 'Failed to like post' };
  }
};

// Unlike a blog post
export const unlikeBlogPost = async (postId, userId) => {
  try {
    const postRef = doc(db, 'blogPosts', postId);
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      likedPosts: arrayRemove(postId)
    });
    
    await updateDoc(postRef, {
      likes: increment(-1),
      likedBy: arrayRemove(userId)
    });
    
    return { error: null, message: 'Post unliked!' };
  } catch (error) {
    console.error('Error unliking post:', error);
    return { error: 'Failed to unlike post' };
  }
};

// Save a blog post
export const saveBlogPost = async (postId, userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      savedPosts: arrayUnion(postId)
    });
    
    return { error: null, message: 'Post saved!' };
  } catch (error) {
    console.error('Error saving post:', error);
    return { error: 'Failed to save post' };
  }
};

// Unsave a blog post
export const unsaveBlogPost = async (postId, userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      savedPosts: arrayRemove(postId)
    });
    
    return { error: null, message: 'Post removed from saved!' };
  } catch (error) {
    console.error('Error unsaving post:', error);
    return { error: 'Failed to unsave post' };
  }
};

// Get saved posts for a user
export const getSavedPosts = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists() || !userSnap.data().savedPosts) {
      return { posts: [], error: null };
    }
    
    const savedPostIds = userSnap.data().savedPosts;
    const posts = [];
    
    for (const postId of savedPostIds) {
      const postRef = doc(db, 'blogPosts', postId);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        posts.push({ id: postSnap.id, ...postSnap.data() });
      }
    }
    
    return { posts, error: null };
  } catch (error) {
    console.error('Error getting saved posts:', error);
    return { posts: [], error: 'Failed to load saved posts' };
  }
};