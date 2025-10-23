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
      description: 'The largest ethnic group in Kenya, known for their agricultural practices and entrepreneurial spirit.',
      categories: ['food', 'ceremonies', 'languages', 'arts']
    },
    {
      name: 'Maasai',
      population: '1.2 million',
      region: 'Southern Kenya & Northern Tanzania',
      highlights: ['Warrior traditions', 'Cattle herding', 'Distinctive dress', 'Age-set system'],
      description: 'Semi-nomadic pastoralists famous for their distinctive customs and dress, living near game parks.',
      categories: ['ceremonies', 'clothing', 'music', 'food']
    },
    {
      name: 'Luo',
      population: '4.4 million',
      region: 'Western Kenya (Lake Victoria)',
      highlights: ['Fishing culture', 'Oral traditions', 'Music and dance', 'Lakeside living'],
      description: 'Nilotic people known for their fishing culture, oral literature, and musical traditions.',
      categories: ['food', 'music', 'ceremonies', 'languages']
    },
    {
      name: 'Kalenjin',
      population: '5.3 million',
      region: 'Rift Valley',
      highlights: ['Running champions', 'Highland farming', 'Ceremonial traditions', 'Age-grade systems'],
      description: 'Highland people famous for producing world-class long-distance runners and rich ceremonial life.',
      categories: ['ceremonies', 'music', 'languages', 'food']
    },
    {
      name: 'Kamba',
      population: '4.6 million',
      region: 'Eastern Kenya',
      highlights: ['Wood carving', 'Trading culture', 'Traditional medicine', 'Storytelling'],
      description: 'Skilled artisans and traders known for wood carving, traditional medicine, and rich oral traditions.',
      categories: ['arts', 'music', 'languages', 'food']
    },
    {
      name: 'Luhya',
      population: '6.8 million',
      region: 'Western Kenya',
      highlights: ['Bullfighting traditions', 'Agriculture', 'Bukusu circumcision', 'Isukha pottery'],
      description: 'Kenya\'s second-largest ethnic group, consisting of 18 sub-tribes with diverse cultural practices and agricultural expertise.',
      categories: ['ceremonies', 'food', 'arts', 'music']
    },
    {
      name: 'Kisii',
      population: '2.7 million',
      region: 'Nyanza Province',
      highlights: ['Soapstone carving', 'Banana farming', 'Traditional medicine', 'Communal living'],
      description: 'Highland Bantu people renowned for their soapstone sculptures and agricultural prowess in the fertile Kisii highlands.',
      categories: ['arts', 'food', 'ceremonies', 'languages']
    },
    {
      name: 'Meru',
      population: '1.9 million',
      region: 'Mount Kenya Eastern Slopes',
      highlights: ['Miraa cultivation', 'Age-set systems', 'Council of elders', 'Traditional festivals'],
      description: 'Bantu-speaking people living on the slopes of Mount Kenya, known for miraa farming and strong traditional governance.',
      categories: ['food', 'ceremonies', 'languages', 'music']
    },
    {
      name: 'Mijikenda',
      population: '2.5 million',
      region: 'Coastal Kenya',
      highlights: ['Kaya sacred forests', 'Coconut farming', 'Swahili influence', 'Maritime traditions'],
      description: 'Coastal people comprising nine related tribes, guardians of sacred Kaya forests and rich coastal traditions.',
      categories: ['ceremonies', 'languages', 'food', 'arts']
    },
    {
      name: 'Turkana',
      population: '1.0 million',
      region: 'Northwestern Kenya',
      highlights: ['Pastoralism', 'Beadwork', 'Nomadic lifestyle', 'Lake Turkana culture'],
      description: 'Nilotic pastoralists of the arid northwest, known for their resilience, distinctive adornments, and nomadic traditions.',
      categories: ['clothing', 'ceremonies', 'arts', 'food']
    },
    {
      name: 'Embu',
      population: '608,000',
      region: 'Eastern Mount Kenya',
      highlights: ['Coffee cultivation', 'Traditional medicine', 'Njuri Ncheke council', 'Irrigation systems'],
      description: 'Bantu people from the southeastern slopes of Mount Kenya, skilled farmers with strong democratic traditions.',
      categories: ['food', 'ceremonies', 'languages', 'arts']
    },
    {
      name: 'Taita',
      population: '340,000',
      region: 'Taita-Taveta County',
      highlights: ['Terrace farming', 'Skull worship', 'Traditional irrigation', 'Mountain culture'],
      description: 'Bantu people of the Taita Hills, masters of terrace farming and guardians of unique highland traditions.',
      categories: ['food', 'ceremonies', 'languages', 'arts']
    },
    {
      name: 'Samburu',
      population: '310,000',
      region: 'Northern Kenya',
      highlights: ['Pastoralism', 'Warrior culture', 'Beaded jewelry', 'Close Maasai relations'],
      description: 'Nilotic pastoralists closely related to the Maasai, maintaining traditional semi-nomadic lifestyle in northern rangelands.',
      categories: ['clothing', 'ceremonies', 'arts', 'music']
    },
    {
      name: 'Pokot',
      population: '778,000',
      region: 'West Pokot & Baringo',
      highlights: ['Cattle herding', 'Irrigation expertise', 'Traditional ceremonies', 'Highland-lowland divide'],
      description: 'Nilotic people divided into highland farmers and lowland pastoralists, known for elaborate ceremonies and cattle culture.',
      categories: ['ceremonies', 'food', 'clothing', 'music']
    },
    {
      name: 'Tharaka',
      population: '175,000',
      region: 'Tharaka-Nithi County',
      highlights: ['Honey production', 'Basket weaving', 'Drought-resistant farming', 'Traditional governance'],
      description: 'Bantu people of the semi-arid eastern region, skilled in beekeeping and adapted to challenging environments.',
      categories: ['food', 'arts', 'ceremonies', 'languages']
    }
  ];

  const culturalCategories = [
    { id: 'food', name: 'Traditional Foods', count: 45 },
    { id: 'ceremonies', name: 'Ceremonies & Rituals', count: 32 },
    { id: 'arts', name: 'Arts & Crafts', count: 28 },
    { id: 'music', name: 'Music & Dance', count: 24 },
    { id: 'languages', name: 'Languages', count: 15 },
    { id: 'clothing', name: 'Traditional Clothing', count: 18 }
  ];

  // Filter tribes based on selected filters
  const filteredTribes = kenyanTribes.filter(tribe => {
    const matchesTribe = selectedTribe === 'all' || tribe.name.toLowerCase() === selectedTribe;
    const matchesCategory = selectedCategory === 'all' || tribe.categories.includes(selectedCategory);
    return matchesTribe && matchesCategory;
  });

  // Filter categories based on selected tribe
  const filteredCategories = selectedTribe === 'all' 
    ? culturalCategories 
    : culturalCategories.filter(cat => {
        const tribe = kenyanTribes.find(t => t.name.toLowerCase() === selectedTribe);
        return tribe ? tribe.categories.includes(cat.id) : true;
      });

  return (
    <div className="explore-page">
      <div className="container">
        <h1>Explore Kenyan Cultures</h1>
        <p>
          Discover the rich traditions, customs, and heritage of Kenya's diverse ethnic communities.
        </p>

        {/* Filters */}
        <div className="explore-filters">
          <div>
            <label>Tribe: </label>
            <select 
              value={selectedTribe} 
              onChange={(e) => setSelectedTribe(e.target.value)}
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
            <label>Category: </label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {culturalCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', color: '#CD853F', fontSize: '1.1rem', fontWeight: '600' }}>
          {selectedTribe !== 'all' || selectedCategory !== 'all' ? (
            <p>Showing {filteredTribes.length} {filteredTribes.length === 1 ? 'tribe' : 'tribes'}</p>
          ) : null}
        </div>

        {/* Cultural Categories Overview */}
        {(selectedTribe === 'all' && selectedCategory === 'all') && (
          <section className="cultural-categories-section">
            <h2>Cultural Categories</h2>
            <div className="categories-grid">
              {culturalCategories.map(category => (
                <div 
                  key={category.id} 
                  className="category-card"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <h3>{category.name}</h3>
                  <p>{category.count} cultural practices</p>
                  <button>
                    Explore {category.name}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Filtered Categories (when tribe is selected) */}
        {selectedTribe !== 'all' && selectedCategory === 'all' && (
          <section className="cultural-categories-section">
            <h2>{kenyanTribes.find(t => t.name.toLowerCase() === selectedTribe)?.name} Cultural Categories</h2>
            <div className="categories-grid">
              {filteredCategories.map(category => (
                <div 
                  key={category.id} 
                  className="category-card"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <h3>{category.name}</h3>
                  <p>{category.count} cultural practices</p>
                  <button>
                    Explore {category.name}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Kenyan Tribes Overview */}
        <section className="tribes-section">
          <h2>
            {selectedCategory !== 'all' && selectedTribe === 'all' 
              ? `Tribes with ${culturalCategories.find(c => c.id === selectedCategory)?.name}`
              : selectedCategory !== 'all' && selectedTribe !== 'all'
              ? `${kenyanTribes.find(t => t.name.toLowerCase() === selectedTribe)?.name} - ${culturalCategories.find(c => c.id === selectedCategory)?.name}`
              : selectedTribe !== 'all'
              ? `${kenyanTribes.find(t => t.name.toLowerCase() === selectedTribe)?.name} Culture`
              : 'Kenya\'s Cultural Communities'}
          </h2>

          {filteredTribes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
              <h3>No tribes found matching your filters</h3>
              <p>Try selecting different filter options</p>
              <button 
                onClick={() => {
                  setSelectedTribe('all');
                  setSelectedCategory('all');
                }}
                style={{
                  marginTop: '1rem',
                  padding: '0.8rem 2rem',
                  background: '#8B4513',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="tribes-grid">
              {filteredTribes.map(tribe => (
                <div key={tribe.name} className="tribe-card">
                  <h3>{tribe.name} People</h3>
                  <p><strong>Population:</strong> {tribe.population}</p>
                  <p><strong>Region:</strong> {tribe.region}</p>
                  <p>{tribe.description}</p>
                  
                  <div>
                    <h4>Cultural Highlights:</h4>
                    <ul>
                      {tribe.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <button>
                    Learn About {tribe.name} Culture
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Clear Filters Button (when filters are active) */}
        {(selectedTribe !== 'all' || selectedCategory !== 'all') && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button 
              onClick={() => {
                setSelectedTribe('all');
                setSelectedCategory('all');
              }}
              style={{
                padding: '1rem 2.5rem',
                background: 'linear-gradient(135deg, #8B4513, #6B3410)',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: '0 4px 15px rgba(139, 69, 19, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;