# CultureLink Kenya 🇰🇪

A cultural exploration platform that connects users with the rich and diverse cultures of Kenya's 42+ tribes. Built with React and Firebase.

##  Features

### Authentication & User Management
- User registration & login (Email/Password and Google Auth)
- Email verification and password reset
- Profile management with photo upload
- Cultural preferences and personalized experience

### Blog System
- Create, read, update, and delete blog posts
- Image upload for featured images
- Like and save posts
- Search and filter by tribe/category
- View counter tracking

### Recommendation System
- Content-based filtering recommends posts based on user's liked and saved content
- Analyzes preferred tribes from user interactions
- Personalized "Recommended for You" feed
- Falls back to popular posts for new users

### User Profile
- Profile completion progress tracker
- Achievement badges system
- View saved and liked blog posts
- Change password functionality

### UI/UX
- Kenyan-inspired design (flag colors: black, red, green, white)
- Responsive design for all devices
- Hover-activated sidebar navigation
- Smooth animations and transitions

##  Technologies

- **Frontend:** React.js, React Router, Lucide React, CSS3
- **Backend:** Firebase Authentication, Cloud Firestore, Firebase Storage
- **Fonts:** Inter (body), Sora (headings)

##  Installation
```bash
# Clone repository
git clone https://github.com/yourusername/culturelink-kenya.git

# Install dependencies
npm install

# Configure Firebase (create src/firebase/config.js with your credentials)

# Run development server
npm start
