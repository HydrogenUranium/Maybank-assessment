import React from 'react';
import { create } from 'react-test-renderer';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('should render "IconButton" component property', () => {
    const component = create(
      <IconButton
      iconType={'close'}
      dataTestId={'testId'}
      className={'className'}
      hidden={false}
      onClick={() =>{}}
      />
    );
    
    expect(component.toJSON()).toMatchSnapshot();
  }),

  it('should render "IconButton" component property when hidden=true', () => {
    const component = create(
      <IconButton
      iconType={'close'}
      dataTestId={'testId'}
      className={'className'}
      hidden={true}
      onClick={() =>{}}
      />
    );
    
    expect(component.toJSON()).toMatchSnapshot();
  });
});
