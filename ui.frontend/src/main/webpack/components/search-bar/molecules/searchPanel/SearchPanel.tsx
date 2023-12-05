import React, { useRef, useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';

import { getRecentSearches, putRecentSearch } from 'src/main/webpack/services/local-storage/recentSearch';
import { Article } from 'src/main/webpack/types/article';
import { getMockArticles, getMockSuggestions } from 'src/main/webpack/services/api/search';
import { getHighlightedSuggestion } from '../../helpers';
import { IconButton } from '../../atoms/iconButton/IconButton';

import styles from './styles.module.scss';
import { useDataFetching } from '../../hooks/useDataFetching';
import { SearchSection } from '../../atoms/searchSection/SearchSection';

interface SearchPanelProps {
  recentSearchesTitle: string;
  trendingTopicsTitle: string;
  articlesTitle: string;
  trendingTopics: string[];
  searchResultPagePath: string;
  handleCloseSearch: () => void
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  recentSearchesTitle,
  trendingTopicsTitle,
  articlesTitle,
  trendingTopics,
  searchResultPagePath,
  handleCloseSearch
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions] = useDataFetching(inputValue, getMockSuggestions);
  const [articles] = useDataFetching(inputValue, getMockArticles);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const recentSearches = useMemo(() => getRecentSearches(), [])

  useEffect(() => {
    focusInput();
    searchRef.current?.addEventListener('mousedown', stopPropagation);
    window.addEventListener('mousedown', handleCloseSearch);
    window.addEventListener('click', stopPropagation);
    window.addEventListener('keyup', (event) => {
      if (event.key === 'Escape') handleCloseSearch()
    })
    return () => {
      window.removeEventListener('mousedown', handleCloseSearch);
      window.removeEventListener('click', stopPropagation);
      window.removeEventListener('keyup', handleCloseSearch);
    }
  }, []);

  const getSearchResultPagePath = (query: string) => { return `${searchResultPagePath}?query=${query}` };

  const handleSearchClick = (): void => {
    putRecentSearch(inputValue);
    window.location.href = `${searchResultPagePath}?query=${inputValue}`;
  };

  const handleKeyClick = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' && inputValue.length)
      handleSearchClick();
  };

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const query = event.target.value;
    setInputValue(query);
  };

  const stopPropagation = (event: Event): void => {
    event.stopPropagation();
  };

  const focusInput = (): void => inputRef.current?.focus();

  return (
    <div className={styles.search} ref={searchRef}>
      <IconButton
        iconType='search'
        className={styles.absoluteLeft}
        onClick={handleSearchClick}
      />
      <input
        aria-label={"Search"}
        onChange={handleInputChange}
        ref={inputRef}
        value={inputValue}
        onKeyDown={handleKeyClick}
      />
      <div className={styles.searchResult}>
        {inputValue.length > 0
          ? (<>
            <SearchSection
              items={suggestions}
              title=''
              renderItem={(suggestion) => (
                <button
                  onClick={() => {
                    setInputValue(suggestion);
                    focusInput();
                  }}
                  className={classNames(styles.searchSectionItemsItem, styles.searchSectionItemsItemText)}
                  key={suggestion}>
                  {getHighlightedSuggestion(inputValue, suggestion)}
                </button>
              )}
            />
            <SearchSection
              items={articles}
              title={articlesTitle}
              thinTitle
              overflowHidden
              renderItem={(article: Article) => (
                <a href={article.link} className={styles.article} key={article.link}>
                  <div className={styles.articleImage} style={{ backgroundImage: `url(${article.image})` }}></div>
                  <div className={styles.articleInfo}>
                    <div className={styles.articleInfoTitle}>{article.title}</div>
                    <div className={styles.articleInfoMetadata}>{article.date}</div>
                  </div>
                </a>
              )}
            />
          </>) : (<>
            <SearchSection
              items={recentSearches}
              title={recentSearchesTitle}
              renderItem={(search) => (
                <a href={getSearchResultPagePath(search)} className={styles.searchSectionItemsItem} key={search}>
                  <span className={classNames(styles.icon, styles.iconHistory)}></span>
                  <span className={styles.searchSectionItemsItemText}>{search}</span>
                </a>
              )}
            />
            <SearchSection
              items={trendingTopics}
              title={trendingTopicsTitle}
              renderItem={(topic) => (
                <a href={getSearchResultPagePath(topic)} className={styles.searchSectionItemsItem} key={topic}>
                  <span className={classNames(styles.icon, styles.iconTrending)}></span>
                  <span className={styles.searchSectionItemsItemText}>{topic}</span>
                </a>
              )}
            />
          </>)}
      </div>
      <IconButton
        iconType='close'
        className={styles.absoluteRight}
        hidden={!inputValue.length}
        onClick={handleCloseSearch} />
    </div>
  );
};
