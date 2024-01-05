import React from 'react';

import { Article } from "../../../types/article";

import styles from './styles.module.scss';

type ArticleCardProps = {
    article: Article;
    showTags?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
    showTags = false,
    article: {
        author,
        date,
        description,
        image,
        groupTag,
        link,
        tags,
        title
    }
}) => (
    <div className={styles.articleCard}>
        <a tabIndex={-1} href={link} className={styles.articleCardImage} style={{ backgroundImage: `url(${image})` }}>
            <div className={styles.articleCardImageGroupTag}>{groupTag}</div>
        </a>
        <div className={styles.articleCardInfo}>
            <div className={styles.articleCardInfoAuthor}>{[author, date].filter(i => i).join(' | ')}</div>
            <a href={link} className={styles.articleCardInfoTitle}>{title}</a>
            <div className={styles.articleCardInfoDescription}>{description}</div>
            {showTags && <div className={styles.articleCardInfoTags}>
                {tags.map((item) => (
                    <div className={styles.articleCardInfoTagsTag} key={item}>{item}</div>
                ))}
            </div>}
        </div>
    </div>
);
