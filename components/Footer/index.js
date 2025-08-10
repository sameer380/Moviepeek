import React from 'react';
import Link from 'next/link';
import SocialLinks from './SocialLinks';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Movie Downloads & Streaming</h3>
          <p>Download full movies free HD quality, watch movies online streaming. Download latest movies, Hollywood movies, Bollywood movies, action movies, comedy movies, horror movies, thriller movies, romance movies, sci-fi movies, adventure movies, drama movies, animated movies, family movies, kids movies, adult movies, 18+ movies, R-rated movies, PG-13 movies, G-rated movies, blockbuster movies, box office movies, award winning movies, Oscar movies, Golden Globe movies, Cannes movies, Sundance movies, indie movies, independent movies, foreign movies, international movies, English movies, Hindi movies, Spanish movies, French movies, German movies, Italian movies, Korean movies, Japanese movies, Chinese movies, Russian movies, Arabic movies, Turkish movies, Brazilian movies, Mexican movies, Canadian movies, Australian movies, British movies, European movies, Asian movies, African movies, Latin American movies, Middle Eastern movies, Scandinavian movies, Nordic movies, Baltic movies, Eastern European movies, Western European movies, Southern European movies, Northern European movies, Central European movies, Balkan movies, Mediterranean movies, Caribbean movies, Pacific movies, Atlantic movies, Indian movies, Pakistani movies, Bangladeshi movies, Sri Lankan movies, Nepali movies, Bhutanese movies, Maldives movies, Afghan movies, Iranian movies, Iraqi movies, Syrian movies, Lebanese movies, Jordanian movies, Palestinian movies, Israeli movies, Egyptian movies, Moroccan movies, Algerian movies, Tunisian movies, Libyan movies, Sudanese movies, Ethiopian movies, Kenyan movies, Nigerian movies, Ghanaian movies, South African movies, Zimbabwean movies, Zambian movies, Malawian movies, Mozambican movies, Angolan movies, Namibian movies, Botswana movies, Lesotho movies, Swaziland movies, Madagascar movies, Mauritius movies, Seychelles movies, Comoros movies, Mayotte movies, Reunion movies, Djibouti movies, Eritrea movies, Somalia movies, Somaliland movies, Uganda movies, Tanzania movies, Rwanda movies, Burundi movies, Democratic Republic of Congo movies, Republic of Congo movies, Central African Republic movies, Chad movies, Cameroon movies, Gabon movies, Equatorial Guinea movies, Sao Tome and Principe movies, Cape Verde movies, Guinea-Bissau movies, Guinea movies, Sierra Leone movies, Liberia movies, Ivory Coast movies, Burkina Faso movies, Mali movies, Niger movies, Senegal movies, Gambia movies, Mauritania movies, Western Sahara movies, download Morocco movies, download Algeria movies, download Tunisia movies, download Libya movies, download Egypt movies, download Sudan movies, download South Sudan movies, download Ethiopia movies, download Eritrea movies, download Djibouti movies, download Somalia movies, download Somaliland movies, download Kenya movies, download Uganda movies, download Tanzania movies, download Rwanda movies, download Burundi movies, download Democratic Republic of Congo movies, download Republic of Congo movies, download Central African Republic movies, download Chad movies, download Cameroon movies, download Gabon movies, download Equatorial Guinea movies, download Sao Tome and Principe movies, download Cape Verde movies, download Guinea-Bissau movies, download Guinea movies, download Sierra Leone movies, download Liberia movies, download Ivory Coast movies, download Burkina Faso movies, download Mali movies, download Niger movies, download Senegal movies, download Gambia movies, download Mauritania movies, download Western Sahara movies. Free HD movie downloads, 1080p movies download, 720p movies download, 480p movies download, movie download sites, download movies online, free HD movies, download movies HD quality, watch movies online free, stream movies free, download latest movies, new movies download.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/search">Search Movies</Link></li>
            <li><Link href="/genre">Movie Genres</Link></li>
            <li><Link href="/my-lists">My Lists</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Categories</h4>
          <ul>
            <li><Link href="/?category=Popular">Popular Movies</Link></li>
            <li><Link href="/?category=Top%20Rated">Top Rated</Link></li>
            <li><Link href="/?category=Upcoming">Upcoming</Link></li>
            <li><Link href="/?category=Now%20Playing">Now Playing</Link></li>
          </ul>
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
