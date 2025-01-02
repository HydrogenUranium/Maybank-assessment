import React, { useRef } from 'react';
import { IndexedArticleCategory } from 'src/main/webpack/types';

import styles from '../../styles.module.scss';

interface CategorySelectorProps {
    displayedCategories: IndexedArticleCategory[];
    selectedCategory: IndexedArticleCategory;
    onSelectCategory: (category: IndexedArticleCategory) => void;
}

/**
 * CategorySelector component allows users to select a category from a list of displayed categories.
 * 
 * @param {CategorySelectorProps} props - The properties for the component.
 * @param {IndexedArticleCategory[]} props.displayedCategories - The list of categories to display.
 * @param {IndexedArticleCategory} props.selectedCategory - The currently selected category.
 * @param {function} props.onSelectCategory - The function to call when a category is selected.
 * 
 * @returns {JSX.Element} The rendered CategorySelector component.
 */
export const CategorySelector: React.FC<CategorySelectorProps> = ({
    displayedCategories,
    selectedCategory,
    onSelectCategory,
}) => {
    const tabsRef = useRef<(HTMLLIElement | null)[]>([]);

    const handleCategoryClick = (category: IndexedArticleCategory, event: React.MouseEvent<HTMLLIElement>) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains('horizontal-scroll__react-button--prevent-click')) {
            target.classList.remove('horizontal-scroll__react-button--prevent-click');
            return;
        }
        onSelectCategory(category);
    };

    const navigateCategories = (direction: 'next' | 'prev') => {
        const delta = direction === 'next' ? 1 : -1;
        const nextIndex = (displayedCategories.length + selectedCategory.id + delta) % displayedCategories.length;
        onSelectCategory(displayedCategories[nextIndex]);
        tabsRef.current[nextIndex]?.focus();
    };

    // Handle key press events for category navigation
    const handleCategoryKeyPress = (category: IndexedArticleCategory, event: React.KeyboardEvent<HTMLLIElement>) => {
        const { key } = event;
        if (key === 'Enter') {
          onSelectCategory(category);
        } else if (key === 'ArrowRight') {
          navigateCategories('next');
        } else if (key === 'ArrowLeft') {
          navigateCategories('prev');
        }
    };

    return (
        <ul role="tablist" aria-multiselectable="false" className={`${styles.articleGridCategories} horizontal-scroll`}>
        {displayedCategories.map((category, index) => {
          const isSelected = category.id === selectedCategory.id;
          return (
            <li
              id={`article-grid-tab-${index}`}
              className={`${styles.articleGridCategory}
                        ${isSelected ? styles.articleGridCategorySelected : ""}
                        horizontal-scroll__react-button`}
              tabIndex={isSelected ? 0 : -1}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`article-grid-tabpanel-${index}`}
              ref={(el) => (tabsRef.current[index] = el)}
              key={category.name}
              onClick={(event) => handleCategoryClick(category, event)}
              onKeyDown={(event) => handleCategoryKeyPress(category, event)}>
              {category.name}
            </li>
          );
        })}
      </ul>
    );
};
