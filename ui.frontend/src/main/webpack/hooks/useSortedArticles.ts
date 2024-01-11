import { useState, useEffect } from 'react';
import { Article } from '../types/article';

/**
 * Custom hook for sorting articles.
 * @param {Array} articles - The array of article objects to sort.
 * @param {String} sortBy - The property to sort the articles by.
 * @returns {Array} The sorted array of articles.
 */
export const useSortedArticles = (articles: Article[], sortBy: 'latest' | 'test' = 'latest'): Article[]  => {
  const [sortedArticles, setSortedArticles] = useState([]);

  useEffect(() => {
    let sorted;

    switch (sortBy) {
      case 'latest':
        sorted = [...articles].sort((a, b) => b.createdMilliseconds - a.createdMilliseconds);
        break;
      default:
        sorted = [...articles];
    }

    setSortedArticles(sorted);
  }, [articles, sortBy]);

  return sortedArticles;
};
