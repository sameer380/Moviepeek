import React from 'react';
import Link from 'next/link';

const Breadcrumb = ({ items }) => {
  return (
    <>
      <nav aria-label="breadcrumb" className="breadcrumb-container">
        <ol className="breadcrumb-list">
          <li className="breadcrumb-item">
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className={`breadcrumb-item ${index === items.length - 1 ? 'breadcrumb-item-last' : ''}`}>
              {index === items.length - 1 ? (
                <span>{item.text}</span>
              ) : (
                <Link href={item.href}>
                  <a>{item.text}</a>
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <style jsx>{`
        .breadcrumb-container {
          margin: 1rem 0;
          padding: 0.5rem 0;
        }

        .breadcrumb-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
        }

        .breadcrumb-item {
          display: inline;
        }

        .breadcrumb-item:not(.breadcrumb-item-last)::after {
          content: "›";
          margin: 0 0.5rem;
          color: var(--palette-text-secondary, #666);
        }

        .breadcrumb-item a {
          color: var(--palette-primary-main, #1976d2);
          text-decoration: none;
        }

        .breadcrumb-item a:hover {
          text-decoration: underline;
        }

        .breadcrumb-item-last {
          color: var(--palette-text-secondary, #666);
        }
      `}</style>
    </>
  );
};

export default Breadcrumb;