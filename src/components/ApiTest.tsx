import React, { useState, useEffect } from 'react';
import { getTopHeadlines } from '../services/newsApi';

const ApiTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Loading...');
  const [articles, setArticles] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const testApi = async () => {
      try {
        setStatus('Testing API connection...');
        
        // Log environment variable status
        console.log('Environment check:', {
          hasApiKey: !!process.env.REACT_APP_NEWS_API_KEY,
          apiKeyLength: process.env.REACT_APP_NEWS_API_KEY?.length || 0
        });
        
        const response = await getTopHeadlines();
        setArticles(response.articles || []);
        setStatus(`Success! Found ${response.articles?.length || 0} articles`);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        setStatus('Failed to load articles');
        console.error('API Test Error:', err);
      }
    };

    testApi();
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>API Test Component</h3>
      <p><strong>Status:</strong> {status}</p>
      {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
      <p><strong>Articles found:</strong> {articles.length}</p>
      
      {articles.length > 0 && (
        <div>
          <h4>First 3 Articles:</h4>
          {articles.slice(0, 3).map((article, index) => (
            <div key={index} style={{ margin: '10px 0', padding: '10px', border: '1px solid #eee' }}>
              <h5>{article.title}</h5>
              <p>{article.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiTest; 