import React, { useState } from 'react';

import { registerComponent } from '../../react-core/registry';
import { IconButton } from './atoms/iconButton/IconButton';
import { SearchPanel } from './molecules/searchPanel/SearchPanel';

import styles from './styles.module.scss';

interface SearchBarProps {
  recentSearchesTitle: string;
  trendingTopicsTitle: string;
  articlesTitle: string;
  trendingTopics: string[];
  searchResultPagePath: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  recentSearchesTitle,
  trendingTopicsTitle,
  articlesTitle,
  trendingTopics,
  searchResultPagePath
}) => {
  const [active, setActive] = useState(false);
 
  return (
    <div className={styles.searchBar}>
      {active ? (
        <SearchPanel
          recentSearchesTitle={recentSearchesTitle}
          trendingTopicsTitle={trendingTopicsTitle}
          articlesTitle={articlesTitle}
          trendingTopics={trendingTopics}
          searchResultPagePath={searchResultPagePath}
          handleCloseSearch={() => setActive(false)}
        />
      ) : (
        <IconButton
          iconType='search'
          onClick={() => setActive(true)}
        />
      )}
    </div>
  );
};

registerComponent("search-bar", SearchBar);
