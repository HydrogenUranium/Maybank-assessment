package com.positive.dhl.core.services;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.models.Article;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.*;

@Component(service = ArticleService.class)
@Slf4j
public class ArticleService {

    @Reference
    protected ResourceResolverHelper resolverHelper;

    @Reference
    protected QueryBuilder builder;

    public List<Article> getLatestArticles(String parentPath, int limit) {
        return Optional.ofNullable(resolverHelper.getReadResourceResolver())
                .map(resolver -> resolver.getResource(parentPath))
                .map(resource -> resource.adaptTo(Page.class))
                .map(page -> getLatestArticles(page, limit))
                .orElse(new ArrayList<>());
    }

    public List<Article> getLatestArticles(Page parent, int limit) {
        var resolver = resolverHelper.getReadResourceResolver();
        Map<String, String> customPublishProp = Map.of(
                "type", "cq:Page",
                "path", parent.getPath(),
                "1_property", "jcr:content/cq:template",
                "1_property.operation", "like",
                "1_property.value", "/conf/dhl/settings/wcm/templates/article",
                "2_property", "jcr:content/custompublishdate",
                "2_property.operation", "exists",
                "orderby", "@jcr:content/custompublishdate",
                "orderby.sort", "ask",
                "p.limit", limit + ""
        );

        Map<String, String> createdProp = new HashMap<>(customPublishProp);
        createdProp.put("orderby", "@jcr:content/jcr:created");
        createdProp.put("2_property.operation", "not");

        Map<String, String> lastModifiedProp = new HashMap<>(createdProp);
        createdProp.put("orderby", "@jcr:content/cq:lastModified");

        Map<String, Article> articleMap = new HashMap<>();

        searchArticles(customPublishProp, resolver).forEach(article -> articleMap.put(article.getPath(), article));
        searchArticles(createdProp, resolver).forEach(article -> articleMap.put(article.getPath(), article));
        searchArticles(lastModifiedProp, resolver).forEach(article -> articleMap.put(article.getPath(), article));

        List<Article> articles = new ArrayList<>(articleMap.values());
        articles.sort((o1, o2) -> o2.getCreatedDate().compareTo(o1.getCreatedDate()));
        return articles.subList(0, Math.min(limit, articles.size()));
    }

    private List<Article> searchArticles(Map<String, String> props, ResourceResolver resolver) {
        Session session = resolver.adaptTo(Session.class);
        return java.util.Optional.ofNullable(builder)
                .map(queryBuilder -> queryBuilder.createQuery(PredicateGroup.create(props), session))
                .map(Query::getResult)
                .map(SearchResult::getHits)
                .map(hits -> getArticlesFromHits(hits, resolver))
                .orElse(new ArrayList<>());
    }

    private List<Article> getArticlesFromHits(List<Hit> hits, ResourceResolver resourceResolver) {
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
