package com.dhl.discover.core.services;

import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.io.Serializable;
import java.util.List;
import java.util.Iterator;
import java.util.Optional;
import java.util.TreeMap;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.Locale;
import java.util.Map;
import java.util.SortedMap;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.day.cq.commons.jcr.JcrConstants.JCR_CONTENT;

@Component(service = TagUtilService.class)
@Slf4j

public class TagUtilService implements Serializable {
    public static final String DEFAULT_TAG_TITLE_LANGUAGE = "en";

    public static final String EXTERNAL_TAGS_NAMESPACE = "dhl-article-external";
    public static final String TRENDING_TOPICS_FIELD = "trendingTopics";
    public static final String AUTHOR_HIGHLIGHTS_TAGS_NAMESPACE = "dhl-author-highlights";

    @Reference
    private PageUtilService pageUtilService;

    public Tag[] getTags(Resource pageResource) {
        return Optional.ofNullable(pageResource)
                .map(Resource::getResourceResolver)
                .map(rr -> rr.adaptTo(TagManager.class))
                .map(tm -> tm.getTags(pageResource.getChild(JCR_CONTENT)))
                .orElse(new Tag[0]);
    }

    public List<String> getHighlightsTags(Resource pageResource) {
        Tag[] tags = getTags(pageResource);

        return Arrays.stream(tags)
                .filter(tag -> {
                    String namespace = tag.getNamespace().getName();
                    return AUTHOR_HIGHLIGHTS_TAGS_NAMESPACE.equals(namespace);
                })
                .map(Tag::getName)
                .toList();
    }

    /**
     * Returns the {@link List} External Tags of the Article.
     * These external tags are used to display in the Article Tiles in the Article Grid component
     *
     * @param pageResource is a {@link Resource} object of the Article page
     * @return a {@code List} representing the External Tags of the Article page
     * or {@code List.EMPTY} if the pageResource is {@code null} or Article doesn't contain External Tags
     */
    public List<String> getExternalTags(Resource pageResource) {
        Tag[] tags = getTags(pageResource);

        return Arrays.stream(tags)
                .filter(tag -> {
                    String namespace = tag.getNamespace().getName();
                    return EXTERNAL_TAGS_NAMESPACE.equals(namespace);
                })
                .map(tag -> tag.getTitle(pageUtilService.getLocale(pageResource)))
                .map(this::transformToHashtag)
                .toList();
    }

    public List<String> getTrendingTopics(Resource pageResource) {
        TagManager tagManager = pageResource.getResourceResolver().adaptTo(TagManager.class);
        var homePage = pageUtilService.getHomePage(pageResource);
        var locale = pageUtilService.getLocale(pageResource);

        if (tagManager == null || homePage == null) {
            return new ArrayList<>();
        }

        return Stream.of(homePage.getProperties().get(TRENDING_TOPICS_FIELD, new String[]{}))
                .map(tagManager::resolve)
                .map(tag -> getLocalizedTitle(tag, locale))
                .filter(title -> !title.isBlank())
                .toList();
    }

    public String transformToHashtag(String tagTitle) {
        Map<String, String> customTransformation = Map.of(
                "e-commerce", "eCommerce",
                "b2b", "b2b"
        );

        String tag = !StringUtils.isBlank(tagTitle)
                ? Arrays.stream(StringUtils.lowerCase(tagTitle).split(" "))
                .map(s -> customTransformation.getOrDefault(s, StringUtils.capitalize(s)))
                .collect(Collectors.joining())
                : StringUtils.EMPTY;

        return (!StringUtils.isBlank(tag)) ? ("#" + tag) : StringUtils.EMPTY;
    }

    private Tag getTag(ResourceResolver resolver, String rootTagID) {
        return Optional.ofNullable(resolver.adaptTo(TagManager.class))
                .map(tagManager -> tagManager.resolve(rootTagID)).orElse(null);
    }

    public List<Tag> getTagsContainingWords(ResourceResolver resolver, List<String> words, String rootTagID, Locale locale) {
        if (words.isEmpty()) {
            return new ArrayList<>();
        }

        var rootTag = getTag(resolver, rootTagID);

        Predicate<String> predicate = title -> words.stream()
                .allMatch(word -> title.contains(word.toLowerCase()));

        return searchTagsByLocalizedTitlePredicate(predicate, rootTag, locale);
    }

    private static List<String> splitIntoWords(String string) {
        return List.of(string.trim().toLowerCase().split("\\s+"));
    }

    private List<String> getTagNamesByPrefix(SortedMap<String, Tag> tagMap, String prefix) {
        return tagMap.subMap(prefix + Character.MIN_VALUE, prefix + Character.MAX_VALUE)
                .keySet().stream().sorted().toList();
    }

    public List<String> getTagLocalizedSuggestionsByQuery(ResourceResolver resolver, String query, String rootTagID, Locale locale, int limit) {
        List<String> suggestions = new ArrayList<>();
        List<String> words = splitIntoWords(query);

        if (words.isEmpty()) {
            return suggestions;
        }

        SortedMap<String, Tag> tagMap = getLocalizedTagMap(resolver, rootTagID, locale);
        for (var i = 0; i < words.size() && suggestions.size() < limit; i++) {
            var basePhrase = String.join(" ", words.subList(0, i));
            var tagSearchQuery = String.join(" ", words.subList(i, words.size()));

            List<String> tagNames = getTagNamesByPrefix(tagMap, tagSearchQuery);

            tagNames.forEach(tagName -> {
                if (suggestions.size() < limit) {
                    suggestions.add(basePhrase.isBlank() ? tagName : (basePhrase + " " + tagName));
                }
            });
        }

        return suggestions;
    }

    public SortedMap<String, Tag> getLocalizedTagMap(ResourceResolver resolver, String rootTagId, Locale locale) {
        TreeMap<String, Tag> map = new TreeMap<>();

        var tags = searchTagsByLocalizedTitlePredicate(null, getTag(resolver, rootTagId), locale);

        tags.forEach(tag -> map.put(getLocalizedTitle(tag, locale).trim().toLowerCase(), tag));

        return map;
    }

    private List<Tag> searchTagsByLocalizedTitlePredicate(Predicate<String> predicate, Tag root, Locale locale) {
        List<Tag> tagList = new ArrayList<>();
        if (root == null) {
            log.error("Root tag for tag search is not found");
            return tagList;
        }
        collectTags(predicate, root, locale, tagList);
        return tagList;
    }

    private void collectTags(Predicate<String> predicate, Tag parent, Locale locale, List<Tag> tagList) {
        Iterator<Tag> tags = parent.listChildren();

        while (tags.hasNext()) {
            var tag = tags.next();

            if (predicate == null || predicate.test(getLocalizedTitle(tag, locale).toLowerCase().trim())) {
                tagList.add(tag);
            }

            collectTags(predicate, tag, locale, tagList);
        }
    }

    private String getLocalizedTitle(Tag tag, Locale locale) {
        if(tag == null) {
            return StringUtils.EMPTY;
        }
        boolean useDefaultIfNull = locale.getLanguage().equals(DEFAULT_TAG_TITLE_LANGUAGE);
        String titleForUndefinedLocale = useDefaultIfNull ? tag.getTitle() : "";

        return Optional.ofNullable(tag.getLocalizedTitle(locale)).orElse(titleForUndefinedLocale);
    }
}
