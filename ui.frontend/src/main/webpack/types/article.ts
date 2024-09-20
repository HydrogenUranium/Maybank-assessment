export type ArticleCategory = {
    name: string;
    articles: Article[];
}

export type Article = {
    author: string,
    createdfriendly: string,
    createdMilliseconds: number,
    description: string,
    listimage: string,
    groupTag: string,
    thumbnail: string,
    path: string,
    tagsToShow: string[],
    title: string,
    readtime: string,
    highlights: string[]
}

export type SearchRow = {
    article: Article,
    excerpt: string
}

export type SearchResult = SearchRow[]
