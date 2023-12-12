package com.positive.dhl.core.models;

import java.util.*;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

import com.positive.dhl.core.services.PageUtilService;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;

import static com.day.cq.wcm.api.constants.NameConstants.*;

@Model(adaptables = Resource.class)
public class CategoryListingItem {

    private PageUtilService pageUtilService = new PageUtilService();

    @Getter
    @Setter
    private String name;

    @Getter
    @Setter
    private List<Article> articles;

    public CategoryListingItem(String path, QueryBuilder builder, ResourceResolver resourceResolver) throws RepositoryException {
        Resource resource = resourceResolver.getResource(path);
        if (resource != null) {
            name = getPageTitle(resource.adaptTo(ValueMap.class));

            articles = new ArrayList<>();
            if (builder != null) {
                SearchResult searchResult = builder
                        .createQuery(PredicateGroup.create(getQueryMap(resource)), resourceResolver.adaptTo(Session.class))
                        .getResult();
                articles = getArticlesFromSearchResult(searchResult, resourceResolver);
            }
        }
    }

    private List<Article> getArticlesFromSearchResult(SearchResult searchResult, ResourceResolver resourceResolver) throws RepositoryException {
        List<Article> articlesFromSearchResult = new ArrayList<>();
        if (searchResult != null) {
            for (Hit hit : searchResult.getHits()) {
                ValueMap hitProperties = hit.getProperties();
                boolean hideInNav = hitProperties.get("hideInNav", false);
                if (articlesFromSearchResult.size() < 5) {
                    var article = pageUtilService.getArticle(hit.getPath(), resourceResolver);
                    if (!hideInNav && article != null) {
                        articlesFromSearchResult.add(article);
                    }
                } else {
                    break;
                }
            }

            Iterator<Resource> resources = searchResult.getResources();
            if (resources.hasNext()) {
                resources.next().getResourceResolver().close();
            }
        }
        return articlesFromSearchResult;
    }

    private String getPageTitle(ValueMap pageProperties) {
        return Optional.ofNullable(pageProperties)
                .map(p -> p.get("jcr:content/navTitle", pageProperties.get("jcr:content/navTitle", StringUtils.EMPTY)))
                .orElse(StringUtils.EMPTY);
    }

    private Map<String, String> getQueryMap(Resource resource) {
        Map<String, String> map = new HashMap<>();
        map.put("type", NT_PAGE);
        map.put("path", resource.getPath());

        map.put("1_group.property", "jcr:content/hideInNav");
        map.put("1_group.operation", "exists");
        map.put("1_group.value", "false");

        map.put("2_group.p.or", "true");

        List<String> articleTypes = Article.getArticlePageTypes();
        for (int x = 0; x < articleTypes.size(); x++) {
            map.put(String.format("2_group.%1$s_property", (x + 1)), "jcr:content/sling:resourceType");
            map.put(String.format("2_group.%1$s_property.value", (x + 1)), String.format("dhl/components/pages/%1$s", articleTypes.get(x)));
            map.put(String.format("2_group.%1$s_property.operation", (x + 1)), "like");
        }

        map.put("orderby", "jcr:content/custompublishdate");
        map.put("orderby.sort", "desc");
        map.put("p.limit", "-1");

        return map;
    }
}