import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [countUp, setCountUp] = useState({ tribes: 0, languages: 0, ceremonies: 0 });

  // Rotating "Did You Know?" facts
  const culturalFacts = [
    {
      title: "15+ Major Tribes",
      description: "Kenya's cultural diversity includes Kikuyu, Maasai, Luo, Kalenjin, Kamba, Luhya, Kisii, Meru, and many more communities, each with unique traditions."
    },
    {
      title: "60+ Languages",
      description: "Kenya has over 60 indigenous languages, with Swahili and English as official languages, creating a rich linguistic tapestry."
    },
    {
      title: "Rich Ceremonies",
      description: "From Maasai coming-of-age rituals to Kikuyu harvest festivals, Kenya's ceremonies mark life's important moments across generations."
    },
    {
      title: "Ancient Traditions",
      description: "Many Kenyan customs date back thousands of years, passed down through oral traditions and sacred rituals that continue today."
    },
    {
      title: "Diverse Cuisines",
      description: "Each tribe has unique culinary traditions - from Luo's fish delicacies to Kikuyu's irio and Maasai's traditional milk and meat diet."
    },
    {
      title: "World-Class Artisans",
      description: "Kenyan tribes are renowned for their crafts - Kisii soapstone, Kamba wood carvings, Maasai beadwork, and Turkana jewelry."
    }
  ];

  // Rotating featured tribes
  const featuredTribes = [
    {
      name: "Maasai",
      fact: "The Maasai are one of the most recognizable tribes, known for their distinctive red shukas and jumping dance (adumu).",
      color: "#ce1126"
    },
    {
      name: "Kikuyu",
      fact: "Kenya's largest ethnic group, the Kikuyu are skilled farmers who traditionally worship at Mount Kenya.",
      color: "#8B4513"
    },
    {
      name: "Luo",
      fact: "The Luo people from Lake Victoria are famous for their fishing culture and rich musical traditions.",
      color: "#3498db"
    },
    {
      name: "Kalenjin",
      fact: "Kalenjin athletes dominate long-distance running, producing more world champions than any other community.",
      color: "#f39c12"
    }
  ];

  const [currentTribeIndex, setCurrentTribeIndex] = useState(0);

  // Rotate facts every 5 seconds
  useEffect(() => {
    const factTimer = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % culturalFacts.length);
    }, 5000);

    return () => clearInterval(factTimer);
  }, [culturalFacts.length]);

  // Rotate featured tribes every 6 seconds
  useEffect(() => {
    const tribeTimer = setInterval(() => {
      setCurrentTribeIndex((prev) => (prev + 1) % featuredTribes.length);
    }, 6000);

    return () => clearInterval(tribeTimer);
  }, [featuredTribes.length]);

  // Animated counter effect
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const frameRate = 60;
    const totalFrames = (duration / 1000) * frameRate;
    const tribesTarget = 15;
    const languagesTarget = 60;
    const ceremoniesTarget = 342;

    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      
      setCountUp({
        tribes: Math.floor(tribesTarget * progress),
        languages: Math.floor(languagesTarget * progress),
        ceremonies: Math.floor(ceremoniesTarget * progress)
      });

      if (frame === totalFrames) {
        clearInterval(counter);
        setCountUp({
          tribes: tribesTarget,
          languages: languagesTarget,
          ceremonies: ceremoniesTarget
        });
      }
    }, 1000 / frameRate);

    return () => clearInterval(counter);
  }, []);

  const handleStartExploring = () => {
    navigate('/explore');
  };

  const handleStartChatting = () => {
    navigate('/chat');
  };

  const handleExploreGuide = () => {
    navigate('/explore');
  };

  const currentFact = culturalFacts[currentFactIndex];
  const currentTribe = featuredTribes[currentTribeIndex];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Welcome to CultureLink Kenya</h1>
            <p>Discover the rich heritage and vibrant cultures of Kenya's diverse communities. From the highlands to the coast, explore traditions that have shaped our nation for generations.</p>
            <p className="hero-subtitle">Experience authentic Kenyan culture through the eyes of the Kikuyu, Maasai, Luo, Kalenjin, and Kamba communities.</p>
            <button className="cta-button" onClick={handleStartExploring}>
              Explore Kenya's Cultures
            </button>
          </div>
        </div>
        <div className="scroll-indicator"></div>
      </section>

      {/* Animated Stats Counter */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{countUp.tribes}+</div>
              <div className="stat-label">Major Tribes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{countUp.languages}+</div>
              <div className="stat-label">Indigenous Languages</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{countUp.ceremonies}+</div>
              <div className="stat-label">Cultural Facts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tribe Spotlight - Rotating */}
      <section className="tribe-spotlight">
        <div className="container">
          <h2>Tribe Spotlight</h2>
          <div 
            className="spotlight-card" 
            style={{ borderColor: currentTribe.color }}
            key={currentTribeIndex}
          >
            <div className="spotlight-header" style={{ color: currentTribe.color }}>
              {currentTribe.name} People
            </div>
            <p className="spotlight-fact">{currentTribe.fact}</p>
            <button 
              className="spotlight-btn" 
              style={{ backgroundColor: currentTribe.color }}
              onClick={handleStartExploring}
            >
              Learn More About {currentTribe.name}
            </button>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-section">
        <div className="container">
          <h2>Celebrating Kenya's Cultural Diversity</h2>
          <p>CultureLink Kenya connects you to the authentic traditions, languages, foods, and customs of Kenya's major ethnic communities. We preserve and share the cultural wealth that makes Kenya unique.</p>
          <p>Join us in exploring the ceremonies, arts, cuisines, and stories that define Kenyan identity from Mount Kenya to Lake Victoria.</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="container">
          <h2>Explore Kenya's Cultural Heritage</h2>
          <div className="features-grid">
            
            <div className="feature-card">
              <img 
                src="/images/African Market.jpg" 
                alt="Traditional Arts & Crafts" 
                className="card-image"
              />
              <div className="card-content">
                <h3>Traditional Arts & Crafts</h3>
                <p>Discover Kikuyu pottery, Maasai beadwork, Luo fishing traditions, and Kalenjin metalwork that represent centuries of Kenyan craftsmanship.</p>
                <button className="read-more" onClick={handleStartExploring}>
                  Learn More
                </button>
              </div>
            </div>

            <div className="feature-card">
              <img 
                src="/images/Chatbot2.jpg" 
                alt="Cultural AI Assistant" 
                className="card-image"
              />
              <div className="card-content">
                <h3>Cultural AI Assistant</h3>
                <p>Ask our AI about Kenyan tribal traditions, languages, foods, ceremonies, and customs. Get instant answers about authentic Kenyan culture.</p>
                <button className="read-more" onClick={handleStartChatting}>
                  Start Cultural Chat
                </button>
              </div>
            </div>

            <div className="feature-card">
              <img 
                src="/images/Maasai.jpeg" 
                alt="Kenyan Culture Guide" 
                className="card-image"
              />
              <div className="card-content">
                <h3>Kenyan Culture Guide</h3>
                <p>Plan your cultural journey across Kenya. Discover where to experience authentic tribal ceremonies, traditional foods, and cultural sites.</p>
                <button className="read-more" onClick={handleExploreGuide}>
                  Explore Kenya
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Rotating "Did You Know?" Facts */}
      <section className="cultural-facts-section">
        <div className="container">
          <h2>Did You Know?</h2>
          <div className="facts-carousel">
            <div className="fact-card-large" key={currentFactIndex}>
              <div className="fact-icon">💡</div>
              <h3>{currentFact.title}</h3>
              <p>{currentFact.description}</p>
              <div className="fact-dots">
                {culturalFacts.map((_, index) => (
                  <span 
                    key={index} 
                    className={`dot ${index === currentFactIndex ? 'active' : ''}`}
                    onClick={() => setCurrentFactIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2>Start Your Cultural Journey Today</h2>
          <p>Explore 15+ tribes, learn indigenous languages, and discover authentic Kenyan traditions</p>
          <div className="cta-buttons">
            <button className="cta-primary" onClick={handleStartExploring}>
              Explore Cultures
            </button>
            <button className="cta-secondary" onClick={handleStartChatting}>
              Ask AI Assistant
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>CultureLink Kenya</h4>
              <p>Your gateway to authentic Kenyan traditions and heritage.</p>
            </div>
            <div className="footer-section">
              <h4>Cultural Communities</h4>
              <ul>
                <li><a href="/explore?tribe=kikuyu">Kikuyu Culture</a></li>
                <li><a href="/explore?tribe=maasai">Maasai Heritage</a></li>
                <li><a href="/explore?tribe=luo">Luo Traditions</a></li>
                <li><a href="/explore?tribe=kalenjin">Kalenjin Customs</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact Us</h4>
              <p>Email: info@culturelinkenya.com</p>
              <p>Phone: +254 700 123456</p>
              <p>Nairobi, Kenya</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 CultureLink Kenya. Celebrating our heritage.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;