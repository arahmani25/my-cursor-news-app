export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { query, page = 1, pageSize = 20, country = 'us' } = req.query;
    
    // Get API key from environment variable
    const apiKey = process.env.REACT_APP_NEWS_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Build the News API URL
    let url = 'https://newsapi.org/v2/';
    
    if (query) {
      // Search everything
      url += `everything?q=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;
    } else {
      // Get top headlines
      url += `top-headlines?country=${country}&pageSize=${pageSize}&apiKey=${apiKey}`;
    }

    // Fetch from News API
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('News API proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
} 