import { useEffect, useState } from "react";
import { useSortedArticles } from "src/main/webpack/hooks";
import { Article } from "src/main/webpack/types/article";
import { useItemsInLine } from "./useItemsInLine";
import { SortByOptions, WindowSize } from "src/main/webpack/types";

export const useDisplayArticles = (
    articles: Article[],
    numberOfLines: number,
    sortBy: SortByOptions,
    size: WindowSize
) => {
    const sortedArticles = useSortedArticles(articles, sortBy);
    const itemsInLine = useItemsInLine(size);
    const [displayArticles, setDisplayArticles] = useState([]);

    useEffect(()=> {
        const totalItems = itemsInLine * numberOfLines;
        const displayLimit = Math.min(sortedArticles.length, totalItems);

        setDisplayArticles(sortedArticles.slice(0, displayLimit));
    },[sortedArticles, numberOfLines, itemsInLine]);

    return displayArticles;
};
