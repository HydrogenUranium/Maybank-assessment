package com.dhl.discover.core.constants;

public enum SchemaMarkupType {
    WEB_SITE("WebSite"),
    WEB_PAGE("WebPage"),
    VIDEO_OBJECT("VideoObject"),
    BLOG_POSTING("BlogPosting"),
    ORGANIZATION("Organization"),
    SEARCH_ACTION("SearchAction"),
    IMAGE_OBJECT("ImageObject"),
    FAQ_PAGE("FAQPage"),
    QUESTION("Question"),
    ANSWER("Answer");

    private final String value;

    SchemaMarkupType(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return this.value;
    }
}
