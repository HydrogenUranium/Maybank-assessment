import React from 'react';

import { Article } from "../../../../types/article";

import styles from './styles.module.scss';

type ArticleCardProps = {
    article: Article;
    showTags?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
    showTags = false,
    article: {
        author,
        createdfriendly,
        description,
        listimage,
        groupTag,
        path,
        tagsToShow,
        title
    }
}) => (
    <div className={styles.articleCard}>
        <a tabIndex={-1}
            href={path}
            className={styles.articleCardImage}
            style={{ backgroundImage: `url(${listimage})` }}>
            <div className={styles.articleCardImageGroupTag}>{groupTag}</div>
        </a>
        <div className={styles.articleCardInfo}>
            <div className={styles.articleCardInfoAuthor}>{[author, createdfriendly].filter(i => i).join(' | ')}</div>
            <a href={path} className={styles.articleCardInfoTitle}>{title}</a>
            <div className={styles.articleCardInfoDescription}>{description}</div>
            {showTags && <div className={styles.articleCardInfoTags}>
                {tagsToShow.map((item) => (
                    <div className={styles.articleCardInfoTagsTag} key={item}>{item}</div>
                ))}
            </div>}
        </div>
    </div>
);
