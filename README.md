# News App - TripleTen Final Project

A modern, responsive news application that allows users to search for recent news articles, register/login, and save articles to their profiles. Built with React, TypeScript, and integrated with the NewsAPI.org service.

## Features

- 🔍 **News Search**: Search for news articles by keywords
- 📰 **Top Headlines**: Browse latest news from around the world
- 👤 **User Authentication**: Register and login functionality
- 💾 **Article Management**: Save and unsave articles to your profile
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router DOM
- **Styling**: CSS3 with responsive design
- **API**: NewsAPI.org for news data
- **State Management**: React Context API
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd news-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get NewsAPI Key**
   - Visit [https://newsapi.org](https://newsapi.org)
   - Sign up for a free account
   - Get your API key

4. **Configure API Key**
   - Open `src/services/newsApi.ts`
   - Replace `223fe5e8f44845d5bb0250dd3f548979` with your actual API key:
   ```typescript
   const API_KEY = '223fe5e8f44845d5bb0250dd3f548979';
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The app should now be running!

## Project Structure

```
src/
├── components/          # React components
│   ├── ArticleCard.tsx # Individual article display
│   ├── Header.tsx      # Navigation header
│   ├── Home.tsx        # Main search page
│   ├── Login.tsx       # Login form
│   ├── Profile.tsx     # User profile page
│   ├── ProtectedRoute.tsx # Route protection
│   └── Register.tsx    # Registration form
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── services/           # API services
│   └── newsApi.ts      # NewsAPI integration
├── types/              # TypeScript types
│   └── index.ts        # Type definitions
├── App.tsx             # Main app component
├── App.css             # Global styles
└── index.tsx           # App entry point
```

## Usage

### For Users

1. **Browse News**: Visit the home page to see top headlines
2. **Search Articles**: Use the search bar to find specific news
3. **Register/Login**: Create an account or login to save articles
4. **Save Articles**: Click "Save" on any article to add it to your profile
5. **View Profile**: Visit your profile to see all saved articles
6. **Remove Articles**: Click "Unsave" to remove articles from your profile

### For Developers

- **Adding New Features**: Create new components in the `components/` directory
- **Styling**: Modify `src/App.css` for global styles
- **API Integration**: Add new API calls in `src/services/`
- **Type Safety**: Define new types in `src/types/index.ts`

## API Integration

The app integrates with [NewsAPI.org](https://newsapi.org) to fetch news data:

- **Search Articles**: `/everything` endpoint for keyword searches
- **Top Headlines**: `/top-headlines` endpoint for latest news
- **Rate Limits**: Free tier allows 100 requests per day

## Responsive Design

The application is fully responsive and works on:

- **Desktop**: Full layout with grid display
- **Tablet**: Adjusted grid and navigation
- **Mobile**: Single column layout with mobile-optimized navigation

## Authentication

Currently uses a mock authentication system with localStorage:

- User data is stored in browser localStorage
- No backend server required
- Easy to extend with real authentication

## Future Enhancements

- [ ] Real backend authentication
- [ ] Pagination for search results
- [ ] Article categories and filtering
- [ ] Dark mode toggle
- [ ] Offline article reading
- [ ] Push notifications for breaking news

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created for educational purposes as part of the TripleTen Software Engineering Program.

## Support

For questions or issues:
- Check the [NewsAPI documentation](https://newsapi.org/docs)
- Review the React and TypeScript documentation
- Contact your TripleTen mentor

---

**Note**: This is a demonstration project. In a production environment, you would need to implement proper security measures, error handling, and backend services. 