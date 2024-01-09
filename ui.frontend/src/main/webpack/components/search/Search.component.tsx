import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'react-string-format';

import { Article, IconButton } from './atoms';
import { Suggestions } from './moleculs';
import { getRecentSearches, putRecentSearch } from '../../services/local-storage';
import { useDataFetching, useSortedArticles } from '../../hooks';
import { getArticles } from '../../services/api/search';
import { registerComponent } from '../../react-core';

import styles from './styles.module.scss';

interface SearchProps {
  title: string,
  descriptionFormat: string;
  descriptionFormatNoResults: string;
  popularSearchesTitle: string;
  sortByTitle: string;
  latestSortOptionTitle: string;
  showMoreResultsButtonTitle: string;
  popularSearches: string[];
}

export const Search: React.FC<SearchProps> = ({
  title,
  descriptionFormat,
  descriptionFormatNoResults,
  popularSearchesTitle,
  sortByTitle,
  latestSortOptionTitle,
  showMoreResultsButtonTitle,
  popularSearches,
}) => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const searchfield = params.get('searchfield') || '';

  const [query, setQuery] = useState(searchfield);
  const [inputValue, setInputValue] = useState(searchfield);
  const [hiddenSuggestions, setHiddenSuggestions] = useState(true);
  const [limit, setLimit] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const recentSearches = useMemo(() => getRecentSearches(), [query]);

  const [articles, loading] = useDataFetching(query, getArticles);
  const sortedArticles = useSortedArticles(articles);

  const focusInput = (): void => inputRef.current?.focus();
  const blurInput = useCallback((): void => {
    inputRef.current?.blur();
  }, [inputRef]);

  const handleCloseSearch = useCallback(() => {
    blurInput();
    setHiddenSuggestions(true);
  }, [blurInput, setHiddenSuggestions]);
  
  useEffect(() => {
    const handleKeyUp = (event) => {
      if (event.key === 'Escape') { handleCloseSearch(); }
    };
  
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
  }, [hiddenSuggestions, handleCloseSearch]);

  useEffect(() => {
    setLimit(Math.min(10, sortedArticles.length));
  },[sortedArticles]);

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
    setQuery(query);
    updateURLquery(query);
    handleCloseSearch();
  };

  const handleSearchClick = () => handleSearch(inputValue);

  const handleKeyClick = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' && inputValue.length) { handleSearchClick(); }
  };

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const value = event.target.value;
    setInputValue(value);
  };

  const handleShowMore = () => {
    setLimit(currentLimit => Math.min(currentLimit + 10, sortedArticles.length));
  };

  const getSearchDetails = (): string => {
    if (!query) {
      return '';
    }
  
    const descriptionFormatToUse = sortedArticles.length > 0 
      ? descriptionFormat 
      : descriptionFormatNoResults || descriptionFormat;
  
    return format(descriptionFormatToUse, query, limit, sortedArticles.length);
  };

  return (
    <div className={styles.search}>
      {loading && (
        <div className={styles.loader} />
      )}
      <div className={styles.searchForm}>
        <div ref={searchRef} className={styles.searchFormInputWrapper}>
          <IconButton
            dataTestId='hendle-search'
            onClick={handleSearchClick}
          />
          <input
            aria-label='Search'
            ref={inputRef}
            data-testid='search-input'
            onFocus={() => setHiddenSuggestions(false)}
            onChange={handleInputChange}
            value={inputValue}
            onKeyDown={handleKeyClick}
          />
          <Suggestions
            inputValue={inputValue}
            recentSearches={recentSearches}
            hidden={hiddenSuggestions}
            focusInput={focusInput}
            setInputValue={setInputValue}
            handleSearch={handleSearch}
          />
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
          {!!articles.length &&
            <div className={styles.sorting}>
              <label htmlFor='sort-by' className={styles.sortingLabel}>{sortByTitle}</label>
              <div id="sort-by" className={styles.sortingSelect}>
                {latestSortOptionTitle}
              </div>
            </div>
          }
        </div>
        <div className={styles.searchResultItems}>
          {
            sortedArticles.slice(0, limit).map((item) => (
              <Article
                key={item.path}
                article={item}
                highlitedWords={query.split(" ")}
              />
            ))
          }
          {limit < sortedArticles.length && (
            <button className={styles.searchResultButton} onClick={handleShowMore}>{showMoreResultsButtonTitle}</button>
          )}
        </div>
      </div>
    </div>
  );
};

registerComponent("search", Search);
