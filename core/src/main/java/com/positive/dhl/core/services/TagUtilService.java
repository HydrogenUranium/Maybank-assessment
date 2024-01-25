package com.positive.dhl.core.services;

import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.util.*;
import java.util.stream.Collectors;

import static com.day.cq.commons.jcr.JcrConstants.JCR_CONTENT;

@Component(service = TagUtilService.class)
public class TagUtilService {

    public static final String EXTERNAL_TAGS_NAMESPACE = "dhl-article-external";
    public static final String TRENDING_TOPICS_TAGS_NAMESPACE = "dhlsuggested:";
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
                .collect(Collectors.toList());
    }

    /**
     * Returns the {@link List} External Tags of the Article.
     * These external tags are used to display in the Article Tiles in the Article Grid component
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
                .map(tag -> {
                    String tagLocalizedTitle = tag.getLocalizedTitle(pageUtilService.getLocale(pageResource));
                    return tagLocalizedTitle == null ? tag.getTitle() : tagLocalizedTitle;
                })
                .map(this::transformToHashtag)
                .collect(Collectors.toList());
    }

    public List<String> getDefaultTrendingTopicsList(Resource pageResource) {
        TagManager tagManager = pageResource.getResourceResolver().adaptTo(TagManager.class);

        List<String> trendingTopicsList = new ArrayList<>();
        if (tagManager != null) {
            var trendingTopicsTagsNamespace = tagManager.resolve(TRENDING_TOPICS_TAGS_NAMESPACE);
            if (null != trendingTopicsTagsNamespace) {
                Iterator<Tag> trendingTopicsTags = trendingTopicsTagsNamespace.listChildren();
                var locale = pageUtilService.getLocale(pageResource);
                while (trendingTopicsTags.hasNext()) {
                    var tag = trendingTopicsTags.next();
                    String tagLocalizedTitle = tag.getLocalizedTitle(locale);
                    trendingTopicsList.add(tagLocalizedTitle == null ? tag.getTitle() : tagLocalizedTitle);
                }
                trendingTopicsList.sort(String::compareTo);
            }
        }

        return trendingTopicsList;
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

        return !StringUtils.isBlank(tag) ? "#" + tag : StringUtils.EMPTY;
    }
}
