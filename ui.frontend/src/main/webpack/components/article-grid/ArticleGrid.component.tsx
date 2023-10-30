import React, { useEffect, useRef, useState } from 'react';

import { registerComponent } from '../../react-core/registry';
import { ArticleCard } from './molecules/ArticleCard';
import { Article } from './types';

import styles from './styles.module.scss';
import articleCardStyles from './molecules/styles.module.scss';

interface ArticleGridProps {
    title: string;
    showTags?: boolean;
    sorting: {
        title: string;
        options: {
            name: string;
            disabled?: boolean;
        }[]
    }
    categories: {
        name: string;
        articles: Article[];
    }[];
}

export const ArticleGrid: React.FC<ArticleGridProps> = ({ title, categories, showTags, sorting }) => {
    const articleListElement = useRef<HTMLDivElement>(null);
    const [sortBy] = useState(sorting.options ? sorting.options[0].name : "");
    const [displayedArticles, setDisplayedArticles] = useState(categories.length ? categories[0].articles : []);
    const [selectedCategory, setCategory] = useState(categories.length ? categories[0].name : "");

    // This is a hack to make sure that the first two lines of articles are always displayed and the rest are hidden
    useEffect(() => {
        if (articleListElement.current) {
            const linesSet = new Set();

            const lines = articleListElement.current.querySelectorAll("." + articleCardStyles.articleCard);
            lines.forEach((line: HTMLElement) => {
                linesSet.add(line.getBoundingClientRect().top);
                line.style.display = linesSet.size > 2 ? "none" : "block";
            });
        }
    }, [articleListElement, displayedArticles]);

    const handleCategoryClick = (categoryName: string, event) => {
        //This is used to prevent click event after dragging element
        if (event.target.classList.contains('horizontal-scroll__react-button--prevent-click')) {
            event.target.classList.remove('horizontal-scroll__react-button--prevent-click');
            return;
        }
        const category = categories.find(item => item.name === categoryName);
        if (category) {
            setDisplayedArticles(category.articles);
            setCategory(categoryName);
        }
    };

    return (
        <div className={styles.articleGrid}>
            <div className={styles.articleGridHeader}>
                <div className={styles.articleGridHeaderTitle}>{title}</div>
                <div className={styles.articleGridHeaderSort}>
                    <label htmlFor='sort-by' className={styles.articleGridHeaderSortLabel}>{sorting.title}</label>
                    <div id="sort-by" className={styles.articleGridHeaderSortSelect}>
                        {sortBy}
                    </div>
                </div>
            </div>
            <ul className={`${styles.articleGridCategories} horizontal-scroll`}>
                {categories.map((category, index) => (
                    <li
                        className={`${styles.articleGridCategoriesCategory}
                            ${selectedCategory === category.name ? styles.articleGridCategoriesCategorySelected : ""}
                            horizontal-scroll__react-button`}
                        key={category.name}
                        onClick={(event) => handleCategoryClick(category.name, event)}
                    >
                        {category.name}
                    </li>
                ))}
            </ul>
            <div >
                <div ref={articleListElement} className={styles.articleGridArticles}>
                    {displayedArticles.map((article) => (
                        <ArticleCard
                            article={article} key={article.link}
                            showTags={showTags}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

registerComponent("article-grid", ArticleGrid);
