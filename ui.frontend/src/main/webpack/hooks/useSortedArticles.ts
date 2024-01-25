import { useState, useEffect } from 'react';
import { Article } from '../types/article';
import { SortByOptions } from '../types';

/**
 * Custom hook for sorting articles.
 * @param {Array} articles - The array of article objects to sort.
 * @param {String} sortBy - The property to sort the articles by.
 * @returns {Array} The sorted array of articles.
 */
export const useSortedArticles = (articles: Article[], sortBy: SortByOptions): Article[] => {
  const [sortedArticles, setSortedArticles] = useState([]);

  const sortByDate = (a: Article, b: Article) => b.createdMilliseconds - a.createdMilliseconds;

  const sortByRecommended = (a: Article, b: Article) => {
    const aRecommended = a.highlights.includes("recommended");
    const bRecommended = b.highlights.includes("recommended");
    return Number(bRecommended) - Number(aRecommended);
  };


  useEffect(() => {
    let sorted;

    switch (sortBy) {
      case 'latest':
        sorted = [...articles].sort(sortByDate);
        break;
      case 'recommended':
        sorted = [...articles].sort(sortByDate).sort(sortByRecommended);
        break;
      default:
        sorted = [...articles];
    }

    setSortedArticles(sorted);
  }, [articles, sortBy]);

  return sortedArticles;
};
