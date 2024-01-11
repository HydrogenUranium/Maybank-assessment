import React from 'react';
import { create } from 'react-test-renderer';
import { Search } from './Search.component';

describe('Search', () => {
  it('should render component "Search" property', () => {
    const component = create(
      <Search
        descriptionFormat='<p>Browse search results for <b>{0}</b> (Showing {1} of {2} results)</p>'
        latestSortOptionTitle='Latest'
        popularSearches={["Business", "China"]}
        popularSearchesTitle='Popular searches'
        showMoreResultsButtonTitle='Show More Results'
        sortByTitle='Sort By'
        title='Search Results'
      />
    );
    
    expect(component.toJSON()).toMatchSnapshot();
  });
});
