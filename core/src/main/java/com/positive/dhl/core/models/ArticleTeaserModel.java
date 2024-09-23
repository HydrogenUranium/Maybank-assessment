package com.positive.dhl.core.models;

import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.PathUtilService;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.annotation.PostConstruct;
import javax.inject.Named;

import static com.day.cq.commons.jcr.JcrConstants.JCR_TITLE;

@Model(adaptables= Resource.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class ArticleTeaserModel {
    @SlingObject
    private ResourceResolver resourceResolver;

    @OSGiService
    private PageUtilService pageUtilService;

    @OSGiService
    private PathUtilService pathUtilService;

    @ValueMapValue
    private String imageFromPageImage;

    @ValueMapValue
    private String linkURL;

    @ValueMapValue
    @Default(values = "true")
    private String altValueFromPageImage;

    @ValueMapValue
    private String alt;

    @ValueMapValue
    private String titleFromPage;

    @ValueMapValue
    @Named(JCR_TITLE)
    private String title;

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
        var article = pageUtilService.getArticle(linkURL, resourceResolver);

        if (article != null) {
            titleFromLinkedPage = Boolean.parseBoolean(titleFromPage) ? article.getNavTitle() : StringUtils.EMPTY;
            categoryTag = article.getGroupTag();
            author = article.getAuthor();
            publishDate = article.getCreated();
            friendlyPublishDate = article.getCreatedfriendly();
        }
    }
}
