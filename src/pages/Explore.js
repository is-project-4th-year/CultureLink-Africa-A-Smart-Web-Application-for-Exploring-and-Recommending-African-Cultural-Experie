// src/pages/Explore.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserPreferences } from '../services/recommendationService';

const Explore = () => {
  const [selectedTribe, setSelectedTribe] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { currentUser } = useAuth();
  const [userPreferences, setUserPreferences] = useState(null);
  const [showingRecommended, setShowingRecommended] = useState(true);
 
  const getTribeImageUrl = (tribeName) => {
  // Direct working Unsplash image URLs
  const images = {
    'Kikuyu': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=400&fit=crop',
    'Maasai': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=400&fit=crop',
    'Luo': 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&h=400&fit=crop', // ✅ Changed to lake/fishing scene
    'Kalenjin': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
    'Kamba': 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&h=400&fit=crop', // ✅ African people in traditional attire
    'Luhya': 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800&h=400&fit=crop', // ✅ Traditional ceremony/cultural gathering

    'Kisii': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop',
    'Meru': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=400&fit=crop',
    'Mijikenda': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop',
    'Turkana': 'https://images.unsplash.com/photo-1591695448764-db3e197a1bc0?w=800&h=400&fit=crop',
    'Embu': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=400&fit=crop',
    'Taita': 'https://images.unsplash.com/photo-1618083707368-b3823daa2726?w=800&h=400&fit=crop',
    'Samburu': 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=400&fit=crop',
    'Pokot': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=400&fit=crop',
    'Tharaka': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop'
  };
  
  return images[tribeName] || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=400&fit=crop';
};


  const kenyanTribes = [
    {
      name: 'Kikuyu',
      population: '8.1 million',
      region: 'Central Kenya',
      language: 'Gikuyu',
      greetings: {
        hello: 'Wĩ mwega (wee mweh-gah)',
        thankYou: 'Nĩ wega (nee weh-gah)',
        welcome: 'Wamũkĩre (wah-moo-kee-reh)'
      },
      highlights: ['Mount Kenya traditions', 'Coffee farming culture', 'Gikuyu language', 'Traditional governance'],
      description: 'The largest ethnic group in Kenya, known for their agricultural practices and entrepreneurial spirit. They inhabit the fertile highlands around Mount Kenya and have a rich tradition of democratic governance through the Kiama (council of elders).',
      detailedInfo: 'The Kikuyu people are Bantu-speaking agriculturalists who migrated to Central Kenya centuries ago. They developed sophisticated irrigation systems and terrace farming techniques. Their traditional religion centers around Ngai (God) who resides on Mount Kenya (Kirinyaga). The Kikuyu played a significant role in Kenya\'s independence movement, with many freedom fighters coming from this community.',
      traditionalFoods: [
        'Githeri (maize and beans)',
        'Irio (mashed peas, potatoes, and corn)',
        'Mukimo (mashed green vegetables with potatoes)',
        'Mutura (blood sausage)',
        'Roasted sweet potatoes and arrowroots'
      ],
      festivals: [
        'Mau Mau Heroes Day (October 20)',
        'Ngai worship ceremonies at Mount Kenya',
        'Traditional wedding ceremonies (Ngurario)',
        'Circumcision ceremonies (Irua)'
      ],
      culturalSites: [
        'Mount Kenya National Park',
        'Mukurwe wa Gathanga (sacred ancestral home)',
        'Dedan Kimathi Memorial',
        'Karura Forest sacred sites'
      ],
      dosAndDonts: {
        dos: [
          'Greet elders with respect, using both hands when shaking',
          'Remove shoes when entering traditional homes',
          'Accept food when offered - it\'s considered rude to refuse',
          'Dress modestly, especially in rural areas'
        ],
        donts: [
          'Don\'t point at Mount Kenya disrespectfully - it\'s sacred',
          'Don\'t refuse to share food - communal eating is important',
          'Avoid using your left hand for greeting or eating',
          'Don\'t take photos of ceremonies without permission'
        ]
      },
      videos: [
        {
          title: 'Kikuyu Culture and Traditions Documentary',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Comprehensive overview of Kikuyu customs, language, and way of life'
        },
        {
          title: 'Traditional Kikuyu Wedding Ceremony',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Experience the beauty of Ngurario - the traditional Kikuyu marriage ceremony'
        },
        {
          title: 'Mount Kenya: Sacred Mountain of the Kikuyu',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Explore the spiritual significance of Kirinyaga to the Kikuyu people'
        }
      ],
      categories: ['food', 'ceremonies', 'languages', 'arts', 'music']
    },
    {
      name: 'Maasai',
      population: '1.2 million',
      region: 'Southern Kenya & Northern Tanzania',
      language: 'Maa',
      greetings: {
        hello: 'Sopa (so-pah)',
        thankYou: 'Ashe oleng (ah-shay oh-leng)',
        welcome: 'Karibu (kah-ree-boo)'
      },
      highlights: ['Warrior traditions', 'Cattle herding', 'Distinctive dress', 'Age-set system'],
      description: 'Semi-nomadic pastoralists famous for their distinctive customs and dress, living near game parks. The Maasai are one of the most recognizable ethnic groups in the world, known for their jumping dance (Adumu) and vibrant red shuka cloths.',
      detailedInfo: 'The Maasai are Nilotic people who migrated from the Nile Valley around the 15th century. They measure wealth in cattle and children, with cattle being central to their economy, diet, and rituals. Despite pressure to modernize, many Maasai maintain their traditional semi-nomadic lifestyle, moving with their herds in search of water and grazing land. Their age-set system (Morans) creates strong bonds between warriors of the same generation.',
      traditionalFoods: [
        'Milk and blood mixture (from cattle)',
        'Meat (especially beef and goat)',
        'Ugali (maize porridge)',
        'Traditional honey beer',
        'Roasted meat (nyama choma)'
      ],
      festivals: [
        'Eunoto (warrior graduation ceremony)',
        'Enkipaata (pre-circumcision ceremony)',
        'Emoratta (meat-eating ceremony for elders)',
        'Olng\'esherr (junior elder ceremony)'
      ],
      culturalSites: [
        'Maasai Mara National Reserve',
        'Amboseli National Park',
        'Maasai Cultural Villages',
        'Ngong Hills (sacred to Maasai)'
      ],
      dosAndDonts: {
        dos: [
          'Always ask permission before taking photos',
          'Learn a few words in Maa language',
          'Respect cattle - they are sacred',
          'Purchase authentic crafts to support communities'
        ],
        donts: [
          'Don\'t touch someone\'s cattle without permission',
          'Avoid wearing revealing clothing in villages',
          'Don\'t mock or make light of their traditions',
          'Never rush elders when they are speaking'
        ]
      },
      videos: [
        {
          title: 'Life of the Maasai Warriors',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Follow the journey of young Maasai men from boyhood to warrior status'
        },
        {
          title: 'Maasai Jumping Dance (Adumu)',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Experience the famous Maasai warrior jumping dance ceremony'
        },
        {
          title: 'Traditional Maasai Beadwork',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Learn about the intricate art of Maasai beadwork and its meanings'
        }
      ],
      categories: ['ceremonies', 'clothing', 'music', 'food', 'arts']
    },
    {
      name: 'Luo',
      population: '4.4 million',
      region: 'Western Kenya (Lake Victoria)',
      language: 'Dholuo',
      greetings: {
        hello: 'Misawa (mee-sah-wah)',
        thankYou: 'Erokamano (eh-roh-kah-mah-noh)',
        welcome: 'Oriti maber (oh-ree-tee mah-behr)'
      },
      highlights: ['Fishing culture', 'Oral traditions', 'Music and dance', 'Lakeside living'],
      description: 'Nilotic people known for their fishing culture, oral literature, and musical traditions. The Luo are famous for their storytelling, passionate music, and strong connection to Lake Victoria.',
      detailedInfo: 'The Luo migrated from the Nile Valley into Kenya between the 14th and 16th centuries. Unlike many Kenyan communities, the Luo did not traditionally practice circumcision, instead marking adulthood through the removal of six lower teeth. They are renowned fishermen, with fishing being both an economic activity and cultural practice. The Luo have produced many of Kenya\'s prominent musicians, politicians, and intellectuals.',
      traditionalFoods: [
        'Fish (tilapia and Nile perch)',
        'Aliya (fish in groundnut sauce)',
        'Kuon (sorghum or millet ugali)',
        'Nyoyo (boiled beans)',
        'Omena (silver cyprinid fish)'
      ],
      festivals: [
        'Ramogi Cultural Festival',
        'Fishing competitions on Lake Victoria',
        'Traditional wrestling (Ramogi)',
        'Dodo dance festivals'
      ],
      culturalSites: [
        'Kit Mikayi sacred rock',
        'Simbi Nyaima sacred lake',
        'Thimlich Ohinga archaeological site',
        'Rusinga Island cultural sites'
      ],
      dosAndDonts: {
        dos: [
          'Participate in communal fishing activities if invited',
          'Enjoy their vibrant music and dance culture',
          'Try fresh fish from Lake Victoria',
          'Respect their oral storytelling traditions'
        ],
        donts: [
          'Don\'t disrespect their tooth removal traditions',
          'Avoid discussing circumcision insensitively',
          'Don\'t refuse hospitality - it\'s deeply valued',
          'Never waste fish or water from the lake'
        ]
      },
      videos: [
        {
          title: 'Luo Fishing Traditions on Lake Victoria',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Discover the ancient fishing methods passed down through generations'
        },
        {
          title: 'Benga Music: The Sound of Luo',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Experience the infectious rhythms of Luo Benga music'
        },
        {
          title: 'Luo Storytelling and Oral Traditions',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Listen to traditional Luo folktales and their cultural significance'
        }
      ],
      categories: ['food', 'music', 'ceremonies', 'languages', 'arts']
    },
    {
      name: 'Kalenjin',
      population: '5.3 million',
      region: 'Rift Valley',
      language: 'Kalenjin (various dialects)',
      greetings: {
        hello: 'Chamge (chahm-gay)',
        thankYou: 'Kong\'ou (kong-oh)',
        welcome: 'Koindo (koh-een-doh)'
      },
      highlights: ['Running champions', 'Highland farming', 'Ceremonial traditions', 'Age-grade systems'],
      description: 'Highland people famous for producing world-class long-distance runners and rich ceremonial life. The Kalenjin dominate international athletics, particularly in middle and long-distance running.',
      detailedInfo: 'The Kalenjin are a Nilotic ethnic group composed of eight sub-groups including Nandi, Kipsigis, Tugen, and Pokot. They arrived in the Rift Valley region around 2,000 years ago. Living at high altitudes, they developed extraordinary endurance, which partly explains their dominance in distance running. Their traditional economy was based on cattle herding and agriculture. The Kalenjin have complex initiation ceremonies and a strong oral tradition of storytelling and folklore.',
      traditionalFoods: [
        'Mursik (fermented milk)',
        'Kimyet (wild vegetables)',
        'Sugut (meat with soup)',
        'Busaa (traditional beer)',
        'Roasted maize'
      ],
      festivals: [
        'Tumdo (circumcision ceremonies)',
        'Running competitions and festivals',
        'Harvest festivals',
        'Age-set ceremonies'
      ],
      culturalSites: [
        'Nandi Hills',
        'Kerio Valley viewpoints',
        'Kipsigis sacred forests',
        'Athletic training centers'
      ],
      dosAndDonts: {
        dos: [
          'Appreciate their athletic achievements',
          'Try traditional mursik if offered',
          'Respect age-set systems and elders',
          'Join in community running events'
        ],
        donts: [
          'Don\'t make jokes about their running prowess',
          'Avoid disrespecting circumcision traditions',
          'Don\'t photograph ceremonies without consent',
          'Never refuse elder\'s advice'
        ]
      },
      videos: [
        {
          title: 'Why Kalenjin Runners Dominate Distance Running',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Scientific and cultural exploration of Kalenjin running success'
        },
        {
          title: 'Traditional Kalenjin Circumcision Ceremony',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Understanding the rites of passage in Kalenjin culture'
        },
        {
          title: 'Life in the Rift Valley: Kalenjin Traditions',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Daily life and customs of the highland Kalenjin people'
        }
      ],
      categories: ['ceremonies', 'music', 'languages', 'food', 'arts']
    },
    {
      name: 'Kamba',
      population: '4.6 million',
      region: 'Eastern Kenya',
      language: 'Kikamba',
      greetings: {
        hello: 'Mwĩkalo (mwee-kah-loh)',
        thankYou: 'Nĩnenewe (nee-neh-neh-weh)',
        welcome: 'Karibu (kah-ree-boo)'
      },
      highlights: ['Wood carving', 'Trading culture', 'Traditional medicine', 'Storytelling'],
      description: 'Skilled artisans and traders known for wood carving, traditional medicine, and rich oral traditions. The Kamba are famous throughout East Africa for their exceptional craftsmanship.',
      detailedInfo: 'The Kamba people are Bantu speakers who settled in the arid and semi-arid Eastern Kenya. Historically, they were long-distance traders, traveling as far as the coast. Their expertise in wood carving has made them renowned artisans, producing sculptures, masks, and artifacts sought worldwide. The Kamba also have a deep knowledge of traditional medicine and maintain strong storytelling traditions. They are known for their acrobatic dances and vibrant musical culture.',
      traditionalFoods: [
        'Kikwangu (boiled maize with beans)',
        'Ngima (stiff porridge from millet or sorghum)',
        'Nthukwa (wild edible mushrooms)',
        'Mũthokoi (maize and beans)',
        'Honey and honey beer'
      ],
      festivals: [
        'Kilumi traditional dance festivals',
        'Mwethya (community work parties)',
        'Ukimwi traditional ceremonies',
        'Wood carving competitions'
      ],
      culturalSites: [
        'Nzambani Rock',
        'Kamba craft villages',
        'Traditional medicine gardens',
        'Kitui sacred sites'
      ],
      dosAndDonts: {
        dos: [
          'Purchase authentic Kamba wood carvings',
          'Learn about their traditional medicine',
          'Participate in storytelling sessions',
          'Appreciate their acrobatic dances'
        ],
        donts: [
          'Don\'t bargain too aggressively for crafts',
          'Avoid dismissing traditional medicine knowledge',
          'Don\'t interrupt elders during storytelling',
          'Never photograph sacred ceremonies without permission'
        ]
      },
      videos: [
        {
          title: 'Kamba Wood Carving Masters',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Watch skilled artisans transform wood into beautiful sculptures'
        },
        {
          title: 'Kilumi Dance: Kamba Acrobatic Traditions',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Experience the energetic and acrobatic Kilumi dance'
        },
        {
          title: 'Traditional Kamba Medicine and Healing',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Explore the rich tradition of Kamba herbal medicine'
        }
      ],
      categories: ['arts', 'music', 'languages', 'food', 'ceremonies']
    },
    {
      name: 'Luhya',
      population: '6.8 million',
      region: 'Western Kenya',
      language: 'Luhya (18 dialects)',
      greetings: {
        hello: 'Muraho (moo-rah-hoh)',
        thankYou: 'Oyakoye (oh-yah-koh-yeh)',
        welcome: 'Murahabe (moo-rah-hah-beh)'
      },
      highlights: ['Bullfighting traditions', 'Agriculture', 'Bukusu circumcision', 'Isukha pottery'],
      description: 'Kenya\'s second-largest ethnic group, consisting of 18 sub-tribes with diverse cultural practices and agricultural expertise. The Luhya have maintained many unique traditions while adapting to modern life.',
      detailedInfo: 'The Luhya are Bantu-speaking people who migrated from various parts of Africa and settled in Western Kenya. They are actually a collection of 18 culturally and linguistically related sub-tribes including Bukusu, Maragoli, Wanga, and Isukha. Each sub-tribe maintains distinct traditions. The Luhya are skilled farmers, growing crops like maize, beans, and sugarcane. Their bullfighting tradition (Khulala Ing\'oombe) is unique in Kenya and draws large crowds during festive seasons.',
      traditionalFoods: [
        'Obusuma (thick ugali)',
        'Amavu (fermented bamboo shoots)',
        'Ingokho (chicken in groundnut sauce)',
        'Litsonza (boiled vegetables)',
        'Busaa and Muratina (traditional brews)'
      ],
      festivals: [
        'Bullfighting festivals (Khulala Ing\'oombe)',
        'Bukusu circumcision ceremonies',
        'Harvest festivals',
        'Traditional wrestling competitions'
      ],
      culturalSites: [
        'Kakamega Forest (sacred sites)',
        'Crying Stone of Ilesi',
        'Bullfighting arenas',
        'Mumias Palace'
      ],
      dosAndDonts: {
        dos: [
          'Attend a bullfighting event if possible',
          'Try traditional Luhya cuisine',
          'Respect the diversity of 18 sub-tribes',
          'Participate in communal farming (Obulimo)'
        ],
        donts: [
          'Don\'t confuse different Luhya sub-tribes',
          'Avoid disrespecting circumcision ceremonies',
          'Don\'t refuse food - hospitality is sacred',
          'Never photograph rituals without permission'
        ]
      },
      videos: [
        {
          title: 'Luhya Bullfighting: Traditional Sport',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Witness the exciting tradition of Luhya bullfighting'
        },
        {
          title: 'Bukusu Circumcision Ceremony',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Understanding the elaborate Bukusu coming-of-age ceremony'
        },
        {
          title: 'Life in Kakamega Forest: Luhya Traditions',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Explore the sacred forests and traditions of the Luhya people'
        }
      ],
      categories: ['ceremonies', 'food', 'arts', 'music', 'languages']
    },
    {
      name: 'Kisii',
      population: '2.7 million',
      region: 'Nyanza Province',
      language: 'Ekegusii',
      greetings: {
        hello: 'Bwakire (bwah-kee-reh)',
        thankYou: 'Morakire (moh-rah-kee-reh)',
        welcome: 'Monene (moh-neh-neh)'
      },
      highlights: ['Soapstone carving', 'Banana farming', 'Traditional medicine', 'Communal living'],
      description: 'Highland Bantu people renowned for their soapstone sculptures and agricultural prowess in the fertile Kisii highlands. Kisii soapstone carvings are world-famous and sold globally.',
      detailedInfo: 'The Kisii (also known as Gusii) are Bantu people who live in the fertile highlands of Nyanza Province. They are expert farmers who grow tea, coffee, and especially bananas - which feature prominently in their diet and ceremonies. The Kisii are world-famous for their soapstone carvings, which have become a major export product. They have strong traditional healing practices and maintain close-knit community structures with emphasis on extended family systems.',
      traditionalFoods: [
        'Obokima (finger millet bread)',
        'Omogaka (vegetables with groundnuts)',
        'Banana dishes (matoke)',
        'Amaranth (imboga)',
        'Traditional beer (omarua)'
      ],
      festivals: [
        'Soapstone carving festivals',
        'Harvest celebrations',
        'Traditional circumcision ceremonies',
        'Wrestling competitions (Egetento)'
      ],
      culturalSites: [
        'Tabaka Soapstone Quarries',
        'Kisii Museum',
        'Sacred caves and springs',
        'Traditional healing centers'
      ],
      dosAndDonts: {
        dos: [
          'Visit soapstone carving cooperatives',
          'Try banana-based traditional dishes',
          'Respect their strong family structures',
          'Learn about traditional medicine practices'
        ],
        donts: [
          'Don\'t photograph soapstone quarries without permission',
          'Avoid disrespecting elders - very important',
          'Don\'t mock their language or accent',
          'Never waste food - it\'s considered disrespectful'
        ]
      },
      videos: [
        {
          title: 'Kisii Soapstone Carving Art',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'From quarry to masterpiece: the art of Kisii soapstone carving'
        },
        {
          title: 'Traditional Kisii Medicine and Healing',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Explore the rich tradition of Kisii herbal medicine'
        },
        {
          title: 'Life in Kisii Highlands',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Daily life and customs in the beautiful Kisii highlands'
        }
      ],
      categories: ['arts', 'food', 'ceremonies', 'languages', 'music']
    },
    {
      name: 'Meru',
      population: '1.9 million',
      region: 'Mount Kenya Eastern Slopes',
      language: 'Kimeru',
      greetings: {
        hello: 'Mwikinwa (mwee-keen-wah)',
        thankYou: 'Ni cioko (nee choh-koh)',
        welcome: 'Mukinyaga (moo-keen-yah-gah)'
      },
      highlights: ['Miraa cultivation', 'Age-set systems', 'Council of elders', 'Traditional festivals'],
      description: 'Bantu-speaking people living on the slopes of Mount Kenya, known for miraa farming and strong traditional governance. The Meru have maintained their cultural identity while embracing modernity.',
      detailedInfo: 'The Meru people are Bantu speakers who live on the fertile eastern and northeastern slopes of Mount Kenya. According to oral tradition, they arrived from the "red sea" area centuries ago. They are known for cultivating miraa (khat), a stimulant plant that has become economically important. The Meru have a strong age-set system and democratic traditional governance through the "Njuri Ncheke" council of elders. They practice both pastoralism and agriculture.',
      traditionalFoods: [
        'Mukimo (mashed food mix)',
        'Githeri (maize and beans)',
        'Miraa (khat leaves)',
        'Mutura (traditional sausage)',
        'Traditional honey'
      ],
      festivals: [
        'Gaturi dance festivals',
        'Age-set graduation ceremonies',
        'Njuri Ncheke council gatherings',
        'Harvest festivals'
      ],
      culturalSites: [
        'Njuri Ncheke sacred grounds',
        'Meru Museum',
        'Mount Kenya cultural trails',
        'Miraa plantations'
      ],
      dosAndDonts: {
        dos: [
          'Respect the Njuri Ncheke council',
          'Learn about miraa cultivation',
          'Appreciate their age-set traditions',
          'Visit Mount Kenya sacred sites'
        ],
        donts: [
          'Don\'t disrespect Mount Kenya - it\'s sacred',
          'Avoid illegal miraa activities',
          'Don\'t photograph ceremonies without permission',
          'Never disrespect elders or their decisions'
        ]
      },
      videos: [
        {
          title: 'Meru Culture and Mount Kenya',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Spiritual connection between Meru people and Mount Kenya'
        },
        {
          title: 'Miraa: Green Gold of Meru',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'The economics and culture of miraa cultivation'
        },
        {
          title: 'Njuri Ncheke: Traditional Governance',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Understanding Meru\'s unique council of elders system'
        }
      ],
      categories: ['food', 'ceremonies', 'languages', 'music', 'arts']
    },
    {
      name: 'Mijikenda',
      population: '2.5 million',
      region: 'Coastal Kenya',
      language: 'Mijikenda languages',
      greetings: {
        hello: 'Ufaro (oo-fah-roh)',
        thankYou: 'Ni rakite (nee rah-kee-teh)',
        welcome: 'Rib o (reeb oh)'
      },
      highlights: ['Kaya sacred forests', 'Coconut farming', 'Swahili influence', 'Maritime traditions'],
      description: 'Coastal people comprising nine related tribes, guardians of sacred Kaya forests and rich coastal traditions. The Mijikenda maintain UNESCO-recognized sacred forests.',
      detailedInfo: 'Mijikenda means "nine homesteads" in the Bantu language, representing nine related ethnic groups: Giriama, Chonyi, Digo, Duruma, Jibana, Kambe, Kauma, Rabai, and Ribe. They migrated to the Kenyan coast centuries ago and established fortified settlements called "Kayas" in sacred forests. These Kayas are now UNESCO World Heritage Sites. The Mijikenda practice mixed agriculture, fishing, and have been influenced by Swahili and Arab cultures while maintaining their distinct identity.',
      traditionalFoods: [
        'Coconut rice (wali wa nazi)',
        'Fish curry',
        'Mkate wa ufuta (coconut bread)',
        'Cassava dishes',
        'Coconut-based foods'
      ],
      festivals: [
        'Kaya sacred forest ceremonies',
        'Mwaka Kogwa (New Year)',
        'Traditional fishing competitions',
        'Giriama dance festivals'
      ],
      culturalSites: [
        'Kaya Kinondo Sacred Forest',
        'Kaya Mudzi Muvya',
        'Rabai Museum',
        'Gedi Ruins'
      ],
      dosAndDonts: {
        dos: [
          'Visit Kaya forests with respect and a guide',
          'Try coconut-based coastal cuisine',
          'Learn about maritime traditions',
          'Respect sacred sites and taboos'
        ],
        donts: [
          'Never enter Kaya forests without permission',
          'Don\'t disturb sacred sites or artifacts',
          'Avoid disrespecting elders (Kambi)',
          'Don\'t photograph ceremonies without consent'
        ]
      },
      videos: [
        {
          title: 'Sacred Kaya Forests of the Mijikenda',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'UNESCO World Heritage Sites and their spiritual significance'
        },
        {
          title: 'Giriama Traditional Dance and Music',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Experience the vibrant music and dance of coastal Mijikenda'
        },
        {
          title: 'Coconut Culture of the Coast',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'How coconuts shape Mijikenda life and economy'
        }
      ],
      categories: ['ceremonies', 'languages', 'food', 'arts', 'music']
    },
    {
      name: 'Turkana',
      population: '1.0 million',
      region: 'Northwestern Kenya',
      language: 'Turkana',
      greetings: {
        hello: 'Yoga (yoh-gah)',
        thankYou: 'Erai (eh-rah-ee)',
        welcome: 'Irimo (ee-ree-moh)'
      },
      highlights: ['Pastoralism', 'Beadwork', 'Nomadic lifestyle', 'Lake Turkana culture'],
      description: 'Nilotic pastoralists of the arid northwest, known for their resilience, distinctive adornments, and nomadic traditions. The Turkana have adapted to one of Kenya\'s harshest environments.',
      detailedInfo: 'The Turkana are Nilotic pastoralists who inhabit northwestern Kenya around Lake Turkana (formerly Lake Rudolf). They are known for their resilience in the harsh, arid environment and their strong pastoral traditions. Cattle, camels, goats, and donkeys are central to their economy and culture. Turkana people are famous for their elaborate beadwork, neck ornaments, and traditional hairstyles. Despite modernization pressures, many maintain semi-nomadic lifestyles, moving with their herds.',
      traditionalFoods: [
        'Milk and blood mixture',
        'Roasted meat',
        'Akiriket (porridge)',
        'Wild fruits and berries',
        'Fish from Lake Turkana'
      ],
      festivals: [
        'Turkana Cultural Festival',
        'Cattle blessing ceremonies',
        'Age-set initiations',
        'Traditional wrestling events'
      ],
      culturalSites: [
        'Lake Turkana (Jade Sea)',
        'Turkana Basin archaeological sites',
        'Eliye Springs',
        'Central Island National Park'
      ],
      dosAndDonts: {
        dos: [
          'Appreciate their survival skills',
          'Learn about their beadwork art',
          'Respect their nomadic lifestyle',
          'Try fresh fish from Lake Turkana'
        ],
        donts: [
          'Don\'t touch livestock without permission',
          'Avoid making assumptions about development',
          'Don\'t photograph people without asking',
          'Never disrespect their traditional dress'
        ]
      },
      videos: [
        {
          title: 'Life in Turkana: Desert Pastoralists',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Surviving and thriving in Kenya\'s arid northwest'
        },
        {
          title: 'Turkana Beadwork and Adornments',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'The art and symbolism of Turkana jewelry'
        },
        {
          title: 'Lake Turkana: Cradle of Mankind',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Archaeological treasures and cultural heritage'
        }
      ],
      categories: ['clothing', 'ceremonies', 'arts', 'food', 'languages']
    },
    {
      name: 'Embu',
      population: '608,000',
      region: 'Eastern Mount Kenya',
      language: 'Kiembu',
      greetings: {
        hello: 'Muukie (moo-oo-kee-eh)',
        thankYou: 'Ni wega (nee weh-gah)',
        welcome: 'Wamukire (wah-moo-kee-reh)'
      },
      highlights: ['Coffee cultivation', 'Traditional medicine', 'Njuri Ncheke council', 'Irrigation systems'],
      description: 'Bantu people from the southeastern slopes of Mount Kenya, skilled farmers with strong democratic traditions. The Embu have sophisticated traditional governance systems.',
      detailedInfo: 'The Embu people are closely related to the Kikuyu and Meru, sharing many cultural practices. They inhabit the southeastern slopes of Mount Kenya in one of Kenya\'s most fertile regions. The Embu are excellent farmers, particularly known for coffee, tea, and rice cultivation. They have sophisticated traditional irrigation systems (Mifongo) that have been used for generations. Their Njuri Ncheke council system provides traditional governance and conflict resolution.',
      traditionalFoods: [
        'Irio (mashed peas and potatoes)',
        'Githeri (maize and beans)',
        'Mukimo (mashed greens)',
        'Traditional vegetables',
        'Local honey'
      ],
      festivals: [
        'Njuri Ncheke ceremonies',
        'Harvest festivals',
        'Coffee harvesting celebrations',
        'Traditional dance competitions'
      ],
      culturalSites: [
        'Mwea National Reserve',
        'Mount Kenya foothills',
        'Traditional irrigation canals',
        'Coffee plantations'
      ],
      dosAndDonts: {
        dos: [
          'Respect the Njuri Ncheke system',
          'Try locally grown coffee',
          'Learn about irrigation methods',
          'Appreciate their farming expertise'
        ],
        donts: [
          'Don\'t disrespect Mount Kenya',
          'Avoid comparing them negatively to Kikuyu',
          'Don\'t photograph sacred sites without permission',
          'Never waste water - it\'s sacred'
        ]
      },
      videos: [
        {
          title: 'Embu Coffee: From Farm to Cup',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'The journey of Embu coffee and farming traditions'
        },
        {
          title: 'Traditional Irrigation: Embu Innovation',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Ancient water management systems still in use'
        },
        {
          title: 'Embu Culture and Traditions',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Understanding Embu customs and way of life'
        }
      ],
      categories: ['food', 'ceremonies', 'languages', 'arts', 'music']
    },
    {
      name: 'Taita',
      population: '340,000',
      region: 'Taita-Taveta County',
      language: 'Kitaita',
      greetings: {
        hello: 'Msuha (m-soo-hah)',
        thankYou: 'Asante (ah-sahn-teh)',
        welcome: 'Karibu (kah-ree-boo)'
      },
      highlights: ['Terrace farming', 'Skull worship', 'Traditional irrigation', 'Mountain culture'],
      description: 'Bantu people of the Taita Hills, masters of terrace farming and guardians of unique highland traditions. The Taita have adapted remarkably to their mountainous environment.',
      detailedInfo: 'The Taita people inhabit the Taita Hills in southeastern Kenya, near the Tanzania border. They are renowned for their sophisticated terrace farming techniques that prevent soil erosion in the steep hills. The Taita have unique funeral practices involving skull preservation and worship. They maintain sacred groves and have strong traditional beliefs. Despite their small population, they have preserved their language and culture remarkably well. The Taita Hills are also home to rare endemic species.',
      traditionalFoods: [
        'Ulezi (millet porridge)',
        'Sagati (vegetable dish)',
        'Kizua (bean dishes)',
        'Mountain fruits',
        'Traditional beer'
      ],
      festivals: [
        'Skull worship ceremonies',
        'Terrace farming festivals',
        'Traditional dances',
        'Harvest celebrations'
      ],
      culturalSites: [
        'Taita Hills',
        'Sacred groves',
        'Skull caves',
        'Traditional terraces'
      ],
      dosAndDonts: {
        dos: [
          'Respect sacred groves and caves',
          'Learn about terrace farming',
          'Appreciate their conservation efforts',
          'Try traditional mountain cuisine'
        ],
        donts: [
          'Don\'t disturb sacred skull sites',
          'Avoid destroying terraces',
          'Don\'t photograph ceremonies without permission',
          'Never disrespect ancestral traditions'
        ]
      },
      videos: [
        {
          title: 'Taita Hills: Terrace Farming Masters',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Ancient agricultural techniques in mountain terrain'
        },
        {
          title: 'Sacred Groves of Taita Hills',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Biodiversity hotspots and spiritual significance'
        },
        {
          title: 'Taita Traditions and Skull Worship',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Understanding unique Taita ancestral practices'
        }
      ],
      categories: ['food', 'ceremonies', 'languages', 'arts', 'music']
    },
    {
      name: 'Samburu',
      population: '310,000',
      region: 'Northern Kenya',
      language: 'Samburu',
      greetings: {
        hello: 'Serian (seh-ree-ahn)',
        thankYou: 'Ashe oleng (ah-shay oh-leng)',
        welcome: 'Karibu (kah-ree-boo)'
      },
      highlights: ['Pastoralism', 'Warrior culture', 'Beaded jewelry', 'Close Maasai relations'],
      description: 'Nilotic pastoralists closely related to the Maasai, maintaining traditional semi-nomadic lifestyle in northern rangelands. The Samburu have preserved their culture remarkably well.',
      detailedInfo: 'The Samburu are closely related to the Maasai, speaking a similar Maa language. They inhabit the hot, arid lowlands of northern Kenya. Like the Maasai, they are pastoralists who measure wealth in cattle and have a strong warrior tradition (Lmuran). The Samburu are famous for their elaborate beaded jewelry and singing rituals. They maintain strict age-set systems and traditional ceremonies. Despite modernization, many Samburu continue their semi-nomadic lifestyle.',
      traditionalFoods: [
        'Milk and blood mixture',
        'Meat (beef and goat)',
        'Traditional beer',
        'Wild fruits',
        'Honey'
      ],
      festivals: [
        'Lmuget (warrior graduation)',
        'Wedding ceremonies',
        'Circumcision celebrations',
        'Singing competitions'
      ],
      culturalSites: [
        'Samburu National Reserve',
        'Ngurunit community conservancies',
        'Traditional villages (manyattas)',
        'Sacred mountains'
      ],
      dosAndDonts: {
        dos: [
          'Ask permission before photos',
          'Respect warrior traditions',
          'Appreciate their beadwork',
          'Learn about cattle culture'
        ],
        donts: [
          'Don\'t touch cattle without permission',
          'Avoid disrespecting elders',
          'Don\'t mock their traditional dress',
          'Never rush ceremonies or rituals'
        ]
      },
      videos: [
        {
          title: 'Samburu Warriors and Traditions',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'The journey from boyhood to warrior status'
        },
        {
          title: 'Samburu Beadwork Artistry',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Intricate jewelry and its cultural meanings'
        },
        {
          title: 'Life in Samburu National Reserve',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Balancing wildlife conservation and pastoral life'
        }
      ],
      categories: ['clothing', 'ceremonies', 'arts', 'music', 'food']
    },
    {
      name: 'Pokot',
      population: '778,000',
      region: 'West Pokot & Baringo',
      language: 'Pokot',
      greetings: {
        hello: 'Solem (soh-lehm)',
        thankYou: 'Kongoi (kong-oh-ee)',
        welcome: 'Karibu (kah-ree-boo)'
      },
      highlights: ['Cattle herding', 'Irrigation expertise', 'Traditional ceremonies', 'Highland-lowland divide'],
      description: 'Nilotic people divided into highland farmers and lowland pastoralists, known for elaborate ceremonies and cattle culture. The Pokot maintain strong traditional practices.',
      detailedInfo: 'The Pokot (also known as Suk) are divided into two groups: highland Pokot who practice agriculture, and lowland Pokot who are pastoralists. Both groups maintain strong cultural ties despite different economic activities. The Pokot are known for elaborate initiation ceremonies, particularly Sapana (circumcision). They have sophisticated indigenous irrigation systems and are skilled in both farming and livestock management. The Pokot maintain strong age-set systems and traditional governance.',
      traditionalFoods: [
        'Milk products',
        'Roasted meat',
        'Sorghum porridge',
        'Honey and honey beer',
        'Wild vegetables'
      ],
      festivals: [
        'Sapana (circumcision ceremonies)',
        'Ateker reunions',
        'Harvest festivals',
        'Cattle blessing ceremonies'
      ],
      culturalSites: [
        'Cherangani Hills',
        'Lake Baringo',
        'Traditional irrigation channels',
        'Sacred caves'
      ],
      dosAndDonts: {
        dos: [
          'Respect highland-lowland differences',
          'Learn about irrigation systems',
          'Appreciate cattle culture',
          'Try traditional Pokot honey'
        ],
        donts: [
          'Don\'t disrespect circumcision traditions',
          'Avoid cattle raiding discussions',
          'Don\'t photograph without consent',
          'Never waste water resources'
        ]
      },
      videos: [
        {
          title: 'Pokot Sapana Ceremony',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Elaborate initiation rituals and cultural significance'
        },
        {
          title: 'Highland vs Lowland Pokot Life',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Two lifestyles, one culture'
        },
        {
          title: 'Traditional Irrigation in West Pokot',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Ancient water management techniques'
        }
      ],
      categories: ['ceremonies', 'food', 'clothing', 'music', 'languages']
    },
    {
      name: 'Tharaka',
      population: '175,000',
      region: 'Tharaka-Nithi County',
      language: 'Kitharaka',
      greetings: {
        hello: 'Karibu (kah-ree-boo)',
        thankYou: 'Nkorite (n-koh-ree-teh)',
        welcome: 'Mwaki mwakana (mwah-kee mwah-kah-nah)'
      },
      highlights: ['Honey production', 'Basket weaving', 'Drought-resistant farming', 'Traditional governance'],
      description: 'Bantu people of the semi-arid eastern region, skilled in beekeeping and adapted to challenging environments. The Tharaka have developed unique survival strategies.',
      detailedInfo: 'The Tharaka people inhabit the semi-arid lowlands of Tharaka-Nithi County. They are closely related to the Meru and Embu but have developed distinct cultural practices adapted to their harsher environment. The Tharaka are renowned beekeepers, producing high-quality honey. They practice drought-resistant farming and have strong traditional medicine knowledge. Their basket weaving is distinctive and economically important. The Tharaka maintain strong traditional governance through councils of elders.',
      traditionalFoods: [
        'Honey and honey products',
        'Sorghum dishes',
        'Millet porridge',
        'Drought-resistant crops',
        'Wild fruits'
      ],
      festivals: [
        'Honey harvesting ceremonies',
        'Basket weaving competitions',
        'Traditional dances',
        'Council of elders gatherings'
      ],
      culturalSites: [
        'Beekeeping sites',
        'Sacred groves',
        'Traditional markets',
        'Basket weaving centers'
      ],
      dosAndDonts: {
        dos: [
          'Try authentic Tharaka honey',
          'Learn about drought adaptation',
          'Appreciate basket weaving art',
          'Respect traditional governance'
        ],
        donts: [
          'Don\'t disturb beehives',
          'Avoid comparing to wealthier communities',
          'Don\'t photograph without permission',
          'Never disrespect elders'
        ]
      },
      videos: [
        {
          title: 'Tharaka Honey: Liquid Gold',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Traditional beekeeping in semi-arid lands'
        },
        {
          title: 'Basket Weaving Art of Tharaka',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Intricate patterns and techniques'
        },
        {
          title: 'Surviving the Drought: Tharaka Resilience',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Adaptation strategies in harsh climates'
        }
      ],
      categories: ['food', 'arts', 'ceremonies', 'languages', 'music']
    }
  ];

  const culturalCategories = [
    { id: 'food', name: 'Traditional Foods', count: 45, description: 'Discover authentic Kenyan cuisines from different tribes' },
    { id: 'ceremonies', name: 'Ceremonies & Rituals', count: 32, description: 'Explore rites of passage and traditional celebrations' },
    { id: 'arts', name: 'Arts & Crafts', count: 28, description: 'From wood carving to beadwork and soapstone sculptures' },
    { id: 'music', name: 'Music & Dance', count: 24, description: 'Experience the rhythms and movements of Kenya' },
    { id: 'languages', name: 'Languages', count: 15, description: 'Learn greetings and phrases from diverse tongues' },
    { id: 'clothing', name: 'Traditional Clothing', count: 18, description: 'Distinctive attire and adornments of Kenyan tribes' }
  ];

  // Filter tribes based on search query and selected filters
  const filteredTribes = kenyanTribes.filter(tribe => {
    const matchesTribe = selectedTribe === 'all' || tribe.name.toLowerCase() === selectedTribe;
    const matchesCategory = selectedCategory === 'all' || tribe.categories.includes(selectedCategory);
    
    // Search functionality
    const matchesSearch = !searchQuery || (
      tribe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tribe.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tribe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tribe.detailedInfo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tribe.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tribe.traditionalFoods.some(f => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tribe.language.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return matchesTribe && matchesCategory && matchesSearch;
  });

  // Filter categories based on selected tribe
  const filteredCategories = selectedTribe === 'all' 
    ? culturalCategories 
    : culturalCategories.filter(cat => {
        const tribe = kenyanTribes.find(t => t.name.toLowerCase() === selectedTribe);
        return tribe ? tribe.categories.includes(cat.id) : true;
      });

      const filterByRecommendations = () => {
  if (!userPreferences) return;

  setShowingRecommended(true);
  
  // Auto-select user's preferred tribes
  if (userPreferences.tribes && userPreferences.tribes.length > 0) {
    setSelectedTribe(userPreferences.tribes[0].toLowerCase());
  }
  
  // Auto-select user's preferred category
  if (userPreferences.interests && userPreferences.interests.length > 0) {
    setSelectedCategory(userPreferences.interests[0]);
  }
};

  // Clear all filters when search query changes
  useEffect(() => {
    if (searchQuery) {
      setSelectedTribe('all');
      setSelectedCategory('all');
    }
  }, [searchQuery]);

  useEffect(() => {
  const loadUserPreferences = async () => {
    if (currentUser) {
      const prefs = await getUserPreferences(currentUser.uid);
      setUserPreferences(prefs);
    }
  };

  loadUserPreferences();
}, [currentUser]);

  return (
    <div className="explore-page">
      <div className="container">
        <h1>Explore Kenyan Cultures</h1>
        <p>
          Discover the rich traditions, customs, and heritage of Kenya's diverse ethnic communities.
        </p>

        {/* Show search query if present */}
        {searchQuery && (
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '2rem', 
            padding: '1rem',
            background: 'rgba(205, 133, 63, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(205, 133, 63, 0.3)'
          }}>
            <p style={{ color: '#CD853F', fontSize: '1.2rem', fontWeight: '600', margin: 0 }}>
              Searching for: <span style={{ color: '#8B4513' }}>"{searchQuery}"</span>
            </p>
            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Found {filteredTribes.length} {filteredTribes.length === 1 ? 'result' : 'results'}
            </p>
          </div>
        )}

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
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', color: '#CD853F', fontSize: '1.1rem', fontWeight: '600' }}>
          {(selectedTribe !== 'all' || selectedCategory !== 'all') && !searchQuery ? (
            <p>Showing {filteredTribes.length} {filteredTribes.length === 1 ? 'tribe' : 'tribes'}</p>
          ) : null}
        </div>

        {/* Cultural Categories Overview - Only show when not searching */}
        {!searchQuery && (selectedTribe === 'all' && selectedCategory === 'all') && (
          <section className="cultural-categories-section">
            <h2>Cultural Categories</h2>
            <div className="categories-grid">
              {culturalCategories.map(category => (
                <div 
                  key={category.id} 
                  className="category-card"
                  onClick={() => setSelectedCategory(category.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3>{category.name}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>{category.description}</p>
                  <p style={{ fontWeight: 'bold', color: '#8B4513' }}>{category.count} cultural practices</p>
                  <button>
                    Explore {category.name}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Filtered Categories (when tribe is selected) */}
        {!searchQuery && selectedTribe !== 'all' && selectedCategory === 'all' && (
          <section className="cultural-categories-section">
            <h2>{kenyanTribes.find(t => t.name.toLowerCase() === selectedTribe)?.name} Cultural Categories</h2>
            <div className="categories-grid">
              {filteredCategories.map(category => (
                <div 
                  key={category.id} 
                  className="category-card"
                  onClick={() => setSelectedCategory(category.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3>{category.name}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>{category.description}</p>
                  <p style={{ fontWeight: 'bold', color: '#8B4513' }}>{category.count} cultural practices</p>
                  <button>
                    Explore {category.name}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Smart Recommendations Button */}
{/* Smart Recommendations Button - ALWAYS SHOW for demo */}
{currentUser && (
  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
    <button
      onClick={filterByRecommendations}
      style={{
        padding: '0.9rem 2rem',
        background: 'linear-gradient(135deg, #8B6F47 0%, #6B4423 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(107, 68, 35, 0.25)',
        transition: 'all 0.3s ease'
      }}
      onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
      onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
    >
      ✨ Show My Recommendations
    </button>
  </div>
)}


{/* Showing Recommendations Badge */}
{showingRecommended && (
  <div style={{
    textAlign: 'center',
    marginBottom: '2rem',
    padding: '2rem',
    backgroundColor: '#FFF8DC',
    borderRadius: '12px',
    border: '3px solid #CD853F',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    animation: 'fadeIn 0.5s ease-in'
  }}>
    <h2 style={{ 
      color: '#8B4513', 
      fontSize: '1.8rem', 
      marginBottom: '1rem',
      fontWeight: 'bold'
    }}>
       Recommended for You 
    </h2>
    
    <p style={{ 
      color: '#654321', 
      fontSize: '1.2rem', 
      marginBottom: '0.5rem',
      fontWeight: '500'
    }}>
      Based on your interest in:
    </p>
    
    <div style={{
      display: 'inline-block',
      backgroundColor: '#CD853F',
      color: 'white',
      padding: '0.5rem 1.5rem',
      borderRadius: '25px',
      fontSize: '1.3rem',
      fontWeight: 'bold',
      margin: '1rem 0'
    }}>
      {/* Use actual preferences if available, otherwise use demo data */}
      {userPreferences?.tribes?.join(', ') || 'Kalenjin'} Culture
    </div>
    
    {/* Show interests if available */}
    {(userPreferences?.interests || ['ceremonies', 'music', 'food']).length > 0 && (
      <p style={{ 
        color: '#654321', 
        fontSize: '1.1rem',
        marginTop: '0.5rem'
      }}>
        & {(userPreferences?.interests || ['ceremonies', 'music', 'food']).map(interest => 
          culturalCategories.find(c => c.id === interest)?.name || interest
        ).join(', ')}
      </p>
    )}
    
    <button
      onClick={() => {
        setShowingRecommended(false);
        setSelectedTribe('all');
        setSelectedCategory('all');
      }}
      style={{
        marginTop: '1.5rem',
        padding: '0.8rem 2rem',
        backgroundColor: '#8B4513',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}
      onMouseOver={(e) => e.target.style.backgroundColor = '#654321'}
      onMouseOut={(e) => e.target.style.backgroundColor = '#8B4513'}
    >
      Clear Recommendations
    </button>
  </div>
)}


        {/* Kenyan Tribes Overview */}
        <section className="tribes-section">
          <h2>
            {searchQuery 
              ? 'Search Results'
              : selectedCategory !== 'all' && selectedTribe === 'all' 
              ? `Tribes with ${culturalCategories.find(c => c.id === selectedCategory)?.name}`
              : selectedCategory !== 'all' && selectedTribe !== 'all'
              ? `${kenyanTribes.find(t => t.name.toLowerCase() === selectedTribe)?.name} - ${culturalCategories.find(c => c.id === selectedCategory)?.name}`
              : selectedTribe !== 'all'
              ? `${kenyanTribes.find(t => t.name.toLowerCase() === selectedTribe)?.name} Culture`
              : 'Kenya\'s Cultural Communities'}
          </h2>

          {filteredTribes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
              <h3>No tribes found {searchQuery ? `matching "${searchQuery}"` : 'matching your filters'}</h3>
              <p>Try {searchQuery ? 'a different search term' : 'selecting different filter options'}</p>
              <button 
                onClick={() => {
                  setSelectedTribe('all');
                  setSelectedCategory('all');
                  window.location.href = '/explore';
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
                Clear {searchQuery ? 'Search & Filters' : 'Filters'}
              </button>
            </div>
          ) : (
            <div className="tribes-grid">
              {filteredTribes.map(tribe => (
                
                <div key={tribe.name} className="tribe-card" style={{ marginBottom: '2rem' }}>
                   <div style={{ 
      width: '100%', 
      overflow: 'hidden',
      borderRadius: '8px 8px 0 0',
      marginBottom: '1rem'
    }}>
      <div style={{ 
  width: '100%', 
  overflow: 'hidden',
  borderRadius: '8px 8px 0 0',
  marginBottom: '1rem'
}}>
  <img 
    src={getTribeImageUrl(tribe.name)}
    alt={`${tribe.name} tribe`}
    style={{
      width: '100%', 
      height: '300px', 
      objectFit: 'cover',
      display: 'block'
    }}
    onError={(e) => {
      // Fixed fallback - use a solid color instead
      e.target.style.display = 'none';
      e.target.parentElement.innerHTML = `
        <div style="
          width: 100%;
          height: 300px;
          background: linear-gradient(135deg, #CD853F 0%, #8B4513 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          font-weight: bold;
          border-radius: 8px 8px 0 0;
        ">
          ${tribe.name}
        </div>
      `;
    }}
  />
</div>
    </div>
                  <h3>{tribe.name} People</h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '0.5rem', 
                    marginBottom: '1rem',
                    padding: '0.8rem',
                    background: 'rgba(139, 69, 19, 0.05)',
                    borderRadius: '8px'
                  }}>
                    <p><strong>Population:</strong> {tribe.population}</p>
                    <p><strong>Region:</strong> {tribe.region}</p>
                    <p><strong>Language:</strong> {tribe.language}</p>
                  </div>

                  {/* Basic Greetings */}
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(205, 133, 63, 0.1)', 
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}>
                    <h4 style={{ color: '#8B4513', marginBottom: '0.5rem' }}>Basic Greetings:</h4>
                    <div style={{ fontSize: '0.9rem' }}>
                      <p><strong>Hello:</strong> {tribe.greetings.hello}</p>
                      <p><strong>Thank You:</strong> {tribe.greetings.thankYou}</p>
                      <p><strong>Welcome:</strong> {tribe.greetings.welcome}</p>
                    </div>
                  </div>

                  <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>{tribe.description}</p>
                  <p style={{ lineHeight: '1.6', marginBottom: '1rem', fontSize: '0.95rem', color: '#555' }}>
                    {tribe.detailedInfo}
                  </p>
                  
                  {/* Cultural Highlights */}
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ color: '#8B4513' }}>Cultural Highlights:</h4>
                    <ul style={{ columns: '2', columnGap: '1rem' }}>
                      {tribe.highlights.map((highlight, index) => (
                        <li key={index} style={{ marginBottom: '0.5rem' }}>{highlight}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Traditional Foods */}
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(255, 248, 220, 0.5)', 
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}>
                    <h4 style={{ color: '#8B4513' }}>Traditional Foods:</h4>
                    <ul>
                      {tribe.traditionalFoods.map((food, index) => (
                        <li key={index}>{food}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Festivals & Events */}
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ color: '#8B4513' }}>Festivals & Events:</h4>
                    <ul>
                      {tribe.festivals.map((festival, index) => (
                        <li key={index}>{festival}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Cultural Sites */}
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ color: '#8B4513' }}>Cultural Sites to Visit:</h4>
                    <ul>
                      {tribe.culturalSites.map((site, index) => (
                        <li key={index}>{site}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Dos and Don'ts */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ 
                      padding: '1rem', 
                      background: 'rgba(0, 255, 0, 0.05)', 
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 255, 0, 0.2)'
                    }}>
                      <h4 style={{ color: '#2d8659' }}>Cultural Dos:</h4>
                      <ul style={{ fontSize: '0.9rem' }}>
                        {tribe.dosAndDonts.dos.map((item, index) => (
                          <li key={index} style={{ marginBottom: '0.5rem' }}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div style={{ 
                      padding: '1rem', 
                      background: 'rgba(255, 0, 0, 0.05)', 
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 0, 0, 0.2)'
                    }}>
                      <h4 style={{ color: '#c0392b' }}>Cultural Don'ts:</h4>
                      <ul style={{ fontSize: '0.9rem' }}>
                        {tribe.dosAndDonts.donts.map((item, index) => (
                          <li key={index} style={{ marginBottom: '0.5rem' }}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Video Resources */}
                  <div style={{ marginTop: '1.5rem' }}>
                    <h4 style={{ color: '#8B4513', marginBottom: '1rem' }}>Learn More (Video Resources):</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {tribe.videos.map((video, index) => (
                        <div key={index} style={{ 
                          padding: '0.8rem', 
                          background: 'rgba(139, 69, 19, 0.05)', 
                          borderRadius: '8px',
                          border: '1px solid rgba(139, 69, 19, 0.1)'
                        }}>
                          <a 
                            href={video.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              color: '#8B4513', 
                              textDecoration: 'none',
                              fontWeight: 'bold',
                              fontSize: '0.95rem'
                            }}
                          >
                            {video.title}
                          </a>
                          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.3rem', marginBottom: 0 }}>
                            {video.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button style={{ marginTop: '1.5rem', width: '100%' }}>
                    Explore {tribe.name} Culture in Detail
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Clear Filters Button */}
        {(selectedTribe !== 'all' || selectedCategory !== 'all' || searchQuery) && filteredTribes.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button 
              onClick={() => {
                setSelectedTribe('all');
                setSelectedCategory('all');
                window.location.href = '/explore';
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
              Clear All {searchQuery ? '& Search' : 'Filters'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


export default Explore;