import React from 'react';
import classNames from 'classnames';

import { useDataFetching } from '../../../../hooks/useDataFetching';
import { getTagSuggestions } from 'src/main/webpack/services/api/search';
import { SearchSection } from '../../../common/atoms';
import { highlightMatches } from 'src/main/webpack/utils';

import styles from './styles.module.scss';

interface SuggestionsProps {
  recentSearches: string[];
  inputValue: string;
  hidden: boolean;
  focusInput: () => void;
  setInputValue: (value: string) => void;
  handleSearch: (value: string) => void;
}

export const Suggestions: React.FC<SuggestionsProps> = (
  {
    recentSearches,
    inputValue,
    hidden,
    focusInput,
    setInputValue,
    handleSearch
  }) => {
  const [suggestions] = useDataFetching(inputValue, getTagSuggestions);

  if(hidden) {
    return null;
  }

  if (!inputValue) {
    return (
      <div className={styles.searchSection}>
        <SearchSection
          items={recentSearches}
          renderItem={(search) => (
            <button onClick={() => handleSearch(search)} className={classNames(styles.searchSectionItemsItem, styles.searchSectionItemsItemWithIcon)} key={search}>
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
        renderItem={(suggestion) => (
          <button
            onClick={() => {
              setInputValue(suggestion);
              focusInput();
            }}
            className={classNames(styles.searchSectionItemsItem, styles.searchSectionItemsItemText)}
            dangerouslySetInnerHTML={{ __html: highlightMatches(suggestion, "^" + inputValue, "gi") }}
            key={suggestion}>
          </button>
        )}
      />
    </div>
  );
};
