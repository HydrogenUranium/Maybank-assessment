import * as processors from './processors';

export const processLoading = (): void => {
  window.document.addEventListener('DOMContentLoaded', () => {
    processors.processComponents();
  });
};
