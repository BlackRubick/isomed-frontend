import React from 'react';
import './RelatedArticles.css';

const RelatedArticles = ({ articles }) => {
  return (
    <div className="related-articles">
      <h3>Artículos relacionados</h3>
      <ul>
        {articles.map((article, index) => (
          <li key={index}>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedArticles;