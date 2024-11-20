package com.dhl.discover.core.models.search;

import com.google.gson.annotations.Expose;
import com.dhl.discover.core.models.Article;
import lombok.Getter;

@Getter
public class SearchResultEntry {
    @Expose
    private final Article article;
    @Expose
    private final String excerpt;

    public SearchResultEntry(Article article) {
        this.article = article;
        excerpt = "";
    }

    public SearchResultEntry(Article article, String excerpt) {
        this.article = article;
        this.excerpt = excerpt;
    }
}
