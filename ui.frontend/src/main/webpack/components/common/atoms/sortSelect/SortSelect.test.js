import React from 'react';
import { create } from 'react-test-renderer';
import { SortSelect } from './SortSelect';

const selectOptions = [
  { value: 'recommended', label: "Recommended" },
  { value: 'latest', label: "Latest" },
];

describe('SortSelect', () => {
  it('should render component "SortSelect" property', () => {
    const component = create(
      <SortSelect
        onChange={() => {}}
        options={selectOptions}
        sortingTitle={"Select"}
      />
    );

    expect(component.toJSON()).toMatchSnapshot();
  });
});
