import React, { useRef, useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';

import { getRecentSearches, putRecentSearch } from 'src/main/webpack/services/local-storage/recentSearch';
import { getArticles, getTagSuggestions } from 'src/main/webpack/services/api/search';
import { IconButton } from '../../atoms/iconButton/IconButton';
import { useDataFetching } from '../../../../hooks/useDataFetching';
import { SearchSection } from '../../../common/atoms/searchSection/SearchSection';
import { highlightMatches } from 'src/main/webpack/utils';

import styles from './styles.module.scss';

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
  const [tagSuggestions] = useDataFetching(inputValue, getTagSuggestions);
  const [articleSuggestions] = useDataFetching(inputValue, getArticles);
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

  const getSearchResultPagePath = (query: string) => { return `${searchResultPagePath}?searchfield=${query}`; };

  const handleSearchClick = (): void => {
    putRecentSearch(inputValue);
    window.location.href = getSearchResultPagePath(inputValue);
  };

  const handleKeyClick = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' && inputValue.length) { handleSearchClick(); }
  };

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const query = event.target.value;
    setInputValue(query);
  };

  const stopPropagation = (event: Event): void => {
    event.stopPropagation();
  };

  const focusInput = (): void => inputRef.current?.focus();

  const renderSearchResults = () => {
    if (tagSuggestions.length == 0 && articleSuggestions.length == 0) {
      return;
    }

    return (
      <div className={styles.searchResult}>
        <SearchSection
          items={tagSuggestions}
          title=''
          renderItem={(suggestion) => (
            <button
              onClick={() => {
                setInputValue(suggestion);
                focusInput();
              }}
              className={classNames(styles.searchSectionItemsItem, styles.searchSectionItemsItemText)}
              dangerouslySetInnerHTML={{__html: highlightMatches(suggestion, "^" + inputValue, "gi")}}
              key={suggestion}/>
          )}
        />
        <SearchSection
          items={articleSuggestions}
          title={articlesTitle}
          thinTitle
          overflowHidden
          renderItem={(article) => (
            <a href={`${article.path}.html`} className={styles.article} key={article.path}>
              <div className={styles.articleImage} style={{ backgroundImage: `url(${article.listimage})` }}></div>
              <div className={styles.articleInfo}>
                <div className={styles.articleInfoTitle}>{article.title}</div>
                <div className={styles.articleInfoMetadata}>{article.createdfriendly}</div>
              </div>
            </a>
          )}
        />
      </div>
    );
  };

  const renderDefaultSearchResults = () => {
    if (recentSearches.length == 0 && trendingTopics.length == 0) {
      return;
    }

    return (
      <div className={styles.searchResult}>
        <SearchSection
          items={recentSearches}
          title={recentSearchesTitle}
          renderItem={(search) => (
            <a href={getSearchResultPagePath(search)} className={classNames(styles.searchSectionItemsItem, styles.searchSectionItemsItemWithIcon)} key={search}>
              <span className={classNames(styles.icon, styles.iconHistory)}></span>
              <span className={styles.searchSectionItemsItemText}>{search}</span>
            </a>
          )}
        />
        <SearchSection
          items={trendingTopics}
          title={trendingTopicsTitle}
          renderItem={(topic) => (
            <a href={getSearchResultPagePath(topic)} className={classNames(styles.searchSectionItemsItem, styles.searchSectionItemsItemWithIcon)} key={topic}>
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
      <IconButton
        iconType='search'
        dataTestId='handle-search'
        className={styles.absoluteLeft}
        onClick={handleSearchClick}
      />
      <input
        aria-label='Search'
        data-testid='search-bar-input'
        onChange={handleInputChange}
        ref={inputRef}
        value={inputValue}
        onKeyDown={handleKeyClick}
      />

      {inputValue.length > 0
        ? renderSearchResults()
        : renderDefaultSearchResults()}
      <IconButton
        iconType='close'
        dataTestId='close-search'
        className={styles.absoluteRight}
        onClick={handleCloseSearch} />
    </div>
  );
};
