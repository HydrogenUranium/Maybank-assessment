package com.dhl.discover.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Style;
import com.dhl.discover.core.services.ArticleService;
import com.dhl.discover.core.services.PageUtilService;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.*;
import org.apache.sling.models.annotations.injectorspecific.*;

import javax.annotation.PostConstruct;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Getter
@Slf4j
@Model(adaptables = { Resource.class, SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ArticleShowcase {

    @OSGiService
    @Required
    private PageUtilService pageUtils;

    @ScriptVariable
    @Required
    protected Style currentStyle;

    @OSGiService
    @Required
    private ArticleService articleService;

    @ScriptVariable
    @Required
    private Page currentPage;

    @SlingObject
    @Required
    private ResourceResolver resourceResolver;

    @ValueMapValue
    private String title;

    @ValueMapValue
    private String designMode;

    @ValueMapValue
    private String linkName;

    @ValueMapValue
    private String linkPath;

    @ValueMapValue
    private String showTags;

    @ValueMapValue
    @Default(values = "customPick")
    private String source;

    @ValueMapValue
    private String titleType;

    @ValueMapValue
    private String articlesTitleType;

    @ChildResource
    @Named("articles")
    private Resource articleMultifield;

    private boolean enableAssetDelivery;

    private List<Article> articles = new ArrayList<>();

    @PostConstruct
    private void init() {
        enableAssetDelivery = currentStyle.get("enableAssetDelivery", false);
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
                var article = pageUtils.getArticle(path, resourceResolver);
                if (article != null) {
                    articles.add(article);
                }
            }
        }
    }

    private void initLatestArticles() {
        articles = articleService.getLatestArticles(pageUtils.getHomePage(currentPage), 4);
    }

}
