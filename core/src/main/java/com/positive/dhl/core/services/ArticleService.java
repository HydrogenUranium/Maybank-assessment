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

import static com.day.cq.wcm.api.constants.NameConstants.NT_PAGE;

@Component(service = ArticleService.class)
@Slf4j
public class ArticleService {
    protected static final int MAX_SEARCH_TERMS_ALLOWED = 5;
    protected static final int MIN_SEARCH_TERM_CHARACTERS_ALLOWED = 3;
    public static final String ORDERBY = "orderby";
    public static final String JCR_CONTENT_CQ_TEMPLATE = "jcr:content/cq:template";

    @Reference
    protected ResourceResolverHelper resolverHelper;

    @Reference
    protected PageUtilService pageUtilService;

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
        try (var resolver = resolverHelper.getReadResourceResolver()) {
            Map<String, String> customPublishProp = new HashMap<>();
            customPublishProp.put("type", NT_PAGE);
            customPublishProp.put("path", parent.getPath());
            customPublishProp.put("group.p.or", "true");
            customPublishProp.put("group.1_property", JCR_CONTENT_CQ_TEMPLATE);
            customPublishProp.put("group.1_property.value", "/conf/dhl/settings/wcm/templates/article");
            customPublishProp.put("group.2_property", JCR_CONTENT_CQ_TEMPLATE);
            customPublishProp.put("group.2_property.operation", "like");
            customPublishProp.put("group.2_property.value", "/apps/dhl/templates/dhl-animated-%");
            customPublishProp.put("group.3_property", JCR_CONTENT_CQ_TEMPLATE);
            customPublishProp.put("group.3_property.value", "/conf/dhl/settings/wcm/templates/animated-page");
            customPublishProp.put("3_property", "jcr:content/custompublishdate");
            customPublishProp.put("3_property.operation", "exists");
            customPublishProp.put(ORDERBY, "@jcr:content/custompublishdate");
            customPublishProp.put("orderby.sort", "desc");
            customPublishProp.put("p.limit", String.valueOf(limit));

            Map<String, String> createdProp = new HashMap<>(customPublishProp);
            createdProp.put(ORDERBY, "@jcr:content/jcr:created");
            createdProp.put("3_property.operation", "not");

            Map<String, String> lastModifiedProp = new HashMap<>(createdProp);
            createdProp.put(ORDERBY, "@jcr:content/cq:lastModified");

            Map<String, Article> articleMap = new HashMap<>();

            searchArticles(customPublishProp, resolver).forEach(article -> articleMap.put(article.getPath(), article));
            searchArticles(createdProp, resolver).forEach(article -> articleMap.put(article.getPath(), article));
            searchArticles(lastModifiedProp, resolver).forEach(article -> articleMap.put(article.getPath(), article));

            List<Article> articles = new ArrayList<>(articleMap.values());
            articles.sort((o1, o2) -> o2.getCreatedDate().compareTo(o1.getCreatedDate()));
            return articles.subList(0, Math.min(limit, articles.size()));
        }
    }

    public List<Article> getArticlesByTitle(String searchTerm, String searchScope, ResourceResolver resourceResolver) {
        String[] propertiesToLook = { "jcr:content/jcr:title", "jcr:content/pageTitle", "jcr:content/navTitle", "jcr:content/cq:tags" };
        String[] terms = getTerms(searchTerm);

        Map<String, String> map = new HashMap<>();
        map.put("path", searchScope);
        map.put("type", NT_PAGE);

        map.put("1_group.p.or", "true");
        for (var propertiesToLookGroupIndex = 0; propertiesToLookGroupIndex < propertiesToLook.length; propertiesToLookGroupIndex++) {
            setTermGroupPredicates(map, terms, propertiesToLook[propertiesToLookGroupIndex], propertiesToLookGroupIndex);
        }

        setOrderingAndLimiting(map);

        var mapStr = new StringBuilder();
        for (Map.Entry<String, String> predicate : map.entrySet()) {
            mapStr.append(predicate.getKey()).append("=").append(predicate.getValue()).append("|");
        }
        log.debug("QueryBuilder map: {}", mapStr);

        return searchArticles(map, resourceResolver);
    }

    private Map<String, String> setTermGroupPredicates(Map<String, String> map, String[] terms, String propertyToLook, int propertiesToLookGroupIndex) {
        var termGroupPredicatesTemplate = "1_group.%1$s_group.%2$s_group.1_containsIgnoreCase";
        String propertyPredicate = termGroupPredicatesTemplate + ".property";
        String valuePredicate = termGroupPredicatesTemplate + ".value";

        for (var termIndex = 0; termIndex < terms.length; termIndex++) {
            String term = terms[termIndex];
            map.put(String.format(propertyPredicate, (propertiesToLookGroupIndex + 1), (termIndex + 1)), propertyToLook);
            map.put(String.format(valuePredicate, (propertiesToLookGroupIndex + 1), (termIndex + 1)), term);
        }
        return map;
    }

    private String[] getTerms(String searchTerm) {
        List<String> result = new LinkedList<>();
        String[] terms = searchTerm.trim().split("\\s");
        for (var term: terms) {
            if (term.trim().length() >= MIN_SEARCH_TERM_CHARACTERS_ALLOWED && result.size() <= MAX_SEARCH_TERMS_ALLOWED) {
                result.add(term);
            }
        }
        return result.toArray(new String[0]);
    }

    private Map<String, String> setOrderingAndLimiting(Map<String, String> map) {
        map.put(ORDERBY, "@jcr:content/jcr:score");
        map.put("orderby.sort", "desc");
        map.put("p.limit", "50");
        map.put("p.guessTotal", "true");
        return map;
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
                var article = pageUtilService.getArticle(hit.getPath(), resourceResolver);
                if (article != null &&  article.isValid()) {
                    resources.add(article);
                }
            } catch (RepositoryException exception) {
                log.warn("Failed to get path from sql response", exception);
            }
        });
        return resources;
    }
}
