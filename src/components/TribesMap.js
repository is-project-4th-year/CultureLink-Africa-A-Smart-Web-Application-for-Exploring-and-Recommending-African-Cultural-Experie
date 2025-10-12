// src/components/TribesMap.js
import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './TribesMap.css';
import '../utils/LeafletIcon';

const TribesMap = () => {
  const navigate = useNavigate();
  const [selectedTribe, setSelectedTribe] = useState(null);

  // Tribe regions with approximate centers and radius
  const tribeRegions = [
    {
      id: 'kikuyu',
      name: 'Kikuyu',
      center: [-0.9, 37.0],
      radius: 50000,
      color: '#ce1126',
      fillOpacity: 0.3,
      region: 'Central Kenya',
      description: 'Predominantly in Central Kenya around Mount Kenya region, including Nyeri, Murang\'a, Kiambu, and Kirinyaga counties.',
      population: '8+ million',
      traditions: 'Agriculture, Mount Kenya worship, age-set systems'
    },
    {
      id: 'maasai',
      name: 'Maasai',
      center: [-1.5, 36.5],
      radius: 60000,
      color: '#e74c3c',
      fillOpacity: 0.3,
      region: 'Southern Rift Valley',
      description: 'Southern Kenya and Northern Tanzania, primarily in Kajiado and Narok counties along the Great Rift Valley.',
      population: '1+ million',
      traditions: 'Pastoralism, warrior culture, distinctive dress and beadwork'
    },
    {
      id: 'luo',
      name: 'Luo',
      center: [-0.1, 34.3],
      radius: 55000,
      color: '#3498db',
      fillOpacity: 0.3,
      region: 'Nyanza - Lake Victoria',
      description: 'Western Kenya around Lake Victoria, including Kisumu, Siaya, Homa Bay, and Migori counties.',
      population: '5+ million',
      traditions: 'Fishing, boat-making, music and oral literature'
    },
    {
      id: 'kalenjin',
      name: 'Kalenjin',
      center: [0.3, 35.3],
      radius: 65000,
      color: '#f39c12',
      fillOpacity: 0.3,
      region: 'Rift Valley Highlands',
      description: 'Western Highlands and Rift Valley, including Nandi, Kericho, Elgeyo-Marakwet, and Uasin Gishu counties.',
      population: '6+ million',
      traditions: 'Long-distance running, agriculture, circumcision ceremonies'
    },
    {
      id: 'kamba',
      name: 'Kamba',
      center: [-1.6, 37.6],
      radius: 50000,
      color: '#27ae60',
      fillOpacity: 0.3,
      region: 'Eastern Kenya',
      description: 'Eastern Kenya, primarily in Machakos, Kitui, and Makueni counties.',
      population: '4+ million',
      traditions: 'Wood carving, basketry, long-distance trade'
    }
  ];

  const handleTribeClick = (tribe) => {
    setSelectedTribe(tribe);
  };

  const handleExploreMore = (tribeId) => {
    navigate(`/explore?tribe=${tribeId}`);
  };

  return (
    <div className="tribes-map-section">
      <div className="map-header">
        <h2>Kenya Tribes Distribution Map</h2>
        <p>Explore where Kenya's major ethnic communities are located across the country</p>
      </div>

      <div className="map-container">
        <MapContainer 
          center={[-0.5, 37.0]} 
          zoom={7} 
          style={{ height: '600px', width: '100%', borderRadius: '12px' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {tribeRegions.map((tribe) => (
            <Circle
              key={tribe.id}
              center={tribe.center}
              radius={tribe.radius}
              pathOptions={{
                color: tribe.color,
                fillColor: tribe.color,
                fillOpacity: tribe.fillOpacity,
                weight: 2
              }}
              eventHandlers={{
                click: () => handleTribeClick(tribe)
              }}
            >
              <Popup>
                <div className="tribe-popup">
                  <h3 style={{ color: tribe.color }}>{tribe.name}</h3>
                  <p><strong>Region:</strong> {tribe.region}</p>
                  <p><strong>Population:</strong> {tribe.population}</p>
                  <p className="popup-description">{tribe.description}</p>
                  <button 
                    className="popup-btn"
                    onClick={() => handleExploreMore(tribe.id)}
                    style={{ backgroundColor: tribe.color }}
                  >
                    Learn More
                  </button>
                </div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="map-legend">
        <h3>Tribes Legend</h3>
        <div className="legend-items">
          {tribeRegions.map((tribe) => (
            <div 
              key={tribe.id} 
              className="legend-item"
              onClick={() => handleTribeClick(tribe)}
            >
              <span 
                className="legend-color" 
                style={{ backgroundColor: tribe.color }}
              ></span>
              <span className="legend-name">{tribe.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Tribe Info Card */}
      {selectedTribe && (
        <div className="tribe-info-card">
          <button 
            className="close-btn"
            onClick={() => setSelectedTribe(null)}
          >
            ×
          </button>
          <div className="tribe-info-header" style={{ borderColor: selectedTribe.color }}>
            <h2 style={{ color: selectedTribe.color }}>{selectedTribe.name} People</h2>
            <span className="tribe-region">{selectedTribe.region}</span>
          </div>
          <div className="tribe-info-body">
            <div className="info-item">
              <strong>Population:</strong> {selectedTribe.population}
            </div>
            <div className="info-item">
              <strong>Location:</strong> {selectedTribe.description}
            </div>
            <div className="info-item">
              <strong>Key Traditions:</strong> {selectedTribe.traditions}
            </div>
          </div>
          <button 
            className="explore-tribe-btn"
            onClick={() => handleExploreMore(selectedTribe.id)}
            style={{ backgroundColor: selectedTribe.color }}
          >
            Explore {selectedTribe.name} Culture
          </button>
        </div>
      )}
    </div>
  );
};

export default TribesMap;