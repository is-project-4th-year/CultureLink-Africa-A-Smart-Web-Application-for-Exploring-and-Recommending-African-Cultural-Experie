

// src/pages/Explore.js
import React, { useState } from 'react';

const Explore = () => {
  const [selectedTribe, setSelectedTribe] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const kenyanTribes = [
    {
      name: 'Kikuyu',
      population: '8.1 million',
      region: 'Central Kenya',
      highlights: ['Mount Kenya traditions', 'Coffee farming culture', 'Gikuyu language', 'Traditional governance'],
      description: 'The largest ethnic group in Kenya, known for their agricultural practices and entrepreneurial spirit.'
    },
    {
      name: 'Maasai',
      population: '1.2 million',
      region: 'Southern Kenya & Northern Tanzania',
      highlights: ['Warrior traditions', 'Cattle herding', 'Distinctive dress', 'Age-set system'],
      description: 'Semi-nomadic pastoralists famous for their distinctive customs and dress, living near game parks.'
    },
    {
      name: 'Luo',
      population: '4.4 million',
      region: 'Western Kenya (Lake Victoria)',
      highlights: ['Fishing culture', 'Oral traditions', 'Music and dance', 'Lakeside living'],
      description: 'Nilotic people known for their fishing culture, oral literature, and musical traditions.'
    },
    {
      name: 'Kalenjin',
      population: '5.3 million',
      region: 'Rift Valley',
      highlights: ['Running champions', 'Highland farming', 'Ceremonial traditions', 'Age-grade systems'],
      description: 'Highland people famous for producing world-class long-distance runners and rich ceremonial life.'
    },
    {
      name: 'Kamba',
      population: '4.6 million',
      region: 'Eastern Kenya',
      highlights: ['Wood carving', 'Trading culture', 'Traditional medicine', 'Storytelling'],
      description: 'Skilled artisans and traders known for wood carving, traditional medicine, and rich oral traditions.'
    }
  ];

  const culturalCategories = [
    { id: 'food', name: '🍽️ Traditional Foods', count: 45 },
    { id: 'ceremonies', name: '🎭 Ceremonies & Rituals', count: 32 },
    { id: 'arts', name: '🎨 Arts & Crafts', count: 28 },
    { id: 'music', name: '🎵 Music & Dance', count: 24 },
    { id: 'languages', name: '🗣️ Languages', count: 15 },
    { id: 'clothing', name: '👘 Traditional Clothing', count: 18 }
  ];

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2c3e50' }}>
          Explore Kenyan Cultures
        </h1>
        <p style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem', color: '#666' }}>
          Discover the rich traditions, customs, and heritage of Kenya's diverse ethnic communities.
        </p>

        {/* Filters */}
        <div style={{ marginBottom: '3rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div>
            <label style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Tribe: </label>
            <select 
              value={selectedTribe} 
              onChange={(e) => setSelectedTribe(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ddd' }}
            >
              <option value="all">All Tribes</option>
              {kenyanTribes.map(tribe => (
                <option key={tribe.name.toLowerCase()} value={tribe.name.toLowerCase()}>
                  {tribe.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Category: </label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ddd' }}
            >
              <option value="all">All Categories</option>
              {culturalCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cultural Categories Overview */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '2rem' }}>Cultural Categories</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {culturalCategories.map(category => (
              <div key={category.id} style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0 0 1rem 0' }}>{category.name}</h3>
                <p style={{ margin: '0', color: '#666' }}>{category.count} cultural practices</p>
                <button style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#e67e22',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer'
                }}>
                  Explore {category.name.split(' ')[1]}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Kenyan Tribes Overview */}
        <section>
          <h2 style={{ marginBottom: '2rem' }}>Kenya's Cultural Communities</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
            {kenyanTribes.map(tribe => (
              <div key={tribe.name} style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>{tribe.name} People</h3>
                <p style={{ color: '#666', marginBottom: '1rem' }}><strong>Population:</strong> {tribe.population}</p>
                <p style={{ color: '#666', marginBottom: '1rem' }}><strong>Region:</strong> {tribe.region}</p>
                <p style={{ marginBottom: '1.5rem' }}>{tribe.description}</p>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>Cultural Highlights:</h4>
                  <ul style={{ margin: '0', paddingLeft: '1.5rem' }}>
                    {tribe.highlights.map((highlight, index) => (
                      <li key={index} style={{ marginBottom: '0.25rem' }}>{highlight}</li>
                    ))}
                  </ul>
                </div>
                
                <button style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  Learn About {tribe.name} Culture
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Explore;