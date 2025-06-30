package com.dhl.discover.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Style;
import com.dhl.discover.core.services.ArticleService;
import com.dhl.discover.core.services.PageUtilService;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Required;
import org.apache.sling.models.annotations.injectorspecific.*;
import org.apache.sling.models.factory.ModelFactory;

import javax.annotation.PostConstruct;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.List;

@Getter
@Slf4j
@Model(adaptables = { SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ArticleShowcase {

    @OSGiService
    @Required
    @Getter(AccessLevel.NONE)
    private PageUtilService pageUtils;

    @OSGiService
    @Required
    @Getter(AccessLevel.NONE)
    private ModelFactory modelFactory;

    @ScriptVariable
    @Required
    @Getter(AccessLevel.NONE)
    protected Style currentStyle;

    @OSGiService
    @Required
    @Getter(AccessLevel.NONE)
    private ArticleService articleService;

    @ScriptVariable
    @Required
    @Getter(AccessLevel.NONE)
    private Page currentPage;

    @Self
    @Required
    @Getter(AccessLevel.NONE)
    private SlingHttpServletRequest request;

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
    private List<Resource> articleResources;

    private List<Article> articles = new ArrayList<>();

    @PostConstruct
    private void init() {
        if (source.equals("customPick")) {
            initCustomPick();
        } else if (source.equals("latest")) {
            initLatestArticles();
        }
    }

    protected void initCustomPick() {
        if( articleResources == null || articleResources.isEmpty()) {
            return;
        }

        for (Resource articleResource : articleResources) {
            String path = articleResource.getValueMap().get("articlePath", "");
            var article = pageUtils.getArticle(path, request);
            if (article != null) {
                articles.add(article);
            }
        }
    }

    private void initLatestArticles() {
        articles = articleService.getLatestArticles(pageUtils.getHomePage(currentPage), 4);
    }

}
