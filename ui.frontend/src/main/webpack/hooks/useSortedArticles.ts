import { useState, useEffect } from 'react';
import { SearchResult, SearchRow, Article } from '../types/article';
import { SortByOptions } from '../types';

export const useSortedSearchResult = (searchResult: SearchResult, sortBy?: SortByOptions): SearchResult => {
  const [sortedSearchResult, setSortedSearchResult] = useState([]);

  const sortByDate = (a: SearchRow, b: SearchRow) => b.article.createdMilliseconds - a.article.createdMilliseconds;

  const sortByRecommended = (a: SearchRow, b: SearchRow) => {
    const aRecommended = a.article.highlights.includes("recommended");
    const bRecommended = b.article.highlights.includes("recommended");
    return Number(bRecommended) - Number(aRecommended);
  };


  useEffect(() => {
    let sorted;

    switch (sortBy) {
      case 'latest':
        sorted = [...searchResult].sort(sortByDate);
        break;
      case 'recommended':
        sorted = [...searchResult].sort(sortByDate).sort(sortByRecommended);
        break;
      default:
        sorted = [...searchResult];
    }

    setSortedSearchResult(sorted);
  }, [searchResult, sortBy]);

  return sortedSearchResult;
};

export const useSortedArticles = (articles: Article[], sortBy?: SortByOptions): Article[] => {
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

