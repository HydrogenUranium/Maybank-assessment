import { SearchResult } from "../../types/article";
import { get } from "./httpRequest";

export const getPathPrefix = (): string => {
    const isAuthor = !!document.cookie.split(";").find((element) => element.indexOf("wcmmode") !== -1);
    const prefix = document.querySelector('head meta[name=\'dhl-path-prefix\']').getAttribute('content');
    return (!isAuthor && prefix) ? prefix : '';
};

export const getHomePagePath = (): string => {
    return document.querySelector('head meta[name=\'dhl-path-home\']').getAttribute('content');
};

export const getComponentPath = (): string => {
    const componentConfig = document.querySelector('.header .search-bar-component').getAttribute('data-config');
    return JSON.parse(componentConfig).currentPagePath + '/jcr:content/root';
};

export const getArticles = async (query: string): Promise<SearchResult> => {
    const prefix = getPathPrefix();
    const homePagePath = getHomePagePath();
    const componentPath = getComponentPath();
    const searchResult = await get<SearchResult>({ 
        url: `${homePagePath}.search.json?s=${query}`
    });

    return searchResult;
};

export const getTags = async (query: string): Promise<any> => {
    const homePagePath = getHomePagePath();
    const prefix = getPathPrefix();
    return get({ url: `${homePagePath}.suggestions.json?s=${query}` });
};

export const getTagSuggestions = async(query: string): Promise<string[]> => {
    return getTags(query).then((result) => {
        const resultSet = new Set<string>();
        result.results.forEach(suggestion => {
            resultSet.add(suggestion);
        });
        return Array.from(resultSet).slice(0, 5);
    });
};
