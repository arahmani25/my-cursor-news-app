# Quick Setup Guide

## Step 1: Install Node.js
If you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org/)

## Step 2: Install Dependencies
Open your terminal in the project directory and run:
```bash
npm install
```

## Step 3: Get NewsAPI Key
1. Go to [https://newsapi.org](https://newsapi.org)
2. Click "Get API Key"
3. Sign up for a free account
4. Copy your API key

## Step 4: Configure API Key
1. Open `src/services/newsApi.ts`
2. Find this line: `const API_KEY = 'YOUR_NEWS_API_KEY';`
3. Replace `YOUR_NEWS_API_KEY` with your actual API key
4. Save the file

## Step 5: Start the Application
```bash
npm start
```

## Step 6: Open in Browser
Navigate to `http://localhost:3000`

## Troubleshooting

### If you see linter errors:
- These are expected since dependencies aren't installed yet
- Run `npm install` to resolve them

### If the app doesn't load:
- Check that Node.js is installed: `node --version`
- Make sure you're in the correct directory
- Try running `npm install` again

### If API calls fail:
- Verify your API key is correct
- Check that you've replaced `YOUR_NEWS_API_KEY` in the code
- Ensure you have an internet connection

## Features to Test

1. **Home Page**: Should show top headlines
2. **Search**: Type keywords to search for news
3. **Registration**: Create a new account
4. **Login**: Sign in with your credentials
5. **Save Articles**: Click "Save" on articles (requires login)
6. **Profile**: View your saved articles
7. **Responsive Design**: Try resizing the browser window

## API Limits
- Free NewsAPI account: 100 requests per day
- Paid plans available for higher limits 