import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleStartExploring = () => {
    navigate('/explore');
  };

  const handleStartChatting = () => {
    navigate('/chat');
  };

  const handleExploreGuide = () => {
    navigate('/explore');
  };

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
              <div className="card-image african-markets"></div>
              <div className="card-content">
                <h3>🏺 Traditional Arts & Crafts</h3>
                <p>Discover Kikuyu pottery, Maasai beadwork, Luo fishing traditions, and Kalenjin metalwork that represent centuries of Kenyan craftsmanship.</p>
                <button className="read-more" onClick={handleStartExploring}>
                  Learn More
                </button>
              </div>
            </div>

            <div className="feature-card">
              <div className="card-image cultural-chat"></div>
              <div className="card-content">
                <h3>💬 Cultural AI Assistant</h3>
                <p>Ask our AI about Kenyan tribal traditions, languages, foods, ceremonies, and customs. Get instant answers about authentic Kenyan culture.</p>
                <button className="read-more" onClick={handleStartChatting}>
                  Start Cultural Chat
                </button>
              </div>
            </div>

            <div className="feature-card">
              <div className="card-image travel-guide"></div>
              <div className="card-content">
                <h3>🗺️ Kenyan Culture Guide</h3>
                <p>Plan your cultural journey across Kenya. Discover where to experience authentic tribal ceremonies, traditional foods, and cultural sites.</p>
                <button className="read-more" onClick={handleExploreGuide}>
                  Explore Kenya
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Quick Cultural Facts */}
      <section className="cultural-facts-section">
        <div className="container">
          <h2>Did You Know?</h2>
          <div className="facts-grid">
            <div className="fact-item">
              <h4>🌍 5 Major Tribes</h4>
              <p>Kenya's cultural diversity includes Kikuyu, Maasai, Luo, Kalenjin, and Kamba communities, each with unique traditions.</p>
            </div>
            <div className="fact-item">
              <h4>🗣️ 60+ Languages</h4>
              <p>Kenya has over 60 indigenous languages, with Swahili and English as official languages.</p>
            </div>
            <div className="fact-item">
              <h4>🎭 Rich Ceremonies</h4>
              <p>From Maasai coming-of-age rituals to Kikuyu harvest festivals, Kenya's ceremonies mark life's important moments.</p>
            </div>
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