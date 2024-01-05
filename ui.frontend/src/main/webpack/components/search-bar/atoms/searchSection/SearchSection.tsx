import React from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface SearchSectionProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T, index: number) => JSX.Element;
  thinTitle?: boolean;
  overflowHidden?: boolean;
}

export const SearchSection: React.FC<SearchSectionProps<any>> = (
  { title, items, renderItem, thinTitle, overflowHidden }) => {
  if (!items.length) {
    return null;
  }

  return (
    <div className={classNames(styles.searchSection, { [styles.searchSectionOverflowHidden]: overflowHidden })}>
      {title &&
        <div className={classNames(styles.searchSectionTitle, { [styles.searchSectionTitleThin]: thinTitle })}>
          {title}
        </div>}
      <div className={styles.searchSectionItems}>
        {items.map((item, index) => renderItem(item, index))}
      </div>
    </div>
  );
};
