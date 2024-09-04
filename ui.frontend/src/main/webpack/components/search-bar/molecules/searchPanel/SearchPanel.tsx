import React, { useRef, useState, useEffect, useMemo, StrictMode } from 'react';
import classNames from 'classnames';

import { getRecentSearches, putRecentSearch } from 'src/main/webpack/services/local-storage/recentSearch';
import { getArticles, getTagSuggestions } from 'src/main/webpack/services/api/search';
import { IconButton } from '../../atoms/iconButton/IconButton';
import { useDataFetching } from '../../../../hooks/useDataFetching';
import { SearchSection } from '../../../common/atoms/searchSection/SearchSection';
import { getCommonPrefix, highlightMatches } from 'src/main/webpack/utils';

import styles from './styles.module.scss';

interface SearchPanelProps {
  recentSearchesTitle: string;
  trendingTopicsTitle: string;
  searchButtonAriaLabel: string;
  searchInputAriaLabel: string;
  closeAriaLabel: string;
  showThumbnail: boolean;
  articlesTitle: string;
  trendingTopics: string[];
  searchResultPagePath: string;
  handleCloseSearch: () => void
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  recentSearchesTitle,
  trendingTopicsTitle,
  searchButtonAriaLabel,
  searchInputAriaLabel,
  showThumbnail,
  closeAriaLabel,
  articlesTitle,
  trendingTopics,
  searchResultPagePath,
  handleCloseSearch
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestionQuery, setSuggestionQuery] = useState('');
  const [articlesQuery, setArticlesQuery] = useState('');
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [suggestions] = useDataFetching(suggestionQuery, getTagSuggestions);
  const [searchRows] = useDataFetching(articlesQuery, getArticles);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const recentSearches = useMemo(() => getRecentSearches(), []);

  useEffect(() => {
    focusInput();
    searchRef.current?.addEventListener('mousedown', stopPropagation);
    window.addEventListener('mousedown', handleCloseSearch);
    window.addEventListener('click', stopPropagation);
    window.addEventListener('keyup', (event) => {
      if (event.key === 'Escape') { handleCloseSearch(); }
    });
    return () => {
      window.removeEventListener('mousedown', handleCloseSearch);
      window.removeEventListener('click', stopPropagation);
      window.removeEventListener('keyup', handleCloseSearch);
    };
  }, [handleCloseSearch]);

  const getSuggestionLength = () => {
    return suggestionQuery.length
      ? suggestions.length
      : recentSearches.length + trendingTopics.length
  }

  useEffect(() => {
    if(activeSuggestion < 0) return;

    if(suggestionQuery.length === 0 && activeSuggestion < recentSearches.length + trendingTopics.length) {
      setInputValue([...recentSearches, ...trendingTopics][activeSuggestion]);
    } else if(activeSuggestion < suggestions.length) {
      setInputValue(suggestions[activeSuggestion]);
      setArticlesQuery(suggestions[activeSuggestion]);
    }
  }, [activeSuggestion]);

  useEffect(() => {
    setActiveSuggestion(-1);
  }, [suggestions]);

  const getSearchResultPagePath = (query: string) => { return `${searchResultPagePath}?searchfield=${query}`; };

  const handleSearchClick = (value = inputValue): void => {
    putRecentSearch(value);
    window.location.href = getSearchResultPagePath(value);
  };

  const handleArrowDown = () => {
    setActiveSuggestion((prevSelected) => {
      return prevSelected < getSuggestionLength() - 1
        ? prevSelected + 1
        : 0
    });
  }

  const handleArrowUp = () => {
    setActiveSuggestion((prevSelected) => {
      return prevSelected > 0 
        ? prevSelected  - 1 
        : getSuggestionLength() - 1
    });
  }

  const handleKeyClick = ({ key }: React.KeyboardEvent<HTMLInputElement>): void => {
    if (key === 'Enter' && inputValue.length) {
      handleSearchClick();
    } else if (key === 'ArrowDown') {
      handleArrowDown();
    } else if (key === 'ArrowUp') {
      handleArrowUp();
    }
  };

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const query = event.target.value;
    setInputValue(query);
    setArticlesQuery(query);
    setSuggestionQuery(query);
  };

  const stopPropagation = (event: Event): void => {
    event.stopPropagation();
  };

  const focusInput = (): void => inputRef.current?.focus();

  const renderSearchResults = () => {
    return (!!(suggestions.length || searchRows.length) &&
      <StrictMode>
        <div className={styles.searchResult}>
          <SearchSection
            items={suggestions}
            title=''
            renderItem={(suggestion, index) => (
              <a id={`search-bar-suggestion-${index}`}
                tabIndex={-1}
                aria-label={suggestion}
                href={getSearchResultPagePath(suggestion)}
                onClick={() => {
                  putRecentSearch(suggestion)
                }}
                className={classNames(
                  styles.searchSectionItemsItem,
                  styles.searchSectionItemsItemText,
                  {[styles.searchSectionItemsItemActive]: index === activeSuggestion}
                )}
                dangerouslySetInnerHTML={{ __html: highlightMatches(suggestion, "(?<=^" + getCommonPrefix(suggestion, suggestionQuery.trim(), true) + ").*", "gi") }}
                key={suggestion} />
            )}
          />
          <SearchSection
            items={searchRows.slice(0, 15)}
            title={articlesTitle}
            thinTitle
            overflowHidden
            renderItem={({ article }) => (
              <a href={`${article.path}`} className={styles.article} key={article.path}
                tabIndex={-1}
                onClick={() => putRecentSearch(inputRef.current?.value)}>
                {showThumbnail && <div className={styles.articleImage} style={{ backgroundImage: `url(${article.thumbnail})` }}></div>}
                <div className={styles.articleInfo}>
                  <div className={styles.articleInfoTitle}>{article.title}</div>
                  <div className={styles.articleInfoMetadata}>{article.createdfriendly}</div>
                </div>
              </a>
            )}
          />
        </div>
      </StrictMode>
    );
  };

  const renderDefaultSearchResults = () => {
    if (!(recentSearches.length || trendingTopics.length)) {
      return;
    }

    return (
      <div className={styles.searchResult}>
        <SearchSection
          items={recentSearches}
          title={recentSearchesTitle}
          renderItem={(search, index) => (
            <a id={`search-bar-suggestion-${index}`}
              tabIndex={-1}
              aria-label={search}
              href={getSearchResultPagePath(search)} 
              className={
                classNames(
                  styles.searchSectionItemsItem,
                  styles.searchSectionItemsItemWithIcon,
                  {[styles.searchSectionItemsItemActive]: index === activeSuggestion}
                )} key={search}>
              <span className={classNames(styles.icon, styles.iconHistory)}></span>
              <span className={styles.searchSectionItemsItemText}>{search}</span>
            </a>
          )}
        />
        <SearchSection
          items={trendingTopics}
          title={trendingTopicsTitle}
          renderItem={(topic, index) => (
            <a id={`search-bar-suggestion-${index + recentSearches.length}`}
              tabIndex={-1}
              aria-label={topic}
              href={getSearchResultPagePath(topic)} 
              className={
                classNames(
                  styles.searchSectionItemsItem, 
                  styles.searchSectionItemsItemWithIcon,
                  {[styles.searchSectionItemsItemActive]: index === activeSuggestion - recentSearches.length}
                )} key={topic}>
              <span className={classNames(styles.icon, styles.iconTrending)}></span>
              <span className={styles.searchSectionItemsItemText}>{topic}</span>
            </a>
          )}
        />
      </div>
    );
  };

  return (
    <div className={styles.search} ref={searchRef}>
      <input
        aria-label={searchInputAriaLabel}
        role="combobox"
        type="search"
        aria-activedescendant={activeSuggestion >= 0 ? `search-bar-suggestion-${activeSuggestion}` : null}
        aria-autocomplete="list"
        aria-expanded="true"
        data-testid='search-bar-input'
        onChange={handleInputChange}
        ref={inputRef}
        value={inputValue}
        onKeyDown={handleKeyClick}
      />
      <IconButton
        iconType='search'
        dataTestId='handle-search'
        ariaLabel={searchButtonAriaLabel}
        className={styles.absoluteLeft}
        onClick={() => handleSearchClick()}
      />
      {suggestionQuery.length
        ? renderSearchResults()
        : renderDefaultSearchResults()}
      <IconButton
        iconType='close'
        dataTestId='close-search'
        ariaLabel={closeAriaLabel}
        className={styles.absoluteRight}
        onClick={handleCloseSearch} />
    </div>
  );
};
