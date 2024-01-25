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
    path: string,
    tagsToShow: string[],
    title: string,
    readtime: string,
    highlights: string[]
}
