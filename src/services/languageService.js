// src/services/languageService.js
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/config';

// Comprehensive vocabulary database for major Kenyan tribes
export const languages = {
  swahili: {
    name: "Kiswahili",
    tribe: "Coastal Kenya (National Language)",
    color: "#000000ff",
    backgroundImage: '/images/tribes/swahili-bg.jpeg', // Add this
    
    vocabulary: [
      { id: 1, word: "Jambo", translation: "Hello", category: "Greetings", pronunciation: "JAHM-boh" },
      { id: 2, word: "Asante", translation: "Thank you", category: "Courtesy", pronunciation: "ah-SAHN-teh" },
      { id: 3, word: "Karibu", translation: "Welcome", category: "Greetings", pronunciation: "kah-REE-boo" },
      { id: 4, word: "Habari", translation: "How are you?", category: "Greetings", pronunciation: "hah-BAH-ree" },
      { id: 5, word: "Nzuri", translation: "Good/Fine", category: "Responses", pronunciation: "n-ZOO-ree" },
      { id: 6, word: "Pole pole", translation: "Slowly", category: "Expressions", pronunciation: "POH-leh POH-leh" },
      { id: 7, word: "Chakula", translation: "Food", category: "Daily Life", pronunciation: "chah-KOO-lah" },
      { id: 8, word: "Maji", translation: "Water", category: "Daily Life", pronunciation: "MAH-jee" },
      { id: 9, word: "Ndio", translation: "Yes", category: "Basic", pronunciation: "n-DEE-oh" },
      { id: 10, word: "Hapana", translation: "No", category: "Basic", pronunciation: "hah-PAH-nah" },
      { id: 11, word: "Tafadhali", translation: "Please", category: "Courtesy", pronunciation: "tah-fah-DHAH-lee" },
      { id: 12, word: "Samahani", translation: "Sorry/Excuse me", category: "Courtesy", pronunciation: "sah-mah-HAH-nee" },
      { id: 13, word: "Kwa heri", translation: "Goodbye", category: "Greetings", pronunciation: "kwah HEH-ree" },
      { id: 14, word: "Rafiki", translation: "Friend", category: "Relationships", pronunciation: "rah-FEE-kee" },
      { id: 15, word: "Familia", translation: "Family", category: "Relationships", pronunciation: "fah-MEE-lee-ah" },
      { id: 16, word: "Nyumbani", translation: "Home", category: "Places", pronunciation: "nyoom-BAH-nee" },
      { id: 17, word: "Shule", translation: "School", category: "Places", pronunciation: "SHOO-leh" },
      { id: 18, word: "Soko", translation: "Market", category: "Places", pronunciation: "SOH-koh" },
      { id: 19, word: "Pesa", translation: "Money", category: "Daily Life", pronunciation: "PEH-sah" },
      { id: 20, word: "Haraka", translation: "Hurry/Quick", category: "Expressions", pronunciation: "hah-RAH-kah" },
      { id: 21, word: "Mama", translation: "Mother", category: "Family", pronunciation: "MAH-mah" },
      { id: 22, word: "Baba", translation: "Father", category: "Family", pronunciation: "BAH-bah" },
      { id: 23, word: "Mtoto", translation: "Child", category: "Family", pronunciation: "m-TOH-toh" },
      { id: 24, word: "Kitu", translation: "Thing", category: "Basic", pronunciation: "KEE-too" },
      { id: 25, word: "Sana", translation: "Very/A lot", category: "Expressions", pronunciation: "SAH-nah" }
    ]
  },
  
  kikuyu: {
    name: "Gĩkũyũ",
    tribe: "Kikuyu",
    color: "#000000ff",
    backgroundImage: '/images/tribes/kikuyu-bg.jpg', // Add this
    
    vocabulary: [
      { id: 1, word: "Wĩ mwega", translation: "Hello/Good morning", category: "Greetings", pronunciation: "wee MWEH-gah" },
      { id: 2, word: "Nĩ wega", translation: "Thank you", category: "Courtesy", pronunciation: "nee WEH-gah" },
      { id: 3, word: "Ũrĩ mwega", translation: "How are you?", category: "Greetings", pronunciation: "OO-ree MWEH-gah" },
      { id: 4, word: "Ndĩ mwega", translation: "I am fine", category: "Responses", pronunciation: "n-DEE MWEH-gah" },
      { id: 5, word: "Ĩĩ", translation: "Yes", category: "Basic", pronunciation: "EE-ee" },
      { id: 6, word: "Aca", translation: "No", category: "Basic", pronunciation: "AH-chah" },
      { id: 7, word: "Irio", translation: "Food", category: "Daily Life", pronunciation: "EE-ree-oh" },
      { id: 8, word: "Maaĩ", translation: "Water", category: "Daily Life", pronunciation: "MAH-ee" },
      { id: 9, word: "Mũcii", translation: "Home", category: "Places", pronunciation: "moo-CHEE" },
      { id: 10, word: "Mũrata", translation: "Friend", category: "Relationships", pronunciation: "moo-RAH-tah" },
      { id: 11, word: "Mbeca", translation: "Money", category: "Daily Life", pronunciation: "m-BEH-chah" },
      { id: 12, word: "Thengiu", translation: "Thank you (modern)", category: "Courtesy", pronunciation: "THEN-gee-oo" },
      { id: 13, word: "Tigana", translation: "Goodbye", category: "Greetings", pronunciation: "tee-GAH-nah" },
      { id: 14, word: "Mũtumia", translation: "Woman", category: "People", pronunciation: "moo-TOO-mee-ah" },
      { id: 15, word: "Mũndũ mũrũme", translation: "Man", category: "People", pronunciation: "MOON-doo moo-ROO-meh" },
      { id: 16, word: "Mwana", translation: "Child", category: "People", pronunciation: "MWAH-nah" },
      { id: 17, word: "Nyũmba", translation: "House", category: "Places", pronunciation: "NYOOM-bah" },
      { id: 18, word: "Kĩrĩma", translation: "Mountain", category: "Nature", pronunciation: "kee-REE-mah" },
      { id: 19, word: "Mũtĩ", translation: "Tree", category: "Nature", pronunciation: "moo-TEE" },
      { id: 20, word: "Ngai", translation: "God", category: "Spiritual", pronunciation: "n-GUY" },
      { id: 21, word: "Maĩ", translation: "Mother", category: "Family", pronunciation: "MAH-ee" },
      { id: 22, word: "Baba", translation: "Father", category: "Family", pronunciation: "BAH-bah" },
      { id: 23, word: "Ũgima", translation: "Health", category: "Wellbeing", pronunciation: "oo-GEE-mah" },
      { id: 24, word: "Gĩthaka", translation: "Land", category: "Nature", pronunciation: "gee-THAH-kah" },
      { id: 25, word: "Rũgongo", translation: "Road/Path", category: "Places", pronunciation: "roo-GOH-ngoh" }
    ]
  },

  luo: {
    name: "Dholuo",
    tribe: "Luo",
    color: "#000000ff",
    backgroundImage: '/images/tribes/luo-bg.jpg', // Add this
    
    vocabulary: [
      { id: 1, word: "Misawa", translation: "Good morning", category: "Greetings", pronunciation: "mee-SAH-wah" },
      { id: 2, word: "Oyawore", translation: "Good afternoon", category: "Greetings", pronunciation: "oh-yah-WOH-reh" },
      { id: 3, word: "Erokamano", translation: "Thank you", category: "Courtesy", pronunciation: "eh-roh-kah-MAH-noh" },
      { id: 4, word: "Idhi nade?", translation: "How are you?", category: "Greetings", pronunciation: "EE-thee NAH-deh" },
      { id: 5, word: "Adhi maber", translation: "I am fine", category: "Responses", pronunciation: "AH-thee MAH-behr" },
      { id: 6, word: "Ee", translation: "Yes", category: "Basic", pronunciation: "EH-eh" },
      { id: 7, word: "Ooyo", translation: "No", category: "Basic", pronunciation: "OH-oh-yoh" },
      { id: 8, word: "Chiemo", translation: "Food", category: "Daily Life", pronunciation: "chee-EH-moh" },
      { id: 9, word: "Pi", translation: "Water", category: "Daily Life", pronunciation: "PEE" },
      { id: 10, word: "Osiep", translation: "Friend", category: "Relationships", pronunciation: "oh-SEE-ehp" },
      { id: 11, word: "Ot", translation: "Home/House", category: "Places", pronunciation: "OHT" },
      { id: 12, word: "Pesa", translation: "Money", category: "Daily Life", pronunciation: "PEH-sah" },
      { id: 13, word: "Oriti", translation: "Goodbye", category: "Greetings", pronunciation: "oh-REE-tee" },
      { id: 14, word: "Dhako", translation: "Woman", category: "People", pronunciation: "THAH-koh" },
      { id: 15, word: "Dichwo", translation: "Man", category: "People", pronunciation: "dee-CHWOH" },
      { id: 16, word: "Nyathi", translation: "Child", category: "People", pronunciation: "NYAH-thee" },
      { id: 17, word: "Joote", translation: "Everyone", category: "Expressions", pronunciation: "joh-OH-teh" },
      { id: 18, word: "Nam", translation: "Lake", category: "Nature", pronunciation: "NAHM" },
      { id: 19, word: "Yath", translation: "Tree", category: "Nature", pronunciation: "YAHT" },
      { id: 20, word: "Nyasaye", translation: "God", category: "Spiritual", pronunciation: "nyah-SAH-yeh" },
      { id: 21, word: "Mama", translation: "Mother", category: "Family", pronunciation: "MAH-mah" },
      { id: 22, word: "Wuoro", translation: "Father", category: "Family", pronunciation: "WOH-roh" },
      { id: 23, word: "Rech", translation: "Fish", category: "Food", pronunciation: "REHCH" },
      { id: 24, word: "Chir", translation: "Meat", category: "Food", pronunciation: "CHEER" },
      { id: 25, word: "Ber", translation: "Good/Beautiful", category: "Expressions", pronunciation: "BEHR" }
    ]
  },

  luhya: {
    name: "Luhya",
    tribe: "Luhya",
    color: "#000000ff",
    backgroundImage: '/images/tribes/luhya-bg.jpg', // Add this
    
    vocabulary: [
      { id: 1, word: "Musiare", translation: "Good morning", category: "Greetings", pronunciation: "moo-see-AH-reh" },
      { id: 2, word: "Mwaliire", translation: "Good afternoon", category: "Greetings", pronunciation: "mwah-LEE-reh" },
      { id: 3, word: "Sende", translation: "Thank you", category: "Courtesy", pronunciation: "SEHN-deh" },
      { id: 4, word: "Muli ata?", translation: "How are you?", category: "Greetings", pronunciation: "MOO-lee AH-tah" },
      { id: 5, word: "Ndi shilayi", translation: "I am fine", category: "Responses", pronunciation: "n-DEE shee-LAH-yee" },
      { id: 6, word: "Ee", translation: "Yes", category: "Basic", pronunciation: "EH-eh" },
      { id: 7, word: "Inde", translation: "No", category: "Basic", pronunciation: "EEN-deh" },
      { id: 8, word: "Chakuria", translation: "Food", category: "Daily Life", pronunciation: "chah-koo-REE-ah" },
      { id: 9, word: "Amatsi", translation: "Water", category: "Daily Life", pronunciation: "ah-MAHT-see" },
      { id: 10, word: "Mundu", translation: "Friend", category: "Relationships", pronunciation: "MOON-doo" },
      { id: 11, word: "Inzu", translation: "House", category: "Places", pronunciation: "EEN-zoo" },
      { id: 12, word: "Tsinuni", translation: "Money", category: "Daily Life", pronunciation: "tsee-NOO-nee" },
      { id: 13, word: "Khulola", translation: "Goodbye", category: "Greetings", pronunciation: "koo-LOH-lah" },
      { id: 14, word: "Omukhasi", translation: "Woman", category: "People", pronunciation: "oh-moo-KHAH-see" },
      { id: 15, word: "Omusatsa", translation: "Man", category: "People", pronunciation: "oh-moo-SAHT-sah" },
      { id: 16, word: "Omwana", translation: "Child", category: "People", pronunciation: "ohm-WAH-nah" },
      { id: 17, word: "Bandu", translation: "People", category: "People", pronunciation: "BAHN-doo" },
      { id: 18, word: "Litsinze", translation: "River", category: "Nature", pronunciation: "lee-TSEEN-zeh" },
      { id: 19, word: "Kumuti", translation: "Tree", category: "Nature", pronunciation: "koo-MOO-tee" },
      { id: 20, word: "Were", translation: "God", category: "Spiritual", pronunciation: "WEH-reh" },
      { id: 21, word: "Mama", translation: "Mother", category: "Family", pronunciation: "MAH-mah" },
      { id: 22, word: "Papa", translation: "Father", category: "Family", pronunciation: "PAH-pah" },
      { id: 23, word: "Amalaa", translation: "Good", category: "Expressions", pronunciation: "ah-mah-LAH" },
      { id: 24, word: "Bukali", translation: "Ugali", category: "Food", pronunciation: "boo-KAH-lee" },
      { id: 25, word: "Shilayi", translation: "Well/Fine", category: "Responses", pronunciation: "shee-LAH-yee" }
    ]
  },

  kalenjin: {
    name: "Kalenjin",
    tribe: "Kalenjin",
    color: "#000000ff",
    backgroundImage: '/images/tribes/kalenjin-bg.jpeg', // Add this
    
    vocabulary: [
      { id: 1, word: "Chamuge", translation: "Good morning", category: "Greetings", pronunciation: "chah-MOO-geh" },
      { id: 2, word: "Asubuini", translation: "Good afternoon", category: "Greetings", pronunciation: "ah-soo-boo-EE-nee" },
      { id: 3, word: "Kong'o", translation: "Thank you", category: "Courtesy", pronunciation: "KOHNG-oh" },
      { id: 4, word: "Chamuge ngoo?", translation: "How are you?", category: "Greetings", pronunciation: "chah-MOO-geh n-GOH" },
      { id: 5, word: "Chamuge kobongo", translation: "I am fine", category: "Responses", pronunciation: "chah-MOO-geh koh-BOH-ngoh" },
      { id: 6, word: "Ee", translation: "Yes", category: "Basic", pronunciation: "EH-eh" },
      { id: 7, word: "Mami", translation: "No", category: "Basic", pronunciation: "MAH-mee" },
      { id: 8, word: "Murecho", translation: "Food", category: "Daily Life", pronunciation: "moo-REH-choh" },
      { id: 9, word: "Peek", translation: "Water", category: "Daily Life", pronunciation: "PEHK" },
      { id: 10, word: "Lagok", translation: "Friend", category: "Relationships", pronunciation: "lah-GOHK" },
      { id: 11, word: "Kot", translation: "House", category: "Places", pronunciation: "KOHT" },
      { id: 12, word: "Tilil", translation: "Money", category: "Daily Life", pronunciation: "tee-LEEL" },
      { id: 13, word: "Sere", translation: "Goodbye", category: "Greetings", pronunciation: "SEH-reh" },
      { id: 14, word: "Chepyosok", translation: "Woman", category: "People", pronunciation: "cheh-PYOH-sohk" },
      { id: 15, word: "Korir", translation: "Man", category: "People", pronunciation: "koh-REER" },
      { id: 16, word: "Lakwet", translation: "Child", category: "People", pronunciation: "lahk-WEHT" },
      { id: 17, word: "Bichu", translation: "All/Everyone", category: "Expressions", pronunciation: "BEE-choo" },
      { id: 18, word: "Muruet", translation: "River", category: "Nature", pronunciation: "moo-ROO-eht" },
      { id: 19, word: "Miti", translation: "Tree", category: "Nature", pronunciation: "MEE-tee" },
      { id: 20, word: "Asis", translation: "God", category: "Spiritual", pronunciation: "AH-sees" },
      { id: 21, word: "Kwondo", translation: "Mother", category: "Family", pronunciation: "KWOHN-doh" },
      { id: 22, word: "Papa", translation: "Father", category: "Family", pronunciation: "PAH-pah" },
      { id: 23, word: "Matet", translation: "Milk", category: "Food", pronunciation: "mah-TEHT" },
      { id: 24, word: "Mursik", translation: "Fermented milk", category: "Food", pronunciation: "MOOR-seek" },
      { id: 25, word: "Tugul", translation: "All/Everything", category: "Expressions", pronunciation: "TOO-gool" }
    ]
  },

  kamba: {
    name: "Kĩkamba",
    tribe: "Kamba",
    color: "#000000ff",
    backgroundImage: '/images/tribes/kamba-bg.jpeg', // Add this
    
    vocabulary: [
      { id: 1, word: "Mwĩyukĩ", translation: "Good morning", category: "Greetings", pronunciation: "mwee-yoo-KEE" },
      { id: 2, word: "Mwalĩkwa", translation: "Good afternoon", category: "Greetings", pronunciation: "mwah-LEEK-wah" },
      { id: 3, word: "Nĩ wa", translation: "Thank you", category: "Courtesy", pronunciation: "nee WAH" },
      { id: 4, word: "Wĩ ata?", translation: "How are you?", category: "Greetings", pronunciation: "wee AH-tah" },
      { id: 5, word: "Nĩ syaa", translation: "I am fine", category: "Responses", pronunciation: "nee SYAH" },
      { id: 6, word: "Ĩĩ", translation: "Yes", category: "Basic", pronunciation: "EE-ee" },
      { id: 7, word: "Ndia", translation: "No", category: "Basic", pronunciation: "n-DEE-ah" },
      { id: 8, word: "Kyakulya", translation: "Food", category: "Daily Life", pronunciation: "kyah-koo-LYAH" },
      { id: 9, word: "Maĩ", translation: "Water", category: "Daily Life", pronunciation: "MAH-ee" },
      { id: 10, word: "Muinuane", translation: "Friend", category: "Relationships", pronunciation: "moo-ee-noo-AH-neh" },
      { id: 11, word: "Musyi", translation: "Home", category: "Places", pronunciation: "MOO-syee" },
      { id: 12, word: "Mbesa", translation: "Money", category: "Daily Life", pronunciation: "m-BEH-sah" },
      { id: 13, word: "Ndakena", translation: "Goodbye", category: "Greetings", pronunciation: "n-dah-KEH-nah" },
      { id: 14, word: "Mũndũũme", translation: "Man", category: "People", pronunciation: "moon-DOO-meh" },
      { id: 15, word: "Mũndũmũka", translation: "Woman", category: "People", pronunciation: "moon-doo-MOO-kah" },
      { id: 16, word: "Mwana", translation: "Child", category: "People", pronunciation: "MWAH-nah" },
      { id: 17, word: "Andu", translation: "People", category: "People", pronunciation: "AHN-doo" },
      { id: 18, word: "Ĩthemba", translation: "River", category: "Nature", pronunciation: "ee-THEHM-bah" },
      { id: 19, word: "Mũtĩ", translation: "Tree", category: "Nature", pronunciation: "moo-TEE" },
      { id: 20, word: "Ngai", translation: "God", category: "Spiritual", pronunciation: "n-GUY" },
      { id: 21, word: "Mwĩa", translation: "Mother", category: "Family", pronunciation: "MWEE-ah" },
      { id: 22, word: "Tata", translation: "Father", category: "Family", pronunciation: "TAH-tah" },
      { id: 23, word: "Nyama", translation: "Meat", category: "Food", pronunciation: "NYAH-mah" },
      { id: 24, word: "Mbũa", translation: "Dog", category: "Animals", pronunciation: "m-BOO-ah" },
      { id: 25, word: "Nguku", translation: "Chicken", category: "Animals", pronunciation: "n-GOO-koo" }
    ]
  },

  kisii: {
    name: "Ekegusii",
    tribe: "Kisii (Gusii)",
    color: "#000000ff",
    backgroundImage: '/images/tribes/kisii-bg.jpeg', // Add this
    
    vocabulary: [
      { id: 1, word: "Bwairire", translation: "Good morning", category: "Greetings", pronunciation: "bwah-ee-REE-reh" },
      { id: 2, word: "Mweire", translation: "Good afternoon", category: "Greetings", pronunciation: "mweh-EE-reh" },
      { id: 3, word: "Konywa mono", translation: "Thank you", category: "Courtesy", pronunciation: "KOHN-ywah MOH-noh" },
      { id: 4, word: "Naki?", translation: "How are you?", category: "Greetings", pronunciation: "NAH-kee" },
      { id: 5, word: "Ndaire", translation: "I am fine", category: "Responses", pronunciation: "n-DAH-ee-reh" },
      { id: 6, word: "Ee", translation: "Yes", category: "Basic", pronunciation: "EH-eh" },
      { id: 7, word: "Inde", translation: "No", category: "Basic", pronunciation: "EEN-deh" },
      { id: 8, word: "Ebinto", translation: "Food", category: "Daily Life", pronunciation: "eh-BEEN-toh" },
      { id: 9, word: "Amate", translation: "Water", category: "Daily Life", pronunciation: "ah-MAH-teh" },
      { id: 10, word: "Mokoreri", translation: "Friend", category: "Relationships", pronunciation: "moh-koh-REH-ree" },
      { id: 11, word: "Cheka", translation: "House", category: "Places", pronunciation: "CHEH-kah" },
      { id: 12, word: "Chuma", translation: "Money", category: "Daily Life", pronunciation: "CHOO-mah" },
      { id: 13, word: "Nkorire", translation: "Goodbye", category: "Greetings", pronunciation: "n-koh-REE-reh" },
      { id: 14, word: "Omogeri", translation: "Woman", category: "People", pronunciation: "oh-moh-GEH-ree" },
      { id: 15, word: "Omoura", translation: "Man", category: "People", pronunciation: "oh-MOH-oo-rah" },
      { id: 16, word: "Omwana", translation: "Child", category: "People", pronunciation: "ohm-WAH-nah" },
      { id: 17, word: "Abandu", translation: "People", category: "People", pronunciation: "ah-BAHN-doo" },
      { id: 18, word: "Rioge", translation: "River", category: "Nature", pronunciation: "ree-OH-geh" },
      { id: 19, word: "Omoti", translation: "Tree", category: "Nature", pronunciation: "oh-MOH-tee" },
      { id: 20, word: "Engoro", translation: "God", category: "Spiritual", pronunciation: "ehn-GOH-roh" },
      { id: 21, word: "Baba", translation: "Father", category: "Family", pronunciation: "BAH-bah" },
      { id: 22, word: "Maaitwe", translation: "Mother", category: "Family", pronunciation: "mah-AH-eet-weh" },
      { id: 23, word: "Obokima", translation: "Ugali", category: "Food", pronunciation: "oh-boh-KEE-mah" },
      { id: 24, word: "Chinene", translation: "Big", category: "Descriptions", pronunciation: "chee-NEH-neh" },
      { id: 25, word: "Chito", translation: "Small", category: "Descriptions", pronunciation: "CHEE-toh" }
    ]
  },

  meru: {
    name: "Kĩmĩrũ",
    tribe: "Meru",
    color: "#000000ff",
    backgroundImage: '/images/tribes/meru-bg.jpeg', // Add this
    
    vocabulary: [
      { id: 1, word: "Mega atene", translation: "Good morning", category: "Greetings", pronunciation: "MEH-gah ah-TEH-neh" },
      { id: 2, word: "Mũkena", translation: "Thank you", category: "Courtesy", pronunciation: "moo-KEH-nah" },
      { id: 3, word: "Nĩ mega?", translation: "How are you?", category: "Greetings", pronunciation: "nee MEH-gah" },
      { id: 4, word: "Nĩ mega", translation: "I am fine", category: "Responses", pronunciation: "nee MEH-gah" },
      { id: 5, word: "Ĩĩ", translation: "Yes", category: "Basic", pronunciation: "EE-ee" },
      { id: 6, word: "Aca", translation: "No", category: "Basic", pronunciation: "AH-chah" },
      { id: 7, word: "Irio", translation: "Food", category: "Daily Life", pronunciation: "EE-ree-oh" },
      { id: 8, word: "Maaĩ", translation: "Water", category: "Daily Life", pronunciation: "MAH-ee" },
      { id: 9, word: "Mũrata", translation: "Friend", category: "Relationships", pronunciation: "moo-RAH-tah" },
      { id: 10, word: "Mũciĩ", translation: "Home", category: "Places", pronunciation: "moo-CHEE" },
      { id: 11, word: "Mbeca", translation: "Money", category: "Daily Life", pronunciation: "m-BEH-chah" },
      { id: 12, word: "Tigana", translation: "Goodbye", category: "Greetings", pronunciation: "tee-GAH-nah" },
      { id: 13, word: "Mũtumia", translation: "Woman", category: "People", pronunciation: "moo-TOO-mee-ah" },
      { id: 14, word: "Mũndurũme", translation: "Man", category: "People", pronunciation: "moon-doo-ROO-meh" },
      { id: 15, word: "Mwana", translation: "Child", category: "People", pronunciation: "MWAH-nah" },
      { id: 16, word: "Andũ", translation: "People", category: "People", pronunciation: "ahn-DOO" },
      { id: 17, word: "Rũũĩ", translation: "River", category: "Nature", pronunciation: "ROO-ee" },

      { id: 18, word: "Mũtĩ", translation: "Tree", category: "Nature", pronunciation: "moo-TEE" },
      { id: 19, word: "Ngai", translation: "God", category: "Spiritual", pronunciation: "n-GUY" },
      { id: 20, word: "Kĩrĩma", translation: "Mountain", category: "Nature", pronunciation: "kee-REE-mah" },
      { id: 21, word: "Maitũ", translation: "Mother", category: "Family", pronunciation: "MAH-ee-too" },
      { id: 22, word: "Baba", translation: "Father", category: "Family", pronunciation: "BAH-bah" },
      { id: 23, word: "Nyũmba", translation: "House", category: "Places", pronunciation: "NYOOM-bah" },
      { id: 24, word: "Mũgũnda", translation: "Farm/Garden", category: "Places", pronunciation: "moo-GOON-dah" },
      { id: 25, word: "Miraa", translation: "Khat/Miraa", category: "Culture", pronunciation: "mee-RAH" }
    ]
  },

  mijikenda: {
    name: "Kimijikenda",
    tribe: "Mijikenda",
    color: "#000000ff",
    backgroundImage: '/images/tribes/mijikenda-bg.jpeg', // Add this
    
    vocabulary: [
      { id: 1, word: "Marahaba", translation: "Hello", category: "Greetings", pronunciation: "mah-rah-HAH-bah" },
      { id: 2, word: "Hujambo", translation: "How are you?", category: "Greetings", pronunciation: "hoo-JAHM-boh" },
      { id: 3, word: "Shukrani", translation: "Thank you", category: "Courtesy", pronunciation: "shoo-KRAH-nee" },
      { id: 4, word: "Sijambo", translation: "I am fine", category: "Responses", pronunciation: "see-JAHM-boh" },
      { id: 5, word: "Ndiyo", translation: "Yes", category: "Basic", pronunciation: "n-DEE-yoh" },
      { id: 6, word: "Hapana", translation: "No", category: "Basic", pronunciation: "hah-PAH-nah" },
      { id: 7, word: "Chakula", translation: "Food", category: "Daily Life", pronunciation: "chah-KOO-lah" },
      { id: 8, word: "Madzi", translation: "Water", category: "Daily Life", pronunciation: "MAH-dzee" },
      { id: 9, word: "Rafiki", translation: "Friend", category: "Relationships", pronunciation: "rah-FEE-kee" },
      { id: 10, word: "Mudzi", translation: "Home/Village", category: "Places", pronunciation: "MOO-dzee" },
      { id: 11, word: "Hela", translation: "Money", category: "Daily Life", pronunciation: "HEH-lah" },
      { id: 12, word: "Kwaheri", translation: "Goodbye", category: "Greetings", pronunciation: "kwah-HEH-ree" },
      { id: 13, word: "Muche", translation: "Woman", category: "People", pronunciation: "MOO-cheh" },
      { id: 14, word: "Murume", translation: "Man", category: "People", pronunciation: "moo-ROO-meh" },
      { id: 15, word: "Mwana", translation: "Child", category: "People", pronunciation: "MWAH-nah" },
      { id: 16, word: "Andu", translation: "People", category: "People", pronunciation: "AHN-doo" },
      { id: 17, word: "Bahari", translation: "Ocean/Sea", category: "Nature", pronunciation: "bah-HAH-ree" },
      { id: 18, word: "Muti", translation: "Tree", category: "Nature", pronunciation: "MOO-tee" },
      { id: 19, word: "Mulungu", translation: "God", category: "Spiritual", pronunciation: "moo-LOON-goo" },
      { id: 20, word: "Kaya", translation: "Sacred forest", category: "Culture", pronunciation: "KAH-yah" },
      { id: 21, word: "Mayi", translation: "Mother", category: "Family", pronunciation: "MAH-yee" },
      { id: 22, word: "Baba", translation: "Father", category: "Family", pronunciation: "BAH-bah" },
      { id: 23, word: "Samaki", translation: "Fish", category: "Food", pronunciation: "sah-MAH-kee" },
      { id: 24, word: "Pwani", translation: "Coast", category: "Places", pronunciation: "PWAH-nee" },
      { id: 25, word: "Bandari", translation: "Port/Harbor", category: "Places", pronunciation: "bahn-DAH-ree" }
    ]
  },

  maasai: {
    name: "Maa",
    tribe: "Maasai",
    color: "#000000ff",
    backgroundImage: '/images/tribes/maasai-bg.jpeg', // Add this
    
    vocabulary: [
      { id: 1, word: "Sopa", translation: "Hello", category: "Greetings", pronunciation: "SOH-pah" },
      { id: 2, word: "Ashe oleng", translation: "Thank you", category: "Courtesy", pronunciation: "AH-sheh oh-LEHNG" },
      { id: 3, word: "Takwenya?", translation: "How are you?", category: "Greetings", pronunciation: "tahk-WEHN-yah" },
      { id: 4, word: "Eiko", translation: "I am fine", category: "Responses", pronunciation: "EH-ee-koh" },
      { id: 5, word: "Ee", translation: "Yes", category: "Basic", pronunciation: "EH-eh" },
      { id: 6, word: "Mme", translation: "No", category: "Basic", pronunciation: "m-MEH" },
      { id: 7, word: "Nkiri", translation: "Food", category: "Daily Life", pronunciation: "n-KEE-ree" },
      { id: 8, word: "Enkare", translation: "Water", category: "Daily Life", pronunciation: "ehn-KAH-reh" },
      { id: 9, word: "Esidai", translation: "Friend", category: "Relationships", pronunciation: "eh-see-DAH-ee" },
      { id: 10, word: "Enkang", translation: "Home/Village", category: "Places", pronunciation: "ehn-KAHNG" },
      { id: 11, word: "Isangiki", translation: "Money", category: "Daily Life", pronunciation: "ee-sahn-GEE-kee" },
      { id: 12, word: "Sere", translation: "Goodbye", category: "Greetings", pronunciation: "SEH-reh" },
      { id: 13, word: "Entomononi", translation: "Woman", category: "People", pronunciation: "ehn-toh-moh-NOH-nee" },
      { id: 14, word: "Olmurrani", translation: "Warrior/Man", category: "People", pronunciation: "ohl-moor-RAH-nee" },
      { id: 15, word: "Engera", translation: "Child", category: "People", pronunciation: "ehn-GEH-rah" },
      { id: 16, word: "Ilomon", translation: "People", category: "People", pronunciation: "ee-LOH-mohn" },
      { id: 17, word: "Enkop", translation: "Land", category: "Nature", pronunciation: "ehn-KOHP" },
      { id: 18, word: "Olorien", translation: "Tree", category: "Nature", pronunciation: "oh-loh-REE-ehn" },
      { id: 19, word: "Enkai", translation: "God", category: "Spiritual", pronunciation: "ehn-KAH-ee" },
      { id: 20, word: "Inkishu", translation: "Cattle/Cow", category: "Animals", pronunciation: "een-KEE-shoo" },
      { id: 21, word: "Yeyo", translation: "Mother", category: "Family", pronunciation: "YEH-yoh" },
      { id: 22, word: "Papa", translation: "Father", category: "Family", pronunciation: "PAH-pah" },
      { id: 23, word: "Kule narok", translation: "Red/Beautiful", category: "Descriptions", pronunciation: "KOO-leh nah-ROHK" },
      { id: 24, word: "Manyatta", translation: "Traditional home", category: "Culture", pronunciation: "mahn-YAH-tah" },
      { id: 25, word: "Oloip", translation: "Milk", category: "Food", pronunciation: "oh-LOH-eep" }
    ]
  },

  turkana: {
    name: "Ng'aturkana",
    tribe: "Turkana",
    color: "#000000ff",
    backgroundImage: '/images/tribes/turkana-bg.jpeg', // Add this
    
    vocabulary: [
      { id: 1, word: "Yoga ejokae", translation: "Good morning", category: "Greetings", pronunciation: "YOH-gah eh-joh-KAH-eh" },
      { id: 2, word: "Ejoka noi", translation: "Thank you", category: "Courtesy", pronunciation: "eh-JOH-kah NOH-ee" },
      { id: 3, word: "Ibore ng'un?", translation: "How are you?", category: "Greetings", pronunciation: "ee-BOH-reh n-GOON" },
      { id: 4, word: "Ejoka arai", translation: "I am fine", category: "Responses", pronunciation: "eh-JOH-kah ah-RAH-ee" },
      { id: 5, word: "Ee", translation: "Yes", category: "Basic", pronunciation: "EH-eh" },
      { id: 6, word: "Mam", translation: "No", category: "Basic", pronunciation: "MAHM" },
      { id: 7, word: "Akipi", translation: "Food", category: "Daily Life", pronunciation: "ah-KEE-pee" },
      { id: 8, word: "Akimu", translation: "Water", category: "Daily Life", pronunciation: "ah-KEE-moo" },
      { id: 9, word: "Ekaale", translation: "Friend", category: "Relationships", pronunciation: "eh-KAH-leh" },
      { id: 10, word: "Akiriket", translation: "Home", category: "Places", pronunciation: "ah-kee-ree-KEHT" },
      { id: 11, word: "Atikis", translation: "Money", category: "Daily Life", pronunciation: "ah-tee-KEES" },
      { id: 12, word: "Ka ng'iboro", translation: "Goodbye", category: "Greetings", pronunciation: "kah n-gee-BOH-roh" },
      { id: 13, word: "Aberu", translation: "Woman", category: "People", pronunciation: "ah-BEH-roo" },
      { id: 14, word: "Ekapolon", translation: "Man", category: "People", pronunciation: "eh-kah-poh-LOHN" },
      { id: 15, word: "Ekai", translation: "Child", category: "People", pronunciation: "eh-KAH-ee" },
      { id: 16, word: "Ngitunga", translation: "People", category: "People", pronunciation: "n-gee-TOON-gah" },
      { id: 17, word: "Aturio", translation: "River", category: "Nature", pronunciation: "ah-too-REE-oh" },
      { id: 18, word: "Ekeriai", translation: "Tree", category: "Nature", pronunciation: "eh-keh-ree-AH-ee" },
      { id: 19, word: "Akuj", translation: "God", category: "Spiritual", pronunciation: "ah-KOOJ" },
      { id: 20, word: "Ng'akipi", translation: "Camel", category: "Animals", pronunciation: "n-gah-KEE-pee" },
      { id: 21, word: "Toto", translation: "Mother", category: "Family", pronunciation: "TOH-toh" },
      { id: 22, word: "Papa", translation: "Father", category: "Family", pronunciation: "PAH-pah" },
      { id: 23, word: "Ng'akwap", translation: "Goat", category: "Animals", pronunciation: "n-gah-KWAHP" },
      { id: 24, word: "Emuron", translation: "Elder/Prophet", category: "Culture", pronunciation: "eh-moo-ROHN" },
      { id: 25, word: "Edeke", translation: "Dance", category: "Culture", pronunciation: "eh-DEH-keh" }
    ]

    
  }
};

// Get all available languages
export const getLanguages = () => {
  return Object.keys(languages).map(key => ({
    id: key,
    ...languages[key]
  }));
};

// Get vocabulary for a specific language
export const getVocabulary = (languageId) => {
  return languages[languageId]?.vocabulary || [];
};

// Get categories for a language
export const getCategories = (languageId) => {
  const vocab = getVocabulary(languageId);
  const categories = [...new Set(vocab.map(word => word.category))];
  return categories;
};

// Get user's language progress
export const getUserProgress = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data().languageProgress || {};
    }
    return {};
  } catch (error) {
    console.error('Error getting user progress:', error);
    return {};
  }
};

// Save learned word
export const markWordLearned = async (userId, languageId, wordId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const progressKey = `languageProgress.${languageId}.learnedWords`;
    
    await updateDoc(userRef, {
      [progressKey]: arrayUnion(wordId)
    });
    
    return { error: null };
  } catch (error) {
    console.error('Error marking word learned:', error);
    return { error: 'Failed to save progress' };
  }
};

// Save quiz result
export const saveQuizResult = async (userId, languageId, score, total) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const currentProgress = userSnap.data()?.languageProgress || {};
    const langProgress = currentProgress[languageId] || {};
    
    await updateDoc(userRef, {
      [`languageProgress.${languageId}`]: {
        ...langProgress,
        quizzesTaken: (langProgress.quizzesTaken || 0) + 1,
        totalScore: (langProgress.totalScore || 0) + score,
        lastQuizDate: new Date()
      }
    });
    
    return { error: null };
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return { error: 'Failed to save quiz result' };
  }
};

// Text-to-speech function with language code mapping
const getLanguageCode = (languageId) => {
  const languageCodes = {
    swahili: 'sw-KE',
    kikuyu: 'sw-KE', // Fallback to Swahili
    luo: 'sw-KE',
    luhya: 'sw-KE',
    kalenjin: 'sw-KE',
    kamba: 'sw-KE',
    kisii: 'sw-KE',
    meru: 'sw-KE',
    mijikenda: 'sw-KE',
    maasai: 'sw-KE',
    turkana: 'sw-KE'
  };
  return languageCodes[languageId] || 'sw-KE';
};

export const speakWord = (word, languageId = 'swahili') => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = getLanguageCode(languageId);
    utterance.rate = 0.7; // Slower for learning
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }
};

