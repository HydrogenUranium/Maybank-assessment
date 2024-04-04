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


const getUniqueArticlesByPath = (articles: Article[]): Article[] => {
    const articlesMap = new Map<string, Article>();
    articles.forEach(article => {
        articlesMap.set(article.path, article);
    });
    return Array.from(articlesMap.values());
};
  

export const getArticles = async (query: string): Promise<Article[]> => {
    const prefix = getPathPrefix();
    const homePagePathSuffix = getHomePagePath();
    const componentPath = getComponentPath();
    const articles = await get<Article[]>({ 
        url: `${prefix}${componentPath}.searcharticlesuggest.json?s=${query}&homepagepath=${homePagePathSuffix}` 
    });

    return getUniqueArticlesByPath(articles)
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
