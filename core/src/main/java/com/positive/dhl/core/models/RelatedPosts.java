package com.positive.dhl.core.models;

import com.positive.dhl.core.injectors.InjectHomeProperty;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Model(adaptables = { Resource.class, SlingHttpServletRequest.class }, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class RelatedPosts {

    @InjectHomeProperty
    @Named("relatedPosts-title")
    private String homePropertyTitle;

    @Inject
    private ResourceResolver resourceResolver;

    @Inject
    @Getter
    private String title;

    @Inject
    @Default(values = "customPick")
    private String source;

    @ChildResource
    @Named("articles")
    private Resource articleMultifield;

    @Getter
    private final List<Article> articles = new ArrayList<>();

    @PostConstruct
    private void init() {
        title = StringUtils.defaultIfBlank(title, homePropertyTitle);
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
