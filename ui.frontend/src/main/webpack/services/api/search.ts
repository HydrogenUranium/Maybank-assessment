import { Article } from "../../types/article";
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
    var componentConfig = document.querySelector('.headerV2 .search-bar-component').getAttribute('data-config');
    return JSON.parse(componentConfig).currentPagePath + '/jcr:content/root';
};

export const getArticles = async (query: string): Promise<Article[]> => {
    const prefix = getPathPrefix();
    const homePagePathSuffix = getHomePagePath();
    const componentPath = getComponentPath();
    return get({ 
        url: `${prefix}${componentPath}.searcharticlesuggest.json?s=${query}&homepagepath=${homePagePathSuffix}` 
    });
};

export const getTags = async (query: string): Promise<any> => {
    const prefix = getPathPrefix();
    return get({ url: `${prefix}/apps/dhl/discoverdhlapi/tags/index.json?s=${query}` });
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

export const getArticleSuggestions = async (query: string): Promise<Article[]> => {
    return getArticles(query).then((result) => {
        return result.slice(0, 5);
    });
};
