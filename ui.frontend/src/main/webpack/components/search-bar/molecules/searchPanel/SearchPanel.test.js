import React from 'react';
import { create } from 'react-test-renderer';
import { SearchPanel } from './SearchPanel';

describe('SearchPanel', () => {
  it('should render component "SearchPanel" property', () => {
    const component = create(
      <SearchPanel
        recentSearchesTitle={'Recent Search'}
        trendingTopicsTitle={'Trending Topics'}
        articlesTitle={'Articles'}
        trendingTopics={['Business', 'China']}
        searchResultPagePath={'/search-result'}
        handleCloseSearch={() => {}}
      />
    );
    
    expect(component.toJSON()).toMatchSnapshot();
  });
});
