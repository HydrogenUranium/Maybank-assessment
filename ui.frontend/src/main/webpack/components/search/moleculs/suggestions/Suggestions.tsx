import React, { useState } from 'react';
import classNames from 'classnames';

import { isTouchDevice } from 'src/main/webpack/constants/device';
import { SearchSection } from '../../../common/atoms';
import { getCommonPrefix, highlightMatches } from 'src/main/webpack/utils';

import styles from './styles.module.scss';

interface SuggestionsProps {
  recentSearches: string[];
  suggestions: string[];
  suggestionsQuery: string;
  activeSuggestion: number;
  handleSearch: (value: string) => void;
  setInputValue: (value: string) => void;
  focusInput: () => void;
}

export const Suggestions: React.FC<SuggestionsProps> = (
  {
    recentSearches,
    suggestions,
    suggestionsQuery,
    activeSuggestion,
    handleSearch,
    setInputValue,
    focusInput,
  }) => {
  if (!suggestionsQuery) {
    return (!!recentSearches.length &&
      <div className={styles.searchSection}>
        <SearchSection
          items={recentSearches}
          renderItem={(search, index) => (
            <div className={styles.searchSectionItemsItemWrapper}>
              <button 
                onClick={() => handleSearch(search)}
                aria-label={search}
                id={`search-suggestion-${index}`}
                tabIndex={-1}
                className={
                  classNames(
                    styles.searchSectionItemsItem, 
                    styles.searchSectionItemsItemWithIcon,
                    {[styles.searchSectionItemsItemActive]: index === activeSuggestion}
                  )} key={search}>
                <span className={classNames(styles.icon, styles.iconHistory)}></span>
                <span className={styles.searchSectionItemsItemText}>{search}</span>
              </button>
              { isTouchDevice &&
                <button
                    data-testid={`refresh-input-${index}`}
                    tabIndex={-1}
                    onClick={() => {
                      setInputValue(search);
                      focusInput();
                    }}
                    className={styles.refreshButton}>
                    <span className={styles.refreshButtonImage}></span>
                </button>
              }
          </div>
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
          <div className={styles.searchSectionItemsItemWrapper}>
            <button
              onClick={() => handleSearch(suggestion)}
              aria-label={suggestion}
              id={`search-suggestion-${index}`}
              tabIndex={-1}
              className={
                classNames(
                  styles.searchSectionItemsItem, 
                  styles.searchSectionItemsItemText,
                  {[styles.searchSectionItemsItemActive]: index === activeSuggestion}
                )}
              dangerouslySetInnerHTML={{ __html: highlightMatches(suggestion, "(?<=^" + getCommonPrefix(suggestion, suggestionsQuery.trim(), true) + ").*", "gi") }}
              key={suggestion}>
            </button>
            { isTouchDevice &&
              <button
                  data-testid={`refresh-input-${index}`}
                  tabIndex={-1}
                  onClick={() => {
                    setInputValue(suggestion);
                    focusInput();
                  }}
                  className={styles.refreshButton}>
                  <span className={styles.refreshButtonImage}></span>
              </button>
            }
            </div>
        )}
      />
    </div>
  );
};
