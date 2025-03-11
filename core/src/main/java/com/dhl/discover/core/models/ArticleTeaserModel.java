package com.dhl.discover.core.models;

import com.day.cq.dam.api.Asset;
import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.services.AssetUtilService;
import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.core.services.PathUtilService;
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
import java.util.Optional;

import static com.day.cq.commons.jcr.JcrConstants.JCR_TITLE;
import static com.day.cq.dam.api.DamConstants.DC_DESCRIPTION;

@Model(adaptables= Resource.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class ArticleTeaserModel {
    @SlingObject
    private ResourceResolver resourceResolver;

    @OSGiService
    protected AssetUtilService assetUtilService;

    @OSGiService
    private PageUtilService pageUtilService;

    @OSGiService
    private PathUtilService pathUtilService;

    @ValueMapValue
    private String imageFromPageImage;

    @ValueMapValue
    @Getter
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
    private boolean imageFromPage;

    @Getter
    private String imagePathFromPage;

    @Getter
    private String altTextFromPageImage;

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
            imageFromPage = Boolean.parseBoolean(imageFromPageImage) && !StringUtils.isBlank(linkURL);
            titleFromLinkedPage = Boolean.parseBoolean(titleFromPage) ? article.getNavTitle() : StringUtils.EMPTY;
            if (imageFromPage) {
                imagePathFromPage = Optional.ofNullable(linkURL)
                        .map(link -> pageUtilService.getPage(link, resourceResolver))
                        .map(Page::getContentResource)
                        .map(res -> assetUtilService.getPageImagePath(res))
                        .orElse(StringUtils.EMPTY);

                altTextFromPageImage = !Boolean.parseBoolean(altValueFromPageImage)
                        ? alt
                        : Optional.of(imagePathFromPage)
                        .map(resourceResolver::getResource)
                        .map(r -> r.adaptTo(Asset.class))
                        .map(a -> a.getMetadataValue(DC_DESCRIPTION))
                        .orElse(StringUtils.defaultIfBlank(titleFromLinkedPage, title));
            }

            categoryTag = article.getGroupTag();
            author = article.getAuthor();
            publishDate = article.getCreated();
            friendlyPublishDate = article.getCreatedfriendly();
        }
    }
}
