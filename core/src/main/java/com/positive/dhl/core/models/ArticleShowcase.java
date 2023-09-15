package com.positive.dhl.core.models;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.services.PageUtilService;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.*;
import java.util.stream.Stream;

@Getter
@Slf4j
@Model(adaptables = { Resource.class, SlingHttpServletRequest.class })
public class ArticleShowcase {

    @OSGiService
    private PageUtilService pageUtils;

    @Inject
    private QueryBuilder builder;

    @Inject
    private Page currentPage;

    @Inject
    private ResourceResolver resourceResolver;

    @Inject
    @Optional
    private String title;

    @Inject
    @Optional
    private String designMode;

    @Inject
    @Optional
    private String linkName;

    @Inject
    @Optional
    private String linkPath;

    @Inject
    @Optional
    @Default(values = "customPick")
    private String source;

    @ChildResource
    @Optional
    @Named("articles")
    private Resource articleMultifield;

    private List<Article> articles = new ArrayList<>();

    @PostConstruct
    private void init() {
        if (source.equals("customPick")) {
            initCustomPick();
        } else if (source.equals("latest")) {
            initLatestArticles();
        }
    }

    private void initCustomPick() {
        if (articleMultifield != null) {
            Iterator<Resource> multifieldItems = articleMultifield.listChildren();
            while (multifieldItems.hasNext()) {
                var properties = multifieldItems.next().getValueMap();
                String path = properties.get("articlePath", "");
                articles.add(new Article(path, resourceResolver));
            }
        }
    }

    private void initLatestArticles() {
        var homePage = pageUtils.getHomePage(currentPage);
        Map<String, String> customPublishProp = Map.of(
                "type", "cq:Page",
                "path", homePage.getPath(),
                "1_property", "jcr:content/cq:template",
                "1_property.operation", "like",
                "1_property.value", "/conf/dhl/settings/wcm/templates/article",
                "2_property", "jcr:content/custompublishdate",
                "2_property.operation", "exists",
                "orderby", "@jcr:content/custompublishdate",
                "orderby.sort", "ask",
                "p.limit", "4"
        );

        Map<String, String> createdProp = new HashMap<>(customPublishProp);
        createdProp.put("orderby", "@jcr:content/jcr:created");
        createdProp.put("2_property.operation", "not");

        Map<String, String> lastModifiedProp = new HashMap<>(createdProp);
        createdProp.put("orderby", "@jcr:content/cq:lastModified");

        Map<String, Article> articleMap = new HashMap<>();

        searchArticles(customPublishProp).forEach(article -> articleMap.put(article.getPath(), article));
        searchArticles(createdProp).forEach(article -> articleMap.put(article.getPath(), article));
        searchArticles(lastModifiedProp).forEach(article -> articleMap.put(article.getPath(), article));

        articles.addAll(articleMap.values());
        articles.sort((o1, o2) -> o2.getCreatedDate().compareTo(o1.getCreatedDate()));
        articles = articles.subList(0, Math.min(4, articles.size()));
    }

    private List<Article> searchArticles(Map<String, String> props) {
        Session session = resourceResolver.adaptTo(Session.class);
        return java.util.Optional.ofNullable(builder)
                .map(queryBuilder -> queryBuilder.createQuery(PredicateGroup.create(props), session))
                .map(Query::getResult)
                .map(SearchResult::getHits)
                .map(this::getArticlesFromHits)
                .orElse(new ArrayList<>());
    }

    private List<Article> getArticlesFromHits(List<Hit> hits) {
        List<Article> resources = new ArrayList<>();
        hits.forEach(hit -> {
            try {
                resources.add(new Article(hit.getPath(), resourceResolver));
            } catch (RepositoryException exception) {
                log.warn("Failed to get path from sql response", exception);
            }
        });
        return resources;
    }
}
