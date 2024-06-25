import React, { useState } from 'react';
import classNames from 'classnames';

import { SearchSection } from '../../../common/atoms';
import { getCommonPrefix, highlightMatches } from 'src/main/webpack/utils';

import styles from './styles.module.scss';

interface SuggestionsProps {
  recentSearches: string[];
  suggestions: string[];
  suggestionsQuery: string;
  activeSuggestion: number;
  handleSearch: (value: string) => void;
}

export const Suggestions: React.FC<SuggestionsProps> = (
  {
    recentSearches,
    suggestions,
    suggestionsQuery,
    activeSuggestion,
    handleSearch
  }) => {
  if (!suggestionsQuery) {
    return (recentSearches.length &&
      <div className={styles.searchSection}>
        <SearchSection
          items={recentSearches}
          renderItem={(search, index) => (
            <button onClick={() => handleSearch(search)} className={
              classNames(
                styles.searchSectionItemsItem, 
                styles.searchSectionItemsItemWithIcon,
                {[styles.searchSectionItemsItemActive]: index === activeSuggestion}
              )} key={search}>
              <span className={classNames(styles.icon, styles.iconHistory)}></span>
              <span className={styles.searchSectionItemsItemText}>{search}</span>
            </button>
          )}
        />
      </div>
    );
  }

  if (!suggestions.length) {
    return null;
  }

  return (
    <div className={styles.searchSection}>
      <SearchSection
        items={suggestions}
        renderItem={(suggestion, index) => (
          <button
            onClick={() => handleSearch(suggestion)}
            className={
              classNames(
                styles.searchSectionItemsItem, 
                styles.searchSectionItemsItemText,
                {[styles.searchSectionItemsItemActive]: index === activeSuggestion}
              )}
            dangerouslySetInnerHTML={{ __html: highlightMatches(suggestion, "(?<=^" + getCommonPrefix(suggestion, suggestionsQuery.trim(), true) + ").*", "gi") }}
            key={suggestion}>
          </button>
        )}
      />
    </div>
  );
};
