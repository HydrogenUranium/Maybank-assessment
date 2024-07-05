package com.positive.dhl.core.utils;

import lombok.experimental.UtilityClass;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;

import javax.jcr.query.Query;
import java.util.*;
import java.util.regex.Pattern;

@UtilityClass
public class IndexUtils {

    private static int getVersion(String name) {
        var pattern = Pattern.compile(".*?-(\\d+).*");
        var matcher = pattern.matcher(name);
        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }
        return 0;
    }

    private static int getCustomVersion(String name) {
        var pattern = Pattern.compile(".*-custom-(\\d+).*");
        var matcher = pattern.matcher(name);
        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }
        return 0;
    }

    private static int compareNames(String name1, String name2) {
        int version1 = getVersion(name1);
        int version2 = getVersion(name2);

        if (version1 != version2) {
            return Integer.compare(version2, version1);
        }

        int customVersion1 = getCustomVersion(name1);
        int customVersion2 = getCustomVersion(name2);

        return Integer.compare(customVersion2, customVersion1);
    }

    private static int compareResources(Resource resource1, Resource resource2) {
        return compareNames(resource1.getName(), resource2.getName());
    }

    public static Resource getIndexResourceWithLastVersion(List<Resource> resources) {
        return resources.stream().min(IndexUtils::compareResources).orElse(null);
    }

    public static Resource getIndexResourceWithLastVersion(Iterator<Resource> resourceIterator) {
        return getIndexResourceWithLastVersion(iteratorToList(resourceIterator));
    }

    private <T> List<T> iteratorToList(Iterator<T> iterator) {
        List<T> list = new ArrayList<>();
        iterator.forEachRemaining(list::add);

        return list;
    }

    public static boolean isPathIncluded(Resource index, String path) {
        return Optional.ofNullable(index)
                .map(Resource::getValueMap)
                .map(valueMap -> valueMap.get("includedPaths", String[].class))
                .map(Arrays::asList)
                .map(includedPaths -> includedPaths.contains(path))
                .orElse(false);
    }

    public static boolean hasFullTextIndex(String searchScope, ResourceResolver resolver) {
        var queryString = "SELECT * FROM [oak:QueryIndexDefinition]\n" +
                "WHERE ISDESCENDANTNODE('/oak:index')\n" +
                "AND [dhlFullTextSearch] = true\n";
        var resourceIterator = resolver.findResources(queryString, Query.JCR_SQL2);

        var index = IndexUtils.getIndexResourceWithLastVersion(resourceIterator);

        return IndexUtils.isPathIncluded(index, searchScope);
    }

    public static String getSuggestionIndexName(String homePath, ResourceResolver resolver) {
        var queryString = "SELECT * FROM [oak:QueryIndexDefinition]\n" +
                "WHERE ISDESCENDANTNODE('/oak:index')\n" +
                "AND [dhlSuggestions] = true\n";
        var resourceIterator = resolver.findResources(queryString, Query.JCR_SQL2);

        var index = IndexUtils.getIndexResourceWithLastVersion(resourceIterator);

        return index != null && IndexUtils.isPathIncluded(index, homePath) ? index.getName() : null;
    }
}
