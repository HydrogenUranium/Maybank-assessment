import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'react-string-format';

import { SearchRow } from './atoms';
import { Suggestions } from './moleculs';
import { decodeHtmlEntities } from '../../utils';
import { getRecentSearches, putRecentSearch } from '../../services/local-storage';
import { useDataFetching, useSortedSearchResult } from '../../hooks';
import { getArticles, getTagSuggestions } from '../../services/api/search';
import { registerComponent } from '../../react-core';
import { SortSelect } from '../common/atoms';

import styles from './styles.module.scss';

interface SearchProps {
  title: string,
  descriptionFormat: string;
  descriptionFormatNoResults: string;
  popularSearchesTitle: string;
  submitButtonAriaLabel:string;
  searchInputAriaLabel: string;
  sortByTitle: string;
  latestSortOptionTitle: string;
  relevanceSortOptionTitle: string;
  showMoreResultsButtonTitle: string;
  popularSearches: string[];
}

export const Search: React.FC<SearchProps> = ({
  title,
  descriptionFormat,
  descriptionFormatNoResults,
  popularSearchesTitle,
  submitButtonAriaLabel,
  searchInputAriaLabel,
  sortByTitle,
  latestSortOptionTitle,
  relevanceSortOptionTitle,
  showMoreResultsButtonTitle,
  popularSearches,
}) => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const searchfield = params.get('searchfield') || '';
  const selectOptions = [
    { value: 'default', label: relevanceSortOptionTitle },
    { value: 'latest', label: latestSortOptionTitle },
  ];

  const [selectedSortOption, setSelectedSortOption] = useState<any>(selectOptions[0]);
  const [inputValue, setInputValue] = useState(searchfield);
  const [articlesQuery, setArticlesQuery] = useState(searchfield);
  const [suggestionQuery, setSuggestionQuery] = useState(inputValue);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [hiddenSuggestions, setHiddenSuggestions] = useState(true);
  const [limit, setLimit] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const recentSearches = useMemo(() => getRecentSearches(), [articlesQuery]);

  const [suggestions] = useDataFetching(suggestionQuery, getTagSuggestions);
  const [searchRows, loading] = useDataFetching(articlesQuery, getArticles);
  const sortedSearchRows = useSortedSearchResult(searchRows, selectedSortOption.value);

  const blurInput = useCallback((): void => {
    inputRef.current?.blur();
  }, [inputRef]);

  const focusInput = (): void => inputRef.current?.focus();

  const handleCloseSearch = useCallback(() => {
    blurInput();
    setActiveSuggestion(-1);
    setHiddenSuggestions(true);
  }, [blurInput, setHiddenSuggestions]);
  
  useEffect(() => {
    const handleKeyUp = ({key}) => {
      if (key === 'Escape') {
        handleCloseSearch();
      }
    }
  
    if (!hiddenSuggestions) {
      searchRef.current?.addEventListener('mousedown', stopPropagation);
      window.addEventListener('mousedown', handleCloseSearch);
      window.addEventListener('click', stopPropagation);
      window.addEventListener('keyup', handleKeyUp);
    } else {
      window.removeEventListener('mousedown', handleCloseSearch);
      window.removeEventListener('click', stopPropagation);
      window.removeEventListener('keyup', handleKeyUp);
    }
  
    return () => {
      window.removeEventListener('mousedown', handleCloseSearch);
      window.removeEventListener('click', stopPropagation);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [hiddenSuggestions, handleCloseSearch])

  useEffect(() => {
    setActiveSuggestion(-1);
  }, [suggestions, setActiveSuggestion])

  useEffect(() => {
    if(activeSuggestion < 0) return;

    const items = suggestionQuery.length ? suggestions : recentSearches;

    if(activeSuggestion < items.length) {
      setInputValue(items[activeSuggestion]);
    }
  }, [activeSuggestion]);

  useEffect(() => {
    setLimit(Math.min(10, sortedSearchRows.length));
  },[sortedSearchRows]);

  const stopPropagation = (event: Event): void => event.stopPropagation();

  const updateURLquery = (value) => {
    const url = new URL(window.location.href);
    url.searchParams.set('searchfield', value);
    window.history.pushState({}, '', url);
  };

  const handleSearch = (query) => {
    if (inputValue !== query) {
      setInputValue(query);
    }
    putRecentSearch(query);
    setArticlesQuery(query);
    updateURLquery(query);
    handleCloseSearch();
  };

  const handleSearchClick = () => handleSearch(inputValue);

  const getSuggestionLength = () => {
    return suggestionQuery.length
      ? suggestions.length
      : recentSearches.length
  }

  const handleArrowDown = () => {
    setActiveSuggestion((prevSelected) => {
      return prevSelected < getSuggestionLength() - 1 ? prevSelected + 1 : 0
    });
  }

  const handleArrowUp = () => {
    setActiveSuggestion((prevSelected) => {
      return prevSelected > 0 ? prevSelected  - 1 : getSuggestionLength() - 1
    });
  }

  const handleKeyClick = ({key}: React.KeyboardEvent<HTMLInputElement>): void => {
    if (key === 'Enter' && inputValue.length) { 
      handleSearchClick(); 
    } else if (key === 'ArrowDown') {
      handleArrowDown();
    } else if (key === 'ArrowUp') {
      handleArrowUp();
    }
  };

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const value = event.target.value;
    setInputValue(value);
    setSuggestionQuery(value);
  };

  const handleShowMore = () => {
    setLimit(currentLimit => Math.min(currentLimit + 10, sortedSearchRows.length));
  };

  const getSearchDetails = (): string => {
    if (!articlesQuery) {
      return '';
    }
  
    const descriptionFormatToUse = sortedSearchRows.length > 0
      ? descriptionFormat 
      : descriptionFormatNoResults || descriptionFormat;
  
    return format(descriptionFormatToUse, articlesQuery, limit, sortedSearchRows.length);
  };

  return (
    <div className={styles.search}>
      {loading && (
        <div className={styles.loader} />
      )}
      <div className={styles.searchForm}>
        <div ref={searchRef} className={styles.searchFormInputWrapper}>
          <input
            aria-label={searchInputAriaLabel}
            role="combobox"
            type="search"
            aria-activedescendant={activeSuggestion >= 0 ? `search-suggestion-${activeSuggestion}` : null}
            aria-autocomplete="list"
            aria-expanded={!hiddenSuggestions}
            ref={inputRef}
            data-testid='search-input'
            onFocus={() => setHiddenSuggestions(false)}
            onChange={handleInputChange}
            value={decodeHtmlEntities(inputValue)}
            onKeyDown={handleKeyClick}
          />
          <button
            data-testid='handle-search'
            aria-label={submitButtonAriaLabel}
            onClick={handleSearchClick}
            className={styles.searchButton}>
            <span className={styles.searchButtonImage}></span>
          </button>
          {!hiddenSuggestions &&
          <Suggestions
            recentSearches={recentSearches}
            activeSuggestion={activeSuggestion}
            focusInput={focusInput}
            suggestionsQuery={suggestionQuery}
            suggestions={suggestions}
            handleSearch={handleSearch}
            setInputValue={setInputValue}
          />}
        </div>
        <h1 className={styles.searchFormTitle}>{title}</h1>
        <div className={styles.searchFormDetails}
          dangerouslySetInnerHTML={{ __html: getSearchDetails() }}
        />
      </div>
      <div className={styles.searchResult}>
        <div className={styles.searchResultHeadline}>
          <div className={styles.trending}>
            <div className={styles.trendingTitle}>{popularSearchesTitle}:</div>
            {popularSearches.map((topic) =>
                <div
                  key={topic}
                  role="button"
                  tabIndex={0}
                  className={styles.trendingItem}
                  onClick={() => handleSearch(topic)}>
                  {topic}
                </div>
            )}
          </div>
          {!!sortedSearchRows.length &&
            <div className={styles.sorting}>
              <SortSelect
                onChange={setSelectedSortOption}
                options={selectOptions}
                sortingTitle={sortByTitle}
              />
            </div>
          }
        </div>
        <div className={styles.searchResultItems}>
          {
            sortedSearchRows.slice(0, limit).map((searchRow) => (
              <SearchRow
                key={searchRow.article.path}
                searchRow={searchRow}
                highlightedWords={articlesQuery.split(" ")}
              />
            ))
          }
          {limit < sortedSearchRows.length && (
            <button className={styles.searchResultButton} onClick={handleShowMore}>{showMoreResultsButtonTitle}</button>
          )}
        </div>
      </div>
    </div>
  );
};

registerComponent("search", Search);
