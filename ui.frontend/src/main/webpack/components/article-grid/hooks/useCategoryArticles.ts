import { useEffect, useState } from "react";
import { Article, ArticleCategory } from "src/main/webpack/types/article";

export const useCategoryArticles = (
    categories: ArticleCategory[],
    selectedCategory: string
): Article[] => {
    const [categoryArticles, setCategoryArticles] = useState(categories.length ? categories[0].articles : []);

    useEffect(() => {
        const category = categories.find(item => item.name === selectedCategory);
        if(category) {
            setCategoryArticles(category.articles);
        }
    }, [categories, selectedCategory]);

    return categoryArticles;
}; 
