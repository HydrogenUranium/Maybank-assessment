package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.Template;
import com.positive.dhl.core.injectors.InjectHomeProperty;
import com.positive.dhl.core.services.ArticleService;
import com.positive.dhl.core.services.AssetUtilService;
import com.positive.dhl.core.services.InitUtil;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Getter
@Model(adaptables = SlingHttpServletRequest.class)
@Slf4j
public class ArticleGridV2 {
    @Inject
    private Page currentPage;

    @Inject
    private ResourceResolver resourceResolver;

    @OSGiService
    private InitUtil initUtil;

    @OSGiService
    private AssetUtilService assetUtilService;

    @OSGiService
    private ArticleService articleService;

    @InjectHomeProperty
    @Optional
    @Named("articleGrid-title")
    @Default(values = "Categories")
    private String title;

    @InjectHomeProperty
    @Optional
    @Named("articleGrid-allTitle")
    @Default(values = "All")
    private String allCategoriesTitle;

    @InjectHomeProperty
    @Optional
    @Named("articleGrid-sortTitle")
    @Default(values = "Sort By")
    private String sortTitle;

    @InjectHomeProperty
    @Optional
    @Named("articleGrid-latestOptionTitle")
    @Default(values = "Latest")
    private String latestOptionTitle;

    @InjectHomeProperty
    @Optional
    @Named("articleGrid-showTags")
    @Default(values = "false")
    private String showTags;

    private final Map<String, List<Article>> categoryArticleMap = new LinkedHashMap<>();

    @PostConstruct
    private void init() {
        var allLatestArticles = articleService.getLatestArticles(currentPage, 8);
        categoryArticleMap.put(allCategoriesTitle, allLatestArticles);

        getSubCategories().forEach(category -> {
            var categoryArticles = articleService.getLatestArticles(category, 8);
            categoryArticleMap.put(category.getNavigationTitle(), categoryArticles);
        });
    }

    private List<Page> getSubCategories() {
        List<Page> subCategories = new ArrayList<>();
        currentPage.listChildren().forEachRemaining(page -> {
            String template = java.util.Optional.of(page)
                    .map(Page::getTemplate)
                    .map(Template::getPageTypePath)
                    .orElse("");
            if (List.of("dhl/components/pages/articlecategory", "dhl/components/pages/editable-category-page").contains(template)) {
                subCategories.add(page);
            }
        });

        return subCategories;
    }

    public String toJson() {
        JsonArrayBuilder categories = Json.createArrayBuilder();
        categoryArticleMap.forEach((category, articles) -> {
            JsonArrayBuilder articlesJson = Json.createArrayBuilder();
            articles.forEach(article -> {
                JsonObject articleJson = Json.createObjectBuilder()
                        .add("title", article.getTitle())
                        .add("link", article.getPath() + ".html")
                        .add("description", article.getDescription())
                        .add("image", assetUtilService.resolvePath(article.getListimage()))
                        .add("date", article.getCreatedfriendly())
                        .add("author", article.getAuthor())
                        .add("groupTag", article.getGroupTag())
                        .add("tags", Json.createArrayBuilder(article.getTagsToShow()).build())
                        .build();
                articlesJson.add(articleJson);
            });
            categories.add(Json.createObjectBuilder().add("name", category).add("articles", articlesJson));
        });
        categories.build();

        return Json.createObjectBuilder()
                .add("title", title)
                .add("showTags", showTags.equals("true"))
                .add("categories", categories)
                .add("sorting", Json.createObjectBuilder()
                        .add("title", sortTitle)
                        .add("options", Json.createArrayBuilder()
                                .add(Json.createObjectBuilder()
                                        .add("name", latestOptionTitle))))
                .build().toString();
    }
}
