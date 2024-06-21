package com.positive.dhl.core.services;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.tagging.Tag;
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
    protected static final int MAX_TERMS_FULL_TEXT_SEARCH = 20;
    public static final String ORDERBY = "orderby";
    public static final String JCR_CONTENT_CQ_TEMPLATE = "jcr:content/cq:template";
    public static final String P_LIMIT = "p.limit";

    @Reference
    protected ResourceResolverHelper resolverHelper;

    @Reference
    protected PageUtilService pageUtilService;

    @Reference
    protected TagUtilService tagUtilService;

    @Reference
    protected QueryBuilder builder;

    public List<Article> getLatestArticles(String parentPath, int limit) {
        List<Article> result;
        try (var resourceResolver = resolverHelper.getReadResourceResolver()) {
            result = Optional.ofNullable(resourceResolver)
                    .map(resolver -> resolver.getResource(parentPath))
                    .map(resource -> resource.adaptTo(Page.class))
                    .map(page -> getLatestArticles(page, limit))
                    .orElse(new ArrayList<>());
        }

        return result;
    }

    private List<Article> getArticles(Map<String, String> customProps) {
        try (var resolver = resolverHelper.getReadResourceResolver()) {
            Map<String, String> props = new HashMap<>();
            props.put("type", NT_PAGE);
            props.put("group.p.or", "true");
            props.put("group.1_property", JCR_CONTENT_CQ_TEMPLATE);
            props.put("group.1_property.value", "/conf/dhl/settings/wcm/templates/article");
            props.put("group.3_property", JCR_CONTENT_CQ_TEMPLATE);
            props.put("group.3_property.value", "/conf/dhl/settings/wcm/templates/animated-page");
            props.putAll(customProps);

            return searchArticles(props, resolver);
        }
    }

    public List<Article> getAllArticles(Page parent) {
        return getArticles(Map.of(
                P_LIMIT, "-1",
                "path", parent.getPath()
        ));
    }

    public List<Article> getLatestArticles(Page parent, int limit) {
        Map<String, String> customPublishProp = Map.of(
                "path", parent.getPath(),
                "1_property", "jcr:content/custompublishdate",
                "1_property.operation", "exists",
                ORDERBY, "@jcr:content/custompublishdate",
                "orderby.sort", "desc",
                P_LIMIT, String.valueOf(limit)
        );


        Map<String, String> createdProp = new HashMap<>(customPublishProp);
        createdProp.put(ORDERBY, "@jcr:content/jcr:created");
        createdProp.put("1_property.operation", "not");

        Map<String, String> lastModifiedProp = new HashMap<>(createdProp);
        createdProp.put(ORDERBY, "@jcr:content/cq:lastModified");

        Map<String, Article> uniqueArticlesMap = new HashMap<>();

        getArticles(customPublishProp).forEach(article -> uniqueArticlesMap.put(article.getPath(), article));
        getArticles(createdProp).forEach(article -> uniqueArticlesMap.put(article.getPath(), article));
        getArticles(lastModifiedProp).forEach(article -> uniqueArticlesMap.put(article.getPath(), article));

        List<Article> articles = new ArrayList<>(uniqueArticlesMap.values());
        articles.sort((o1, o2) -> o2.getCreatedDate().compareTo(o1.getCreatedDate()));
        return articles.subList(0, Math.min(limit, articles.size()));
    }

    public List<Article> findArticles(String searchQuery, String searchScope, ResourceResolver resourceResolver, boolean fulltextSearch) {
        return fulltextSearch
                ? findArticlesByFullText(searchQuery, searchScope, resourceResolver)
                : findArticlesByPageProperties(searchQuery, searchScope, resourceResolver);

    }

    public List<Article> findArticlesByFullText(String searchQuery, String searchScope, ResourceResolver resourceResolver) {
        List<String> terms = getFullTextSearchTerms(searchQuery);
        Map<String, String> map = new HashMap<>();
        map.put("path", searchScope);
        map.put("type", NT_PAGE);

        setFullTextTerms(terms, map);

        setOrderingAndLimiting(map);

        return searchArticles(map, resourceResolver);
    }

    private void setFullTextTerms(List<String> terms, Map<String, String> map) {
        map.put("group.p.or", "true");
        for(var i = 0; i < terms.size(); i++) {
            map.put("group." + (i + 1) + "_fulltext", "\"" + terms.get(i) + "\"");
        }
    }

    public List<Article> findArticlesByPageProperties(String searchTerm, String searchScope, ResourceResolver resourceResolver) {
        String[] propertiesToLook = {"jcr:content/jcr:title", "jcr:content/pageTitle", "jcr:content/navTitle"};
        String[] terms = getTermsByLength(searchTerm);

        Map<String, String> map = new HashMap<>();
        map.put("path", searchScope);
        map.put("type", NT_PAGE);

        map.put("1_group.p.or", "true");
        map.put("1_group." + propertiesToLook.length + "_group.p.or", "true");
        for (var propertiesToLookGroupIndex = 0; propertiesToLookGroupIndex < propertiesToLook.length; propertiesToLookGroupIndex++) {
            setTermGroupPredicates(map, terms, propertiesToLook[propertiesToLookGroupIndex], propertiesToLookGroupIndex);
        }
        var locale = pageUtilService.getLocale(resourceResolver.getResource(searchScope));

        try (var resolver = resolverHelper.getReadResourceResolver()) {
            List<Tag> tags = tagUtilService.getTagsContainingWords(resolver, List.of(terms), "dhl:", locale);

            setTermsGroupTagPredicates(map, tags, propertiesToLook.length);
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

    private Map<String, String> setTermsGroupTagPredicates(Map<String, String> map, List<Tag> tags, int propertiesToLookGroupIndex) {
        var propertyName = "@jcr:content/cq:tags";
        var propertyPredicate = "1_group.%1$s_group.%2$s_property";
        var valuePredicate = propertyPredicate + ".value";

        for (var termIndex = 0; termIndex < tags.size(); termIndex++) {
            String term = tags.get(termIndex).getTagID();
            map.put(String.format(propertyPredicate, (propertiesToLookGroupIndex + 1), (termIndex + 1)), propertyName);
            map.put(String.format(valuePredicate, (propertiesToLookGroupIndex + 1), (termIndex + 1)), term);
        }
        return map;
    }

    /**
     * Generates a list of search terms based on the input phrase.
     * The list includes the full phrase, single words, and combinations
     * of words in the proper order. The number of terms is limited to
     * protect the query from becoming too large.
     *
     * @param searchTerm The input phrase to generate search terms from.
     * @return List of search terms including single words and combinations
     *         to boost text that contains words in proper order.
     * Example:
     * <pre>
     * {@code
     * String searchTerm = "International e-commerce Business Guide";
     * int limit = 10;
     * List<String> combinations = getFullTextSearchTerms(searchTerm, limit);
     *
     * // Output:
     * // [
     * //   "International",
     * //   "e-commerce",
     * //   "Business",
     * //   "Guide",
     * //   "International e-commerce",
     * //   "e-commerce Business",
     * //   "Business Guide",
     * //   "International e-commerce Business",
     * //   "e-commerce Business Guide"
     * //   "International e-commerce Business Guide",
     * // ]
     * }
     * </pre>
     */
    private List<String> getFullTextSearchTerms(String searchTerm) {
        String[] words = searchTerm.trim().split("\\s+");
        List<String> terms = new ArrayList<>();

        for (var len = 1; len <= words.length && terms.size() < MAX_TERMS_FULL_TEXT_SEARCH; len++) {
            for (var start = 0; start <= words.length - len && terms.size() < MAX_TERMS_FULL_TEXT_SEARCH; start++) {
                var combination = new StringBuilder();
                for (int i = start; i < start + len; i++) {
                    if (i > start) {
                        combination.append(" ");
                    }
                    combination.append(words[i]);
                }
                terms.add(combination.toString());
            }
        }

        return terms;
    }

    private String[] getTermsByLength(String searchTerm) {
        List<String> result = new LinkedList<>();
        String[] terms = searchTerm.trim().split("\\s");
        for (var term : terms) {
            if (term.trim().length() >= MIN_SEARCH_TERM_CHARACTERS_ALLOWED && result.size() <= MAX_SEARCH_TERMS_ALLOWED) {
                result.add(term);
            }
        }

        return result.toArray(new String[0]);
    }

    private Map<String, String> setOrderingAndLimiting(Map<String, String> map) {
        map.put(ORDERBY, "@jcr:content/jcr:score");
        map.put("orderby.sort", "desc");
        map.put(P_LIMIT, "50");
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
                if (article != null && article.isValid()) {
                    resources.add(article);
                }
            } catch (RepositoryException exception) {
                log.warn("Failed to get path from sql response", exception);
            }
        });
        return resources;
    }
}
