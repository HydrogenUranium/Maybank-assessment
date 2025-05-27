package com.dhl.discover.core.utils;

import lombok.experimental.UtilityClass;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;

import javax.jcr.query.Query;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Arrays;
import java.util.Optional;
import java.util.regex.Pattern;

@UtilityClass
public class IndexUtils {

    private static final Pattern PATTERN = Pattern.compile("^([a-zA-Z.]+)(?:-(\\d+))?(?:-custom-(\\d+))?$");
    private static final int NAME_GROUP = 1;
    private static final int VERSION_GROUP = 2;
    private static final int CUSTOM_VERSION_GROUP = 3;

    private static String getPatternGroup(String name, int group, String absentValue) {
        var matcher = PATTERN.matcher(name);
        if (matcher.find() && matcher.group(group) != null) {
            return matcher.group(group);
        }
        return absentValue;
    }

    private static int getPatternGroup(String name, int group) {
        String groupValue = getPatternGroup(name, group, "0");
        return Integer.parseInt(groupValue);
    }


    private static int getVersion(String name) {
        return getPatternGroup(name, VERSION_GROUP);
    }

    private static int getCustomVersion(String name) {
        return getPatternGroup(name, CUSTOM_VERSION_GROUP);
    }

    private static String getBaseName(String name) {
        return getPatternGroup(name, NAME_GROUP, "");
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
        var queryString = """
        SELECT * FROM [oak:QueryIndexDefinition]
        WHERE ISDESCENDANTNODE('/oak:index')
        AND [dhlFullTextSearch] = true
        """;
        var resourceIterator = resolver.findResources(queryString, Query.JCR_SQL2);
        var indexesAndVersions = splitByIndexName(resourceIterator);
        List<Resource> indexes = new ArrayList<>();
        indexesAndVersions.forEach((s, resources) -> {
            var index = getIndexResourceWithLastVersion(resources);
            if(isPathIncluded(index, searchScope)) {
                indexes.add(index);
            }
        });

        return !indexes.isEmpty();
    }

    public static Map<String, List<Resource>> splitByIndexName(Iterator<Resource> resourceIterator){
        var map = new HashMap<String, List<Resource>>();

        resourceIterator.forEachRemaining(resource -> {
            String name = getBaseName(resource.getName());
            map.computeIfAbsent(name, k -> new ArrayList<>()).add(resource);
        });

        return map;
    }

    public static String getSuggestionIndexName(String homePath, ResourceResolver resolver) {
        var queryString = "SELECT * FROM [oak:QueryIndexDefinition]\n" +
                "WHERE ISDESCENDANTNODE('/oak:index')\n" +
                "AND [dhlSuggestions] = true\n";
        var resourceIterator = resolver.findResources(queryString, Query.JCR_SQL2);
        var indexesAndVersions = splitByIndexName(resourceIterator);
        List<Resource> indexes = new ArrayList<>();
        indexesAndVersions.forEach((s, resources) -> {
            var index = getIndexResourceWithLastVersion(resources);
            if(isPathIncluded(index, homePath)) {
                indexes.add(index);
            }
        });

        return indexes.isEmpty() ? null : indexes.get(0).getName();
    }
}
