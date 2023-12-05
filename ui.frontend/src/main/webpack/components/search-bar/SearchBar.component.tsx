import React, { useRef, useState, useEffect } from 'react';

import { registerComponent } from '../../react-core/registry';

import { IconButton } from './atoms/iconButton/IconButton';
import { SearchPanel } from './molecules/searchPanel/SearchPanel';

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
    <div>
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
