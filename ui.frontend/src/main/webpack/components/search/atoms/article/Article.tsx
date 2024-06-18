import React from 'react';

import { Article as ArticleType } from 'src/main/webpack/types/article';

import styles from './styles.module.scss';
import { highlightMatches } from 'src/main/webpack/utils';


type ArticleProps = {
  article: ArticleType;
  highlitedWords?: string[];
}

export const Article: React.FC<ArticleProps> = ({ article, highlitedWords = [] }) => (
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
          __html: highlightMatches(article.description, `(\\b${highlitedWords.join('\\b|\\b')}\\b)`, "gi")
        }}
      />
    </div>
  </div>
);
