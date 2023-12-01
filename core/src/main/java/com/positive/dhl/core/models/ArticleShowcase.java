package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.services.ArticleService;
import com.positive.dhl.core.services.PageUtilService;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Getter
@Slf4j
@Model(adaptables = { Resource.class, SlingHttpServletRequest.class })
public class ArticleShowcase {

    @OSGiService
    private PageUtilService pageUtils;

    @OSGiService
    private ArticleService articleService;

    @Inject
    private Page currentPage;

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
    private String showTags;

    @Inject
    @Optional
    @Default(values = "customPick")
    private String source;

    @ChildResource
    @Optional
    @Named("articles")
    private Resource articleMultifield;

    private List<Article> articles = new ArrayList<>();

    @PostConstruct
    private void init() {
        if (source.equals("customPick")) {
            initCustomPick();
        } else if (source.equals("latest")) {
            initLatestArticles();
        }
    }

    private void initCustomPick() {
        if (articleMultifield != null) {
            Iterator<Resource> multifieldItems = articleMultifield.listChildren();
            while (multifieldItems.hasNext()) {
                var properties = multifieldItems.next().getValueMap();
                String path = properties.get("articlePath", "");
                articles.add(pageUtils.getArticle(path, resourceResolver));
            }
        }
    }

    private void initLatestArticles() {
        articles = articleService.getLatestArticles(pageUtils.getHomePage(currentPage), 4);
    }
}
