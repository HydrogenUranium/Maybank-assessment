package com.dhl.discover.core.models;

import com.day.cq.wcm.api.components.Component;
import com.dhl.discover.core.services.ArticleUtilService;
import com.dhl.discover.core.services.AssetUtilService;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceWrapper;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.annotation.PostConstruct;

@Model(adaptables= SlingHttpServletRequest.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class ArticleTeaserModel {
    @SlingObject
    private ResourceResolver resourceResolver;

    @OSGiService
    protected AssetUtilService assetUtilService;

    @OSGiService
    private ArticleUtilService articleUtilService;

    @ScriptVariable
    private Component component;

    @Self
    private SlingHttpServletRequest request;

    @Getter
    private Resource imageResource;

    @ValueMapValue
    @Getter
    private String linkURL;

    @ValueMapValue
    private String titleFromPage;

    @Getter
    private String categoryTag;

    @Getter
    private String author;

    @Getter
    private String publishDate;

    @Getter
    private String friendlyPublishDate;

    @Getter
    private String titleFromLinkedPage;

    @PostConstruct
    protected void init() {
        var article = articleUtilService.getArticle(linkURL, resourceResolver);

        if (article != null) {
            titleFromLinkedPage = Boolean.parseBoolean(titleFromPage) ? article.getNavTitle() : StringUtils.EMPTY;

            categoryTag = article.getGroupTag();
            author = article.getAuthor();
            publishDate = article.getCreated();
            friendlyPublishDate = article.getCreatedfriendly();
        }

        imageResource = new ResourceWrapper(request.getResource()) {
            @Override
            public String getResourceType() {
                return component.getProperties().get("imageDelegate", String.class);
            }
        };
    }
}
