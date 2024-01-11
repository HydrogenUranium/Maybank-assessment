import React from 'react';
import { create } from 'react-test-renderer';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('should render "IconButton" component property', () => {
    const component = create(
      <IconButton
        dataTestId={'testId'}
      />
    );
    
    expect(component.toJSON()).toMatchSnapshot();
  });
});
