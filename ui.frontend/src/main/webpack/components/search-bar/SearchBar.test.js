import React from 'react';
import { create } from 'react-test-renderer';
import { SearchBar } from './SearchBar.component';

describe('SearchBar', () => {
  it('should render component "SearchBar" property', () => {
    const component = create(
      <SearchBar
        recentSearchesTitle={'Recent Searches'}
        trendingTopicsTitle={'Trending Topics'}
        articlesTitle={'Articles'}
        trendingTopics={'Trending Topics'}
        searchResultPagePath={'/search-result'}
      />
    );
    
    expect(component.toJSON()).toMatchSnapshot();
  });
});
