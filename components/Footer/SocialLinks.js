import React from 'react';

const SocialLinks = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/watchmoviehub',
      icon: '📘',
      color: '#1877F2'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/watchmoviehub',
      icon: '🐦',
      color: '#1DA1F2'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/watchmoviehub',
      icon: '📷',
      color: '#E4405F'
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@watchmoviehub',
      icon: '📺',
      color: '#FF0000'
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@watchmoviehub',
      icon: '🎵',
      color: '#000000'
    }
  ];

  return (
    <div className="social-links">
      <h4>Follow Us</h4>
      <div className="social-icons">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            title={`Follow us on ${social.name}`}
            style={{ '--social-color': social.color }}
          >
            <span className="icon">{social.icon}</span>
            <span className="name">{social.name}</span>
          </a>
        ))}
      </div>
      
      <style jsx>{`
        .social-links {
          text-align: center;
          margin: 20px 0;
        }
        
        .social-links h4 {
          margin-bottom: 15px;
          color: white;
          font-size: 18px;
          font-weight: 600;
        }
        
        .social-icons {
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
        }
        
        .social-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 15px;
          border-radius: 8px;
          text-decoration: none;
          color: #333;
          background: #f8f9fa;
          border: 2px solid transparent;
          transition: all 0.3s ease;
          min-width: 80px;
        }
        
        .social-icon:hover {
          border-color: var(--social-color);
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .social-icon .icon {
          font-size: 24px;
          margin-bottom: 5px;
        }
        
        .social-icon .name {
          font-size: 12px;
          font-weight: 500;
        }
        
        @media (max-width: 768px) {
          .social-icons {
            gap: 10px;
          }
          
          .social-icon {
            padding: 8px 12px;
            min-width: 70px;
          }
          
          .social-icon .icon {
            font-size: 20px;
          }
          
          .social-icon .name {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
};

export default SocialLinks;
