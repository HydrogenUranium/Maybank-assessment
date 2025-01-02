import { useMemo } from "react";

import { ArticleCategory, IndexedArticleCategory } from "src/main/webpack/types";
import { uniqueBy } from "src/main/webpack/utils";

const createIndexedCategories = (categories: ArticleCategory[]): IndexedArticleCategory[] =>
    categories.map((category, index) => ({
        ...category,
        id: index
    }));

/**
 * Custom hook to process and return a list of categories with optional "All" tab and unique indices.
 *
 * @param categories - Array of article categories to process.
 * @param includeAllTab - Boolean flag to include an "All" tab combining all articles.
 * @param allCategoryTitle - Title to display for the "All" tab.
 * @returns Array of indexed categories, each with an added `id` property.
 *
 * ### Behavior:
 * 1. Filters out empty categories (those with no articles).
 * 2. Optionally adds an "All" category containing all unique articles from non-empty categories.
 * 3. Appends a unique `id` to each category, corresponding to its position in the array.
 *
 */

export const useDisplayedCategories = (
    categories: ArticleCategory[],
    includeAllTab: boolean,
    allCategoryTitle: string): IndexedArticleCategory[] =>
        
    useMemo(() => {
        const notEmptyCategories = categories.filter((category) => category.articles.length);

        if (!includeAllTab) {
            return createIndexedCategories(notEmptyCategories);
        }

        const articlesFromNotEmptyCategories = notEmptyCategories.flatMap((category) => category.articles);
        const allCategory = {
            name: allCategoryTitle,
            articles: uniqueBy(articlesFromNotEmptyCategories, (article) => article.path)
        };

        return createIndexedCategories([allCategory, ...notEmptyCategories]);

    }, [categories, includeAllTab, allCategoryTitle]);
