import React from 'react';

import { SearchRow as SearchRowType } from 'src/main/webpack/types/article';

import styles from './styles.module.scss';
import { highlightMatches, sanitizeHtml } from 'src/main/webpack/utils';


type SearchRowProps = {
  searchRow: SearchRowType;
  highlightedWords?: string[];
}

export const SearchRow: React.FC<SearchRowProps> = ({ searchRow: { article, excerpt }, highlightedWords = [] }) => {
  const description = excerpt.includes("<strong>")
    ? excerpt
    : highlightMatches(article.description, `(\\b${highlightedWords.join('\\b|\\b')}\\b)`, "gi");

  return (
    <div className={styles.article}>
      <a tabIndex={-1} href={`${article.path}`} className={styles.articleImage}
        style={{ backgroundImage: `url(${article.listimage})` }}></a>
      <div className={styles.articleInfo}>
        <div className={styles.articleInfoGroupTag}>{article.groupTag}</div>
        <a href={`${article.path}`} className={styles.articleInfoTitle}>
          {article.title}
        </a>
        <div className={styles.articleInfoMetadata}>
          {[article.createdfriendly, article.readtime].filter(i => i).join('|')}
        </div>
        <div
          className={styles.articleInfoDescription}
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(description)
          }}
        />
      </div>
    </div>
  )
};
