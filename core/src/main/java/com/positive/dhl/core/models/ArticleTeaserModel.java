package com.positive.dhl.core.models;

import com.day.cq.dam.api.Asset;
import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.services.PageUtilService;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.annotation.PostConstruct;
import java.util.Optional;

import static com.day.cq.dam.api.DamConstants.DC_DESCRIPTION;

@Model(adaptables= Resource.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class ArticleTeaserModel {
    @SlingObject
    private ResourceResolver resourceResolver;

    @OSGiService
    private PageUtilService pageUtilService;

    @ValueMapValue
    private String imageFromPageImage;

    @ValueMapValue
    private String linkURL;

    @ValueMapValue
    private String altValueFromDAM;

    @ValueMapValue
    private String alt;

    @ValueMapValue
    private String titleFromPage;

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
        Article article = new Article(linkURL, resourceResolver);

        imageFromPage = Boolean.parseBoolean(imageFromPageImage) && !StringUtils.isBlank(linkURL);
        if (imageFromPage) {
            imagePathFromPage = Optional.ofNullable(linkURL)
                    .map(link -> pageUtilService.getPage(link, resourceResolver))
                    .map(Page::getProperties)
                    .map(props -> props.get("listimage", StringUtils.EMPTY))
                    .orElse(StringUtils.EMPTY);

            altTextFromPageImage = !Boolean.parseBoolean(altValueFromDAM)
                    ? alt
                    : Optional.of(imagePathFromPage)
                    .map(resourceResolver::getResource)
                    .map(r -> r.adaptTo(Asset.class))
                    .map(a -> a.getMetadataValue(DC_DESCRIPTION))
                    .orElse(StringUtils.EMPTY);
        }

        titleFromLinkedPage = Boolean.parseBoolean(titleFromPage) ? article.getTitle() : StringUtils.EMPTY;
        categoryTag = article.getGroupTag();
        author = article.getAuthor();
        publishDate = article.getCreated();
        friendlyPublishDate = article.getCreatedfriendly();
    }
}
