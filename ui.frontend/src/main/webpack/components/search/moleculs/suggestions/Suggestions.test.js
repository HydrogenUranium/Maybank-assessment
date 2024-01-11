import React from 'react';
import { create } from 'react-test-renderer';
import { Suggestions } from './Suggestions';

describe('Suggestions', () => {
  it('should render "Suggestions" component property when input is empty', () => {
    const component = create(
      <Suggestions
        recentSearches={['Business', 'China']}
        inputValue={''}
        hidden={false}
        focusInput = {() => {}}
        setInputValue = {() => {}}
        handleSearch = {() => {}}
      />
    );
    
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render "Suggestions" component property when input is not empty but there is no suggestions', () => {
    const component = create(
      <Suggestions
        recentSearches={['Business', 'China']}
        inputValue={'Logistics'}
        hidden={false}
        focusInput = {() => {}}
        setInputValue = {() => {}}
        handleSearch = {() => {}}
      />
    );
    
    expect(component.toJSON()).toMatchSnapshot();
  });
});
