import React from 'react';

import { Article } from "../../../../types/article";

import styles from './styles.module.scss';

type ArticleCardProps = {
    article: Article;
    showTags?: boolean;
}

/**
 * ArticleCard component displays an article with its details.
 * 
 * @param {Article} props.article - The article data to display.
 * @param {boolean} [props.showTags=false] - Whether to show the tags of the article.
 * 
 * @returns {JSX.Element} The rendered ArticleCard component.
 */
export const ArticleCard: React.FC<ArticleCardProps> = ({
    showTags = false,
    article: {
        author,
        createdfriendly,
        description,
        pageImage,
        groupTag,
        path,
        tagsToShow,
        title
    }
}) => (
    <article className={styles.articleCard}>
        <a tabIndex={-1}
            href={path}
            className={styles.articleCardImage}
            style={{ backgroundImage: `url(${pageImage})` }}>
            <div className={`${styles.articleCardGroupTag} ${styles.articleCardTextOnImage}`}>{groupTag}</div>
        </a>
        <div className={styles.articleCardInfo}>
            <div className={styles.articleCardAuthor}>{[author, createdfriendly].filter(i => i).join(' | ')}</div>
            <a href={path} className={styles.articleCardTitle}>{title}</a>
            <div className={styles.articleCardDescription}>{description}</div>
            {showTags && <div className={styles.articleCardTags}>
                {tagsToShow.map((item) => (
                    <div className={styles.articleCardTag} key={item}>{item}</div>
                ))}
            </div>}
        </div>
    </article>
);
