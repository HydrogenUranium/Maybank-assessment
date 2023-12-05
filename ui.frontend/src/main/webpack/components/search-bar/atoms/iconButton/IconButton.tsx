import React from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type IconButtonProps = {
  iconType: 'close' | 'search',
  className?: string,
  hidden?: boolean,
  onClick?: (event: React.MouseEvent<HTMLElement>) => void,
}

export const IconButton: React.FC<IconButtonProps> = ({
  iconType,
  className,
  hidden,
  onClick
}) => (
  <button onClick={onClick} className={
    classNames(
      styles.searchButton,
      { [className]: className },
      { [styles.hidden]: hidden }
    )
  }>
    <span className={
      classNames(
        styles.searchButtonImage,
        { [styles.searchButtonImageSearch]: iconType == 'search' },
        { [styles.searchButtonImageClose]: iconType == 'close' }
      )
    }></span>
  </button>
);
