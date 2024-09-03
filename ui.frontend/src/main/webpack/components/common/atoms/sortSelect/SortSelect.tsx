import React from 'react';
import Select from 'react-select';

import styles from './styles.module.scss';
import { selectStyles } from './selectStyles';

export const SortSelect = ({ options, onChange, sortingTitle }) => (
  <div className={styles.sort}>
    <label htmlFor='sort-by' className={styles.sortLabel}>{sortingTitle}</label>
    <div id="sort-by" className={styles.sortSelect}>
      <Select
        defaultValue={options[0]}
        isSearchable={false}
        components={{ IndicatorSeparator: () => null }}
        onChange={onChange}
        options={options}
        styles={selectStyles}
      />
    </div>
  </div>
);
