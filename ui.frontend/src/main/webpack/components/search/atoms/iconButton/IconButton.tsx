import React from 'react';

import styles from './styles.module.scss';

type IconButtonProps = {
  dataTestId?: string,
  onClick?: (event: React.MouseEvent<HTMLElement>) => void,
}

export const IconButton: React.FC<IconButtonProps> = ({
  dataTestId,
  onClick
}) => (
  <button
    data-testid={dataTestId}
    onClick={onClick}
    className={styles.searchButton}>
    <span className={styles.searchButtonImage}></span>
  </button>
);
