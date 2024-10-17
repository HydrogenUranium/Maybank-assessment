package com.positive.dhl.core.services;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.tagging.Tag;
import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.helpers.FullTextSearchHelper;
import com.positive.dhl.core.models.Article;
import com.positive.dhl.core.models.search.SearchResultEntry;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.*;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import static com.day.cq.wcm.api.constants.NameConstants.NT_PAGE;

@Component(service = ArticleService.class)
@Slf4j
public class ArticleService {
    protected static final int MAX_SEARCH_TERMS_ALLOWED = 5;
    protected static final int MIN_SEARCH_TERM_CHARACTERS_ALLOWED = 3;

    protected static final int MAX_RESULTS = 50;

    public static final String ORDERBY = "orderby";
    public static final String JCR_CONTENT_CQ_TEMPLATE = "jcr:content/cq:template";
    public static final String P_LIMIT = "p.limit";

    public static final String GROUP_ONE_PROPERTY = "group.1_property";

    public static final String GROUP_ONE_PROPERTY_VALUE = "group.1_property.value";

    public static final String GROUP_THREE_PROPERTY = "group.3_property";

    public static final String GROUP_THREE_PROPERTY_VALUE = "group.3_property.value";

    public static final String ONE_GROUP_ONE_GROUP = "1_group.1_group.";
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

    private List<Article> getArticlesFromSearchResultEntries(List<SearchResultEntry> searchResultEntries) {
        return searchResultEntries.stream().map(SearchResultEntry::getArticle)
                .collect(Collectors.toList());
    }

    private List<Article> getArticles(Map<String, String> customProps) {
        try (var resolver = resolverHelper.getReadResourceResolver()) {
            Map<String, String> props = new HashMap<>();
            props.put("type", NT_PAGE);
            props.put("p.excerpt", "true");
            props.put("group.p.or", "true");
            props.put(GROUP_ONE_PROPERTY, JCR_CONTENT_CQ_TEMPLATE);
            props.put(GROUP_ONE_PROPERTY_VALUE, "/conf/dhl/settings/wcm/templates/article");
            props.put(GROUP_THREE_PROPERTY, JCR_CONTENT_CQ_TEMPLATE);
            props.put(GROUP_THREE_PROPERTY_VALUE, "/conf/dhl/settings/wcm/templates/animated-page");
            props.putAll(customProps);

            return getArticlesFromSearchResultEntries(searchArticles(props, resolver));
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

        Consumer<Article> addUniqueArticle = article -> uniqueArticlesMap.put(article.getPath(), article);
        getArticles(customPublishProp).forEach(addUniqueArticle);
        getArticles(createdProp).forEach(addUniqueArticle);
        getArticles(lastModifiedProp).forEach(addUniqueArticle);

        List<Article> articles = new ArrayList<>(uniqueArticlesMap.values());
        articles.sort((o1, o2) -> o2.getCreatedDate().compareTo(o1.getCreatedDate()));
        return articles.subList(0, Math.min(limit, articles.size()));
    }

    public List<SearchResultEntry> findArticles(String searchQuery, String searchScope, ResourceResolver resourceResolver, boolean fulltextSearch) {
        return fulltextSearch
                ? findArticlesByFullText(searchQuery, searchScope, resourceResolver)
                : findArticlesByPageProperties(searchQuery, searchScope, resourceResolver);

    }

    public List<SearchResultEntry> findArticlesByFullText(String searchQuery, String searchScope, ResourceResolver resourceResolver) {
        List<List<String>> termGroups = FullTextSearchHelper.getFullTextSpellcheckedSearchTerms(searchQuery, searchScope, resourceResolver);
        var locale = pageUtilService.getLocale(searchScope, resourceResolver);
        Map<String, Tag> tagMap = tagUtilService.getLocalizedTagMap(resourceResolver, "dhl:", locale);

        Set<String> uniquePaths = new HashSet<>();
        List<SearchResultEntry> uniqueSearchResultEntries = new ArrayList<>();

        for (List<String> terms : termGroups) {
            if (uniqueSearchResultEntries.size() >= MAX_RESULTS) {
                break;
            }

            List<SearchResultEntry> entries = findArticlesByFullText(terms, searchScope, tagMap, resourceResolver);
            for (SearchResultEntry entry : entries) {
                if (uniqueSearchResultEntries.size() < MAX_RESULTS && uniquePaths.add(entry.getArticle().getPath())) {
                    uniqueSearchResultEntries.add(entry);
                }
            }
        }

        return uniqueSearchResultEntries;
    }

    public List<SearchResultEntry> findArticlesByFullText(List<String> terms, String searchScope, Map<String, Tag> tagMap, ResourceResolver resourceResolver) {
        Map<String, String> map = new HashMap<>();
        map.put("path", searchScope);
        map.put("type", NT_PAGE);
        map.put("explain", "true");

        setFullTextTerms(terms, tagMap, map);

        setOrderingAndLimiting(map);

        return searchArticles(map, resourceResolver);
    }

    private void setFullTextTerms(List<String> terms, Map<String, Tag> tagMap, Map<String, String> searchParams) {
        List<String> tagIds = extractSearchedTagIds(terms, tagMap);
        addFullTextTermsToParams(terms, searchParams);
        addTagSearchToParams(tagIds, terms.size(), searchParams);
    }

    private List<String> extractSearchedTagIds(List<String> terms, Map<String, Tag> tagMap) {
        List<String> tagIds = new ArrayList<>();
        for (String tagName : terms) {
            if (tagMap.containsKey(tagName)) {
                tagIds.add(tagMap.get(tagName).getTagID());
            }
        }
        return tagIds;
    }

    private void addFullTextTermsToParams(List<String> terms, Map<String, String> searchParams) {
        searchParams.put("1_group.1_group.p.or", "true");
        for (var i = 0; i < terms.size(); i++) {
            String term = terms.get(i);
            String wrappedTerm = term.contains(" ") ? StringUtils.wrap(term, "\"") : term;
            searchParams.put(ONE_GROUP_ONE_GROUP + (i + 1) + "_fulltext", wrappedTerm);
        }
    }

    private void addTagSearchToParams(List<String> tagIds, int termCount, Map<String, String> searchParams) {
        if (tagIds.isEmpty()) {
            return;
        }
        int tagIndex = termCount + 1;
        searchParams.put(ONE_GROUP_ONE_GROUP + tagIndex + "_property", "@jcr:content/cq:tags");
        for (var i = 0; i < tagIds.size(); i++) {
            searchParams.put(ONE_GROUP_ONE_GROUP + tagIndex + "_property." + (i + 1) + "_value", tagIds.get(i));
        }
    }

    public List<SearchResultEntry> findArticlesByPageProperties(String searchTerm, String searchScope, ResourceResolver resourceResolver) {
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
        map.put(P_LIMIT, "" + MAX_RESULTS);
        map.put("p.guessTotal", "true");

        /*DIS-792 - No-Index jcr filter placed*/
        map.put("1_group.p.and", "true");
        map.put("1_group.2_group.p.not", "true");

        map.put("1_group.2_group.property", "jcr:content/cq:robotsTags");
        map.put("1_group.2_group.property.operation", "like");
        map.put("1_group.2_group.property.value", "noindex");
        return map;
    }

    private List<SearchResultEntry> searchArticles(Map<String, String> props, ResourceResolver resolver) {
        Session session = resolver.adaptTo(Session.class);
        return java.util.Optional.ofNullable(builder)
                .map(queryBuilder -> queryBuilder.createQuery(PredicateGroup.create(props), session))
                .map(Query::getResult)
                .map(SearchResult::getHits)
                .map(hits -> getSearchResultEntriesFromHits(hits, resolver))
                .orElse(new ArrayList<>());
    }

    private List<SearchResultEntry> getSearchResultEntriesFromHits(List<Hit> hits, ResourceResolver resourceResolver) {
        List<SearchResultEntry> resources = new ArrayList<>();
        hits.forEach(hit -> {
            try {
                var article = pageUtilService.getArticle(hit.getPath(), resourceResolver);
                var excerpt = "... " + hit.getExcerpt();
                if (article != null && article.isValid()) {
                    resources.add(new SearchResultEntry(article, excerpt));
                }
            } catch (RepositoryException exception) {
                log.warn("Failed to get path from sql response", exception);
            }
        });
        return resources;
    }
}
