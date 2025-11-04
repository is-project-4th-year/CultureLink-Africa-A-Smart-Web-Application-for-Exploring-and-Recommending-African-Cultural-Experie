// src/data/loadCulturalData.js
import * as XLSX from 'xlsx';

export async function loadCulturalData() {
  try {
    const response = await fetch('/data/KenyanCulture.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    // Transform to our format using YOUR column names
    const culturalFacts = jsonData.map((row, index) => {
      const culturalGroup = row.Cultural_Group || '';
      const category = row.Category || '';
      const title = row.Title || '';
      const description = row.Description || '';
      const significance = row.Cultural_Significance || '';
      const region = row.Region || '';
      
      // Combine description and significance for full content
      const fullContent = `${description}${significance ? '\n\nCultural Significance: ' + significance : ''}${region ? '\n\nRegion: ' + region : ''}`;
      
      return {
        id: index + 1,
        tribe: culturalGroup,
        category: category.toLowerCase(),
        keywords: generateKeywords(culturalGroup + ' ' + category + ' ' + title + ' ' + description),
        title: title,
        content: fullContent,
        region: region
      };
    });
    
    console.log(`✅ Loaded ${culturalFacts.length} cultural facts from Excel`);
    return culturalFacts;
    
  } catch (error) {
    console.error('Error loading cultural data:', error);
    return [];
  }
}

function generateKeywords(text) {
  const lower = text.toLowerCase();
  const allKeywords = [
    // Tribes
    'kikuyu', 'maasai', 'luo', 'luhya', 'kalenjin', 'kamba', 'kisii', 'meru',
    'mijikenda', 'turkana', 'samburu', 'pokot', 'embu', 'taita',
    // Categories
    'food', 'ceremony', 'wedding', 'marriage', 'dance', 'music', 'language',
    'tradition', 'ritual', 'celebration', 'spiritual', 'religion', 'art', 'craft',
    // Common terms
    'greeting', 'hello', 'warrior', 'circumcision', 'initiation', 'naming',
    'funeral', 'harvest', 'cattle', 'fish', 'ugali', 'githeri', 'milk', 'meat',
    'festival', 'clothing', 'jewelry', 'beads', 'pottery', 'drums'
  ];
  
  return allKeywords.filter(keyword => lower.includes(keyword));
}

// Enhanced search function
export function searchCulturalFacts(query, facts, maxResults = 3) {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(' ').filter(w => w.length > 2);
  
  const scored = facts.map(fact => {
    let score = 0;
    
    // Exact tribe match (highest priority)
    if (fact.tribe && queryLower.includes(fact.tribe.toLowerCase())) {
      score += 10;
    }
    
    // Category match
    if (fact.category && queryLower.includes(fact.category)) {
      score += 5;
    }
    
    // Title match
    if (queryLower.includes(fact.title.toLowerCase())) {
      score += 8;
    }
    
    // Keywords match
    fact.keywords.forEach(keyword => {
      if (queryLower.includes(keyword)) score += 3;
    });
    
    // Content word matches
    queryWords.forEach(word => {
      if (fact.content.toLowerCase().includes(word)) {
        score += 1;
      }
    });
    
    return { fact, score };
  });
  
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(item => item.fact);
}