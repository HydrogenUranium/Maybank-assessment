package com.positive.dhl.core.models;

import lombok.Getter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Getter
@Model(adaptables = Resource.class)
public class ArticleShowcase {

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
    private String source;

    @Inject
    @Optional
    @Named("articles")
    private Resource articleMultifield;

    private final List<Article> articles = new ArrayList<>();

    @PostConstruct
    private void init() {
        if (articleMultifield != null) {
            Iterator<Resource> multifieldItems = articleMultifield.listChildren();
            while (multifieldItems.hasNext()) {
                var properties = multifieldItems.next().getValueMap();
                String path = properties.get("articlePath", "");
                articles.add(new Article(path, resourceResolver));
            }
        }
    }
}
