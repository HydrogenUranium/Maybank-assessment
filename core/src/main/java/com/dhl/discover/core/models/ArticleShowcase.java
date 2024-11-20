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
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
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
    private PageUtilService pageUtils;

    @ScriptVariable
    protected Style currentStyle;

    @OSGiService
    private ArticleService articleService;

    @ScriptVariable
    private Page currentPage;

    @SlingObject
    private ResourceResolver resourceResolver;

    @ValueMapValue
    @Optional
    private String title;

    @ValueMapValue
    @Optional
    private String designMode;

    @ValueMapValue
    @Optional
    private String linkName;

    @ValueMapValue
    @Optional
    private String linkPath;

    @ValueMapValue
    @Optional
    private String showTags;

    @ValueMapValue
    @Optional
    @Default(values = "customPick")
    private String source;

    @ChildResource
    @Optional
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
