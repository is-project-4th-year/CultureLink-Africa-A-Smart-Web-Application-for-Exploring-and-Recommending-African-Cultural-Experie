// src/components/TribesMap.js - Comprehensive Kenya Tribes Map
import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './TribesMap.css';
import '../utils/LeafletIcon';

const TribesMap = () => {
  const navigate = useNavigate();
  const [selectedTribe, setSelectedTribe] = useState(null);

  // Comprehensive Kenyan tribes with accurate geographical data
  const tribeRegions = [
    // BANTU GROUPS
    {
      id: 'kikuyu',
      name: 'Kikuyu',
      center: [-0.9, 37.0],
      radius: 50000,
      color: '#ce1126',
      fillOpacity: 0.3,
      region: 'Central Kenya',
      description: 'Central Kenya around Mount Kenya region, including Nyeri, Murang\'a, Kiambu, and Kirinyaga counties.',
      population: '8.1 million (22%)',
      traditions: 'Agriculture, Mount Kenya worship, age-set systems, Gĩkũyũ traditional religion',
      language: 'Gikuyu'
    },
    {
      id: 'luhya',
      name: 'Luhya',
      center: [0.5, 34.6],
      radius: 55000,
      color: '#2c3e50',
      fillOpacity: 0.3,
      region: 'Western Kenya',
      description: 'Western Kenya including Kakamega, Bungoma, Vihiga, and Busia counties.',
      population: '6.8 million (18%)',
      traditions: 'Agriculture, bull fighting, circumcision ceremonies, pottery, traditional medicine',
      language: 'Luhya dialects (Bukusu, Maragoli, etc.)'
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
      population: '5.1 million (13%)',
      traditions: 'Fishing, boat-making, music and oral literature, benga music, traditional healing',
      language: 'Dholuo'
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
      population: '4.6 million (11%)',
      traditions: 'Wood carving, basketry, long-distance trade, Akamba music and dance',
      language: 'Kikamba'
    },
    {
      id: 'kisii',
      name: 'Kisii (Gusii)',
      center: [-0.68, 34.78],
      radius: 35000,
      color: '#8e44ad',
      fillOpacity: 0.3,
      region: 'Nyanza Highlands',
      description: 'Kisii and Nyamira counties in southwestern Kenya.',
      population: '2.7 million (7%)',
      traditions: 'Soapstone carving, agriculture, traditional medicine, initiation ceremonies',
      language: 'Ekegusii'
    },
    {
      id: 'mijikenda',
      name: 'Mijikenda',
      center: [-3.9, 39.6],
      radius: 45000,
      color: '#16a085',
      fillOpacity: 0.3,
      region: 'Coast Region',
      description: 'Coastal Kenya including Mombasa, Kilifi, and Kwale counties. Nine sub-groups: Giriama, Digo, Duruma, Rabai, Chonyi, Kambe, Kauma, Ribe, and Jibana.',
      population: '2.5 million (6%)',
      traditions: 'Kaya sacred forests, traditional dance (Sengenya), palm wine tapping, fishing',
      language: 'Mijikenda dialects'
    },
    {
      id: 'meru',
      name: 'Meru',
      center: [0.35, 37.65],
      radius: 45000,
      color: '#d35400',
      fillOpacity: 0.3,
      region: 'Eastern Mt. Kenya',
      description: 'Eastern slopes of Mount Kenya in Meru and Tharaka-Nithi counties.',
      population: '1.9 million (5%)',
      traditions: 'Agriculture (miraa/khat), age-set systems, traditional governance (Njuri Ncheke)',
      language: 'Kimeru'
    },
    {
      id: 'embu',
      name: 'Embu',
      center: [-0.54, 37.65],
      radius: 30000,
      color: '#c0392b',
      fillOpacity: 0.3,
      region: 'Eastern Mt. Kenya',
      description: 'Southeastern slopes of Mount Kenya in Embu County.',
      population: '608,000 (1.5%)',
      traditions: 'Agriculture, Mount Kenya worship, age-grade systems, traditional council of elders',
      language: 'Kiembu'
    },

    // NILOTIC GROUPS
    {
      id: 'kalenjin',
      name: 'Kalenjin',
      center: [0.3, 35.3],
      radius: 65000,
      color: '#f39c12',
      fillOpacity: 0.3,
      region: 'Rift Valley Highlands',
      description: 'Western Highlands and Rift Valley, including Nandi, Kericho, Elgeyo-Marakwet, and Uasin Gishu counties. Includes Nandi, Kipsigis, Tugen, Marakwet, Pokot, Sabaot, Terik, and Keiyo sub-groups.',
      population: '5.3 million (13%)',
      traditions: 'Long-distance running, agriculture, circumcision ceremonies, warrior tradition',
      language: 'Kalenjin dialects'
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
      population: '1.2 million (3%)',
      traditions: 'Pastoralism, warrior culture (Moran), distinctive dress and beadwork, cattle herding, jumping dance',
      language: 'Maa'
    },
    {
      id: 'turkana',
      name: 'Turkana',
      center: [3.0, 35.5],
      radius: 70000,
      color: '#d68910',
      fillOpacity: 0.3,
      region: 'Northwestern Kenya',
      description: 'Northwestern Kenya in Turkana County around Lake Turkana.',
      population: '1.0 million (2.5%)',
      traditions: 'Nomadic pastoralism, fishing (Lake Turkana), distinctive beaded jewelry, scarification',
      language: 'Turkana'
    },
    {
      id: 'samburu',
      name: 'Samburu',
      center: [1.2, 37.0],
      radius: 50000,
      color: '#e67e22',
      fillOpacity: 0.3,
      region: 'North-Central Kenya',
      description: 'Samburu County in north-central Kenya, closely related to Maasai.',
      population: '310,000 (0.8%)',
      traditions: 'Pastoralism, warrior culture, elaborate beadwork, age-set systems, traditional singing',
      language: 'Samburu (dialect of Maa)'
    },
    {
      id: 'teso',
      name: 'Teso',
      center: [0.6, 34.1],
      radius: 35000,
      color: '#3498db',
      fillOpacity: 0.3,
      region: 'Western Kenya',
      description: 'Busia County in western Kenya, bordering Uganda.',
      population: '400,000 (1%)',
      traditions: 'Agriculture, cattle keeping, traditional dance (Ekitagururo), pottery',
      language: 'Ateso'
    },

    // CUSHITIC GROUPS
    {
      id: 'somali',
      name: 'Somali',
      center: [1.5, 40.5],
      radius: 80000,
      color: '#138d75',
      fillOpacity: 0.3,
      region: 'Northeastern Kenya',
      description: 'Northeastern Kenya including Garissa, Wajir, Mandera, and parts of Isiolo counties.',
      population: '2.8 million (7%)',
      traditions: 'Nomadic pastoralism, camel herding, oral poetry, Islamic culture, henna art',
      language: 'Somali'
    },
    {
      id: 'oromo',
      name: 'Oromo (Borana)',
      center: [0.8, 38.5],
      radius: 60000,
      color: '#229954',
      fillOpacity: 0.3,
      region: 'Northern Kenya',
      description: 'Northern Kenya including Marsabit, Isiolo, and parts of Garissa counties.',
      population: '850,000 (2%)',
      traditions: 'Pastoralism, Gada traditional governance system, camel and cattle herding',
      language: 'Oromo (Borana dialect)'
    },
    {
      id: 'rendille',
      name: 'Rendille',
      center: [2.3, 37.5],
      radius: 40000,
      color: '#1abc9c',
      fillOpacity: 0.3,
      region: 'Northern Kenya',
      description: 'Marsabit County in northern Kenya, near Lake Turkana.',
      population: '75,000 (0.2%)',
      traditions: 'Camel pastoralism, age-set systems, distinctive hairstyles, nomadic lifestyle',
      language: 'Rendille'
    },
    {
      id: 'el-molo',
      name: 'El Molo',
      center: [2.7, 36.8],
      radius: 15000,
      color: '#48c9b0',
      fillOpacity: 0.3,
      region: 'Lake Turkana',
      description: 'Southeastern shores of Lake Turkana in Marsabit County. Kenya\'s smallest tribe.',
      population: '4,000 (0.01%)',
      traditions: 'Fishing on Lake Turkana, hippo hunting (historically), basket weaving, unique language',
      language: 'El Molo (endangered)'
    },

    // OTHER BANTU GROUPS
    {
      id: 'taita',
      name: 'Taita',
      center: [-3.3, 38.3],
      radius: 35000,
      color: '#884ea0',
      fillOpacity: 0.3,
      region: 'Taita Hills',
      description: 'Taita-Taveta County in southeastern Kenya near the Tanzanian border.',
      population: '350,000 (0.9%)',
      traditions: 'Terrace farming, rainmaking rituals, traditional medicine, sacred hills',
      language: 'Kitaita'
    },
    {
      id: 'kuria',
      name: 'Kuria',
      center: [-1.0, 34.4],
      radius: 30000,
      color: '#7d3c98',
      fillOpacity: 0.3,
      region: 'Migori County',
      description: 'Southwestern Kenya in Migori County, bordering Tanzania.',
      population: '250,000 (0.6%)',
      traditions: 'Agriculture, cattle herding, traditional dance, initiation ceremonies',
      language: 'Kikuria'
    },
    {
      id: 'pokomo',
      name: 'Pokomo',
      center: [-1.8, 40.0],
      radius: 40000,
      color: '#145a32',
      fillOpacity: 0.3,
      region: 'Tana River',
      description: 'Along the Tana River in Tana River County.',
      population: '112,000 (0.3%)',
      traditions: 'River agriculture, fishing, canoe making, traditional irrigation systems',
      language: 'Kipokomo'
    },

    // SMALLER GROUPS
    {
      id: 'nubi',
      name: 'Nubi',
      center: [-1.2, 36.7],
      radius: 20000,
      color: '#1f618d',
      fillOpacity: 0.3,
      region: 'Nairobi/Kibera',
      description: 'Primarily in Kibera, Nairobi. Descendants of Sudanese soldiers who served in British colonial forces.',
      population: '100,000 (0.2%)',
      traditions: 'Islamic culture, Sudanese-Swahili fusion cuisine, unique Arabic-influenced language',
      language: 'Kinubi (Arabic creole)'
    },
    {
      id: 'bajuni',
      name: 'Bajuni',
      center: [-1.8, 41.0],
      radius: 25000,
      color: '#117a65',
      fillOpacity: 0.3,
      region: 'Southern Coast',
      description: 'Southern coastal islands and Lamu archipelago.',
      population: '50,000 (0.1%)',
      traditions: 'Seafaring, boat building (dhow), fishing, Islamic culture, Swahili poetry',
      language: 'Kibajuni (Swahili dialect)'
    },
    {
      id: 'suba',
      name: 'Suba',
      center: [-0.5, 34.1],
      radius: 25000,
      color: '#5499c7',
      fillOpacity: 0.3,
      region: 'Lake Victoria Islands',
      description: 'Islands in Lake Victoria, Homa Bay and Migori counties.',
      population: '185,000 (0.5%)',
      traditions: 'Fishing, boat making, island culture, traditional ceremonies',
      language: 'Suba'
    },
    {
      id: 'tharaka',
      name: 'Tharaka',
      center: [0.1, 37.9],
      radius: 30000,
      color: '#dc7633',
      fillOpacity: 0.3,
      region: 'Tharaka-Nithi',
      description: 'Tharaka-Nithi County in eastern Kenya, related to Meru.',
      population: '175,000 (0.4%)',
      traditions: 'Agriculture, beekeeping, traditional medicine, age-set systems',
      language: 'Kitharaka'
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
        <p>Explore the diverse ethnic communities across Kenya - Over 40 different tribes</p>
        <div className="map-stats">
          <span className="stat-item">
            <strong>Total Tribes:</strong> {tribeRegions.length}
          </span>
          <span className="stat-item">
            <strong>Population:</strong> ~54 Million
          </span>
          <span className="stat-item">
            <strong>Languages:</strong> 60+ dialects
          </span>
        </div>
      </div>

      <div className="map-container">
        <MapContainer 
          center={[-0.5, 37.0]} 
          zoom={6.5} 
          style={{ height: '700px', width: '100%', borderRadius: '12px' }}
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
                  <p><strong>Language:</strong> {tribe.language}</p>
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

      {/* Legend - Organized by ethnic group */}
      <div className="map-legend">
        <h3>Tribes Legend</h3>
        
        <div className="legend-section">
          <h4>Bantu Groups (Major)</h4>
          <div className="legend-items">
            {tribeRegions.filter(t => ['kikuyu', 'luhya', 'luo', 'kamba', 'kisii', 'mijikenda', 'meru', 'embu'].includes(t.id)).map((tribe) => (
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

        <div className="legend-section">
          <h4>Nilotic Groups</h4>
          <div className="legend-items">
            {tribeRegions.filter(t => ['kalenjin', 'maasai', 'turkana', 'samburu', 'teso'].includes(t.id)).map((tribe) => (
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

        <div className="legend-section">
          <h4>Cushitic Groups</h4>
          <div className="legend-items">
            {tribeRegions.filter(t => ['somali', 'oromo', 'rendille', 'el-molo'].includes(t.id)).map((tribe) => (
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

        <div className="legend-section">
          <h4>Other Communities</h4>
          <div className="legend-items">
            {tribeRegions.filter(t => ['taita', 'kuria', 'pokomo', 'nubi', 'bajuni', 'suba', 'tharaka'].includes(t.id)).map((tribe) => (
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
              <strong>Language:</strong> {selectedTribe.language}
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