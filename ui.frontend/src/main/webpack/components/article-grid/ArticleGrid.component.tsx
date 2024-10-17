import React, { useEffect, useRef, useState } from 'react';
import { useWindowSize } from 'usehooks-ts';

import { registerComponent } from '../../react-core';
import { ArticleCard } from './molecules';
import { ArticleCategory } from '../../types/article';
import { useCategoryArticles, useDisplayArticles, useLineIncrement } from './hooks';
import { SortSelect } from '../common/atoms';

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

  const filteredCategories = categories.filter(category => category.articles.length)
  
  const windowSize = useWindowSize();
  const articleListElement = useRef<HTMLDivElement>(null);
  const [selectedSortOpton, setSelectedSortOpton] = useState<any>(selectOptions[0]);
  const [selectedCategory, setCategory] = useState(filteredCategories.length ? filteredCategories[0].name : "");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [showingLines, setShowingLines] = useState(2);
  const lineIncrement = useLineIncrement(windowSize);
  const tabsRef = useRef([]);

  const categoryArticles = useCategoryArticles(filteredCategories, selectedCategory);
  const displayedArticles = useDisplayArticles(categoryArticles, showingLines, selectedSortOpton.value, windowSize);


  useEffect(() => {
    if (windowSize.width && windowSize.width < 567 && showingLines < 3) {
      setShowingLines(3);
    }
  }, [windowSize, showingLines]);

  useEffect(() => {
    const index = filteredCategories.findIndex(category => category.name === selectedCategory);
    setSelectedCategoryIndex(index);
  }, [selectedCategory, filteredCategories]);

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
    const {key} = event;
    if (key === 'Enter') {
      handleCategoryClick(categoryName, event);
    }
    if (key == 'ArrowRight') {
      const nextIndex = (selectedCategoryIndex + 1) % filteredCategories.length;
      handleCategoryClick(filteredCategories[nextIndex].name, event);
      tabsRef.current[nextIndex].focus();
    }
    if (key == 'ArrowLeft') {
      const nextIndex = (filteredCategories.length + selectedCategoryIndex - 1) % filteredCategories.length;
      handleCategoryClick(filteredCategories[nextIndex].name, event);
      tabsRef.current[nextIndex].focus();
    }
  };

  return (
    <div className={styles.articleGrid}>
      <div className={styles.articleGridHeader}>
        <div className={styles.articleGridHeaderTitle}>{title}</div>
        <SortSelect
          onChange={setSelectedSortOpton}
          options={selectOptions}
          sortingTitle={sortingTitle}
        />
      </div>

      <ol role="tablist" aria-multiselectable="false" className={`${styles.articleGridCategories} horizontal-scroll`}>
        {filteredCategories.map((category, index) => {
          const isSelected = selectedCategory === category.name;
          return (
          <li
            id={`article-grid-tab-${index}`}
            className={`${styles.articleGridCategoriesCategory}
                        ${isSelected ? styles.articleGridCategoriesCategorySelected : ""}
                        horizontal-scroll__react-button`}
            tabIndex={isSelected ? 0 : -1}
            role="tab"
            aria-selected={isSelected}
            aria-controls={`article-grid-tabpanel-${index}`}
            ref={(el) => (tabsRef.current[index] = el)}
            key={category.name}
            onClick={(event) => {
              handleCategoryClick(category.name, event);
              setSelectedCategoryIndex(index)
            }}
            onKeyDown={(event) => handleCategoryKeyPress(category.name, event)}>
            {category.name}
          </li>
        )})}
      </ol>

      <div 
        id={`article-grid-tabpanel-${selectedCategoryIndex}`}
        tabIndex={0}
        aria-labelledby={`article-grid-tab-${selectedCategoryIndex}`}
        role="tabpanel" 
        ref={articleListElement} 
        className={styles.articleGridArticles}>
        {displayedArticles.map((article) => (
          <ArticleCard
            article={article} key={article.path}
            showTags={showTags}
          />
        ))}
      </div>

      {displayedArticles.length < categoryArticles.length && (
        <button className={styles.articleGridShowMoreButton} onClick={handleShowMore}>{showMoreResultsButtonTitle}</button>
      )}
    </div>
  );
};

registerComponent("article-grid", ArticleGrid);
