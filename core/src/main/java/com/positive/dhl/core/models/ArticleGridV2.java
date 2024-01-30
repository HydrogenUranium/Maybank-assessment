package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.injectors.InjectHomeProperty;
import com.positive.dhl.core.services.ArticleService;
import com.positive.dhl.core.services.InitUtil;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
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

import static com.day.cq.wcm.api.commands.WCMCommand.PAGE_TITLE_PARAM;
import static com.positive.dhl.core.services.PageUtilService.CATEGORY_PAGE_DYNAMIC_RESOURCE_TYPE;

import static org.apache.commons.lang3.StringUtils.defaultIfBlank;

@Getter
@Model(adaptables = SlingHttpServletRequest.class)
@Slf4j
public class ArticleGridV2 {
    @Inject
    private Page currentPage;

    @OSGiService
    private InitUtil initUtil;

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
    @Named("articleGrid-recommendedOptionTitle")
    @Default(values = "Recommended")
    private String recommendedOptionTitle;

    @InjectHomeProperty
    @Optional
    @Named("articleGrid-ShowMoreButtonTitle")
    @Default(values = "Show More")
    private String showMoreButtonTitle;

    @InjectHomeProperty
    @Optional
    @Named("articleGrid-showTags")
    @Default(values = "false")
    private String showTags;

    private final Map<String, List<Article>> categoryArticleMap = new LinkedHashMap<>();

    @PostConstruct
    private void init() {
        var allLatestArticles = articleService.getAllArticles(currentPage);
        categoryArticleMap.put(allCategoriesTitle, allLatestArticles);

        getSubCategories().forEach(category -> {
            var categoryArticles = articleService.getAllArticles(category);
            var categoryTitle = defaultIfBlank(category.getNavigationTitle(), category.getTitle());
            if (categoryTitle != null) {
                categoryArticleMap.put(categoryTitle, categoryArticles);
            }
        });
    }

    private List<Page> getSubCategories() {
        List<Page> subCategories = new ArrayList<>();
        currentPage.listChildren().forEachRemaining(page -> {
            String template = java.util.Optional.of(page)
                    .map(Page::getContentResource)
                    .map(Resource::getResourceType)
                    .orElse("");
            if (CATEGORY_PAGE_DYNAMIC_RESOURCE_TYPE.equals(template) && !page.isHideInNav()) {
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
                        .add(PAGE_TITLE_PARAM, article.getTitle())
                        .add("path", article.getPath() + ".html")
                        .add("description", article.getDescription())
                        .add("listimage", article.getListimage())
                        .add("createdfriendly", article.getCreatedfriendly())
                        .add("createdMilliseconds", article.getCreatedMilliseconds())
                        .add("author", article.getAuthor())
                        .add("groupTag", article.getGroupTag())
                        .add("tagsToShow", Json.createArrayBuilder(article.getTagsToShow()).build())
                        .add("highlights", Json.createArrayBuilder(article.getHighlights()).build())
                        .build();
                articlesJson.add(articleJson);
            });
            categories.add(Json.createObjectBuilder().add("name", category).add("articles", articlesJson));
        });
        categories.build();

        return Json.createObjectBuilder()
                .add(PAGE_TITLE_PARAM, title)
                .add("showTags", showTags.equals("true"))
                .add("categories", categories)
                .add("showMoreResultsButtonTitle", "Show More")
                .add("recommendedOptionTitle", recommendedOptionTitle)
                .add("latestOptionTitle", latestOptionTitle)
                .add("sortingTitle", sortTitle)
                .build().toString();
    }
}
