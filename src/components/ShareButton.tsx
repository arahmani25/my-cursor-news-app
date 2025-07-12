import React, { useState } from 'react';
import { Article } from '../types';

interface ShareButtonProps {
  article: Article;
  size?: 'small' | 'medium' | 'large';
}

const ShareButton: React.FC<ShareButtonProps> = ({ article, size = 'medium' }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareData = {
    title: article.title,
    text: article.description || 'Check out this interesting article!',
    url: article.url
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(article.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.log('Error copying link:', error);
    }
  };

  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(article.url);
    const encodedTitle = encodeURIComponent(article.title);
    const encodedText = encodeURIComponent(article.description || '');

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const sizeClasses = {
    small: 'share-button-small',
    medium: 'share-button-medium',
    large: 'share-button-large'
  };

  return (
    <div className="share-button-container">
      <button
        onClick={handleShare}
        className={`share-button ${sizeClasses[size]}`}
        title="Share article"
      >
        📤 Share
      </button>

      {showShareMenu && (
        <div className="share-menu">
          <div className="share-menu-header">
            <h4>Share Article</h4>
            <button
              onClick={() => setShowShareMenu(false)}
              className="close-share-menu"
            >
              ✕
            </button>
          </div>
          
          <div className="share-options">
            <button
              onClick={() => handleSocialShare('twitter')}
              className="share-option twitter"
            >
              🐦 Twitter
            </button>
            
            <button
              onClick={() => handleSocialShare('facebook')}
              className="share-option facebook"
            >
              📘 Facebook
            </button>
            
            <button
              onClick={() => handleSocialShare('linkedin')}
              className="share-option linkedin"
            >
              💼 LinkedIn
            </button>
            
            <button
              onClick={() => handleSocialShare('whatsapp')}
              className="share-option whatsapp"
            >
              💬 WhatsApp
            </button>
            
            <button
              onClick={handleCopyLink}
              className="share-option copy-link"
            >
              {copied ? '✅ Copied!' : '📋 Copy Link'}
            </button>
          </div>
        </div>
      )}

      {showShareMenu && (
        <div
          className="share-menu-overlay"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
};

export default ShareButton; 