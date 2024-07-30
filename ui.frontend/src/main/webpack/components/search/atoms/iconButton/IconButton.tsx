import React from 'react';

import styles from './styles.module.scss';

type IconButtonProps = {
  dataTestId?: string,
  ariaLabel?: string,
  onClick?: (event: React.MouseEvent<HTMLElement>) => void,
}

export const IconButton: React.FC<IconButtonProps> = ({
  dataTestId,
  ariaLabel,
  onClick
}) => (
  <button
    data-testid={dataTestId}
    aria-label={ariaLabel}
    onClick={onClick}
    className={styles.searchButton}>
    <span className={styles.searchButtonImage}></span>
  </button>
);
