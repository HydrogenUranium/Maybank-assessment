import { useEffect, useMemo, useState } from "react";

import { useSortedArticles } from "src/main/webpack/hooks";
import { Article } from "src/main/webpack/types/article";
import { SortByOptions } from "src/main/webpack/types";
import { debounce } from "src/main/webpack/utils";

const getRemSize = () => {
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
}

const calculateColumns = (gridWidth = 0, gridGap: number, gridItemWidth: number): number => {
    return Math.max(1, Math.floor((gridWidth + gridGap * getRemSize()) / ((gridGap + gridItemWidth) * getRemSize())));
};

/**
 * Custom hook to manage the display of articles in a responsive grid layout.
 * 
 * This hook encapsulates the sorting logic and the "show more" button logic.
 * It ensures that the grid displays 2 lines of articles on desktop and tablet,
 * but 3 lines on mobile. The "show more" button will show more lines of items
 * on mobile. The layout adapts based on the size of the container (holder) 
 * rather than the window size, making the component more responsive.
 * 
 * @param {Article[]} articles - The list of articles to display.
 * @param {SortByOptions} sortBy - The sorting option to apply to the articles.
 * @param {React.MutableRefObject<HTMLDivElement>} gridRef - The reference to the grid container element.
 * @param {number} [gridGap=36] - The gap between grid items.
 * @param {number} [gridColumnWidth=270] - The width of each grid item.
 * 
 * @returns {[Article[], () => void]} - Returns the list of articles to display and a function to show more articles.
 */
export const useDisplayArticles = (
    articles: Article[],
    sortBy: SortByOptions,
    gridRef: React.MutableRefObject<HTMLDivElement>,
    gridGap = 3.6,
    gridColumnWidth = 27
): [Article[], () => void] => {
    const [gridWidth, setGridWidth] = useState(0);
    const columns = useMemo(
        () => calculateColumns(gridWidth, gridGap, gridColumnWidth),
        [gridGap, gridColumnWidth, gridWidth]);
    
    const rowsIncrement = useMemo(() => columns < 2 ? 3 : 2, [columns]);
    const [rows, setRows] = useState(rowsIncrement);
    const [displayArticles, setDisplayArticles] = useState<Article[]>([]);
    const sortedArticles = useSortedArticles(articles, sortBy);

    useEffect(() => {
        if(!gridRef.current) {return;}

        const handleResize = debounce(() => {
            setGridWidth(gridRef.current?.offsetWidth || 0);
        }, 100);

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(gridRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, [gridRef]);

    useEffect(() => {
        setRows(calculateColumns(gridRef.current?.offsetWidth, gridGap, gridColumnWidth) < 2 ? 3 : 2);
    }, [articles, gridRef, gridGap, gridColumnWidth]);

    useEffect(() => {
        const gridSize = columns * rows;
        const articlesShown = Math.min(sortedArticles.length, gridSize);

        setDisplayArticles(sortedArticles.slice(0, articlesShown));
    }, [sortedArticles, rows, columns]);

    const showMoreArticles = () => setRows(rows + rowsIncrement);
    return [displayArticles, showMoreArticles];
};
