package com.positive.dhl.core.models;

import com.positive.dhl.core.services.PageUtilService;
import lombok.Getter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Model(adaptables= Resource.class)
public class TopTiles {
    @OSGiService
    private PageUtilService pageUtilService;

    @Inject
    private ResourceResolver resourceResolver;

    @Inject
    @Named("articles")
    private Resource articleMultifield;

    @Getter
    private final List<Article> articles = new ArrayList<>();

    @PostConstruct
    protected void init() {
        if (articleMultifield != null) {
            Iterator<Resource> multifieldItems = articleMultifield.listChildren();
            while (multifieldItems.hasNext()) {
                var properties = multifieldItems.next().getValueMap();
                String path = properties.get("articlePath", "");
                Article article = pageUtilService.getArticle(path, resourceResolver);
                if (article != null) {
                    articles.add(article);
                }
            }
        }
    }
}
