import React from 'react';
import Link from 'next/link';
import SocialLinks from './SocialLinks';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className=" ">
          <h3>Movie Downloads & Streaming</h3>
                <p>
  Watch and download the latest HD movies including Bollywood hits, Hollywood blockbusters, and trending Hindi films. Explore genres like action, comedy, horror, and romance, all in high-quality streaming or download formats in 720p, 1080p, 480p movies. 
</p>
        </div>
    
      </div>
      
      <SocialLinks />
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Movie Downloads & Streaming. All rights reserved.</p>
        <div className="footer-links">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/contact">Contact Us</Link>
        </div>
      </div>
      
      <style jsx>{`
        .footer {
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          color: white;
          padding: 40px 20px 20px;
          margin-top: 60px;
        }
        
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          margin-bottom: 30px;
        }
        
        .footer-section h3 {
            text-align: center;
          margin-bottom: 15px;
          font-size: 20px;
          font-weight: 600;
        }
        
        .footer-section h4 {
          margin-bottom: 15px;
          font-size: 16px;
          font-weight: 600;
        }
        
        .footer-section p {
          line-height: 1.6;
          opacity: 0.9;
        }
        
        .footer-section ul {
          list-style: none;
          padding: 0;
        }
        
        .footer-section ul li {
          margin-bottom: 8px;
        }
        
        .footer-section ul li a {
          color: white;
          text-decoration: none;
          opacity: 0.9;
          transition: opacity 0.3s ease;
        }
        
        .footer-section ul li a:hover {
          opacity: 1;
          text-decoration: underline;
        }
        
        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .footer-bottom p {
          margin: 0;
          opacity: 0.8;
        }
        
        .footer-links {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .footer-links a {
          color: white;
          text-decoration: none;
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }
        
        .footer-links a:hover {
          opacity: 1;
        }
        
        @media (max-width: 768px) {
          .footer {
            padding: 30px 15px 15px;
          }
          
          .footer-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
          
          .footer-links {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
