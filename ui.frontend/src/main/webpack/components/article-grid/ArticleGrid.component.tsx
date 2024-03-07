import React, { useEffect, useRef, useState } from 'react';
import { useWindowSize } from 'usehooks-ts';

import { registerComponent } from '../../react-core';
import { ArticleCard, SortSelect } from './molecules';
import { ArticleCategory } from '../../types/article';
import { useCategoryArticles, useDisplayArticles, useLineIncrement } from './hooks';

import styles from './styles.module.scss';

interface ArticleGridProps {
  title: string;
  showMoreResultsButtonTitle: string;
  latestOptionTitle: string,
  recommendedOptionTitle: string,
  sortingTitle: string,
  categories: ArticleCategory[];
  showTags?: boolean;
}

export const ArticleGrid: React.FC<ArticleGridProps> = ({
  title,
  categories,
  showTags,
  latestOptionTitle,
  recommendedOptionTitle,
  showMoreResultsButtonTitle,
  sortingTitle
}) => {
  const selectOptions = [
    { value: 'recommended', label: recommendedOptionTitle },
    { value: 'latest', label: latestOptionTitle },
  ];
  const windowSize = useWindowSize();
  const articleListElement = useRef<HTMLDivElement>(null);
  const [selectedSortOpton, setSelectedSortOpton] = useState<any>(selectOptions[0]);
  const [selectedCategory, setCategory] = useState(categories.length ? categories[0].name : "");
  const [showingLines, setShowingLines] = useState(2);
  const lineIncrement = useLineIncrement(windowSize);

  const categoryArticles = useCategoryArticles(categories, selectedCategory);
  const displayedArticles = useDisplayArticles(categoryArticles, showingLines, selectedSortOpton.value, windowSize);


  useEffect(() => {
    if (windowSize.width && windowSize.width < 567 && showingLines < 3) {
      setShowingLines(3);
    }
  }, [windowSize, showingLines]);

  const handleShowMore = () => {
    setShowingLines(currentLimit => currentLimit + lineIncrement);
  };

  const handleCategoryClick = (categoryName: string, event) => {
    //This is used to prevent click event after dragging element
    if (event.target.classList.contains('horizontal-scroll__react-button--prevent-click')) {
      event.target.classList.remove('horizontal-scroll__react-button--prevent-click');
      return;
    }
    setCategory(categoryName);
    setShowingLines(screen.width > 567 ? 2 : 3);
  };

  const handleCategoryKeyPress = (categoryName: string, event) => {
    if (event.key === 'Enter') {
      handleCategoryClick(categoryName, event);
    }
  };

  return (
    <div className={styles.articleGrid}>
      {/* Title and sorting */}
      <div className={styles.articleGridHeader}>
        <div className={styles.articleGridHeaderTitle}>{title}</div>
        <SortSelect
          onChange={setSelectedSortOpton}
          options={selectOptions}
          sortingTitle={sortingTitle}
        />
      </div>

      {/* Categories Navigation */}
      <nav aria-label={title}>
        <div className={`${styles.articleGridCategories} horizontal-scroll`}>
          {categories.map((category) => (
            <div
              className={`${styles.articleGridCategoriesCategory}
                          ${selectedCategory === category.name ? styles.articleGridCategoriesCategorySelected : ""}
                          horizontal-scroll__react-button`}
              tabIndex={0}
              role="button"
              aria-selected={selectedCategory === category.name}
              key={category.name}
              onClick={(event) => handleCategoryClick(category.name, event)}
              onKeyDown={(event) => handleCategoryKeyPress(category.name, event)}>
              {category.name}
            </div>
          ))}
        </div>
      </nav>


      {/* Articles Display */}
      <div ref={articleListElement} className={styles.articleGridArticles}>
        {displayedArticles.map((article) => (
          <ArticleCard
            article={article} key={article.path}
            showTags={showTags}
          />
        ))}
      </div>

      {/* Show More Button */}
      {displayedArticles.length < categoryArticles.length && (
        <button className={styles.articleGridShowMoreButton} onClick={handleShowMore}>{showMoreResultsButtonTitle}</button>
      )}
    </div>
  );
};

registerComponent("article-grid", ArticleGrid);
