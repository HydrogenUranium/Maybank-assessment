package com.dhl.discover.core.models;

import com.adobe.cq.wcm.core.components.models.Image;
import com.adobe.cq.wcm.spi.AssetDelivery;
import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.constants.DiscoverConstants;
import com.dhl.discover.core.injectors.InjectChildImageModel;
import com.dhl.discover.core.services.AssetUtilService;
import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.core.services.PathUtilService;
import com.dhl.discover.core.services.TagUtilService;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;

import javax.annotation.PostConstruct;
import javax.inject.Named;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

import static com.day.cq.wcm.api.constants.NameConstants.PN_CREATED;
import static com.day.cq.wcm.api.constants.NameConstants.PN_NAV_TITLE;
import static com.day.cq.wcm.api.constants.NameConstants.PN_PAGE_LAST_MOD;
import static com.day.cq.wcm.api.constants.NameConstants.PN_TITLE;
import static com.day.cq.wcm.foundation.List.URL_EXTENSION;
import static com.dhl.discover.core.services.PageUtilService.CATEGORY_PAGE_LEVEL;

/**
 * It's a sling model of the 'article' piece of content
 */
@Getter
@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class Article {

    @SlingObject
    private Resource resource;

    @OSGiService
    private PageUtilService pageUtilService;

    @OSGiService
    private PathUtilService pathUtilService;

    @OSGiService
    @Getter(AccessLevel.NONE)
    private AssetUtilService assetUtilService;

    @OSGiService
    private TagUtilService tagUtilService;

    @OSGiService(
            injectionStrategy = InjectionStrategy.OPTIONAL
    )
    protected AssetDelivery assetDelivery;

    @Setter
    private boolean valid;

    @Setter
    private boolean current;

    @Setter
    private int index;

    @Setter
    private boolean third;

    @Setter
    private boolean fourth;

    @Expose
    private String createdfriendly;
    @Expose
    private String created;
    private Date createdDate;
    @Expose
    private long createdMilliseconds;
    private String icon;
    private String grouptitle;
    @Expose
    private String groupTag;
    private String groupPath;
    private String title;
    private String pageTitle;
    @SerializedName("title")
    @Expose
    private String navTitle;
    @Expose
    private String description;
    private String brief;
    @Expose
    private String author = StringUtils.EMPTY;
    private String authortitle = StringUtils.EMPTY;
    private String authorBriefDescription = StringUtils.EMPTY;
    private String authorimage = StringUtils.EMPTY;
    @Expose
    private String readtime;
    @Expose
    private String pageImage;
    private String pageImageAltText;

    @InjectChildImageModel
    @Named("jcr:content/cq:featuredimage")
    private Image featuredImageModel;

    @Setter
    private String heroimagemob;
    @Setter
    private String heroimagetab;
    @Setter
    private String heroimagedt;
    private String heroimageAltText;

    private List<TagWrapper> tags;
    @Expose
    private List<String> tagsToShow = new ArrayList<>();
    private List<String> highlights = new ArrayList<>();
    private Locale locale;
    @Expose
    protected String path;
    private String jcrPath;
    private ValueMap valueMap;

    @Expose
    private String thumbnail;

    private String getMappedValue(String path, boolean enableAssetDelivery, Map<String, Object> props) {
        return enableAssetDelivery ? assetUtilService.getMappedDeliveryUrl(path, props, assetDelivery) : pathUtilService.map(path);
    }

    public String getPageTitleWithBr() {
        return pageTitle.replaceAll("(\r\n|\n)", "<br>");
    }

    /**
     * This method updates all asset paths. If the article is used in HTL, all link transformations will
     * be processed by the link transformer, and link optimization will be processed in the HTL template. However,
     * if the article is used outside HTL, this method can transform and optimize links.
     *
     * @param enableAssetDelivery enable dynamic media asset optimization
     * @param props               dynamic media parameters
     */
    public void initAssetDeliveryProperties(boolean enableAssetDelivery, Map<String, Object> props) {
        pageImage = getMappedValue(pageImage, enableAssetDelivery, props);
        heroimagemob = getMappedValue(heroimagemob, enableAssetDelivery, props);
        heroimagetab = getMappedValue(heroimagetab, enableAssetDelivery, props);
        heroimagedt = getMappedValue(heroimagedt, enableAssetDelivery, props);
        authorimage = getMappedValue(authorimage, enableAssetDelivery, props);
        thumbnail = pathUtilService.map(thumbnail);
    }

    public void initAssetDeliveryProperties(boolean enableAssetDelivery) {
        initAssetDeliveryProperties(enableAssetDelivery, new HashMap<>());
    }

    public void initAssetDeliveryProperties(boolean enableAssetDelivery, String quality) {
        if (quality == null) {
            initAssetDeliveryProperties(enableAssetDelivery);
        } else {
            initAssetDeliveryProperties(enableAssetDelivery, Map.of("quality", quality));
        }

    }

    /**
     * Returns the article category types
     *
     * @return a {@link List} of {@code String}s where each element represents one category type
     */
    public static List<String> getArticlePageTypes() {
        return DiscoverConstants.getCategoryTypes();
    }

    @PostConstruct
    protected void init() {
        valid = false;
        valueMap = resource.getValueMap();

        locale = pageUtilService.getLocale(resource);
        createdDate = getPublishDate(valueMap);
        createdMilliseconds = createdDate.getTime();
        created = (new SimpleDateFormat("yyyy-MM-dd")).format(createdDate);
        createdfriendly = DateFormat.getDateInstance(DateFormat.LONG, locale).format(createdDate);
        icon = valueMap.get("jcr:content/mediatype", "");
        grouptitle = getGroupTitle(resource);
        groupPath = getGroupPath(resource);
        groupTag = tagUtilService.transformToHashtag(grouptitle);

        title = valueMap.get("jcr:content/jcr:title", "");
        navTitle = valueMap.get("jcr:content/navTitle", title);
        pageTitle = valueMap.get("jcr:content/pageTitle", title);
        description = valueMap.get("jcr:content/jcr:description", "");
        brief = valueMap.get("jcr:content/listbrief", "");
        if (brief.length() > 120) {
            brief = brief.substring(0, 120).concat("...");
        }

        pageImage = assetUtilService.getPageImagePath(resource);
        pageImageAltText = assetUtilService.getPageImageAltText(resource);
        heroimagemob = valueMap.get("jcr:content/heroimagemob", "");
        heroimagetab = valueMap.get("jcr:content/heroimagetab", "");
        heroimagedt = valueMap.get("jcr:content/heroimagedt", "");
        heroimageAltText = valueMap.get("jcr:content/heroimageAltText", "");
        thumbnail = assetUtilService.getThumbnailLink(pageImage);

        readtime = valueMap.get("jcr:content/readtime", "");

        initAuthor();

        tags = new ArrayList<>();
        tagsToShow = tagUtilService.getExternalTags(resource);
        highlights = tagUtilService.getHighlightsTags(resource);

        jcrPath = resource.getPath();
        path = resource.getResourceResolver().map(resource.getPath().concat(URL_EXTENSION));

        valid = true;
    }

    private ValueMap getAuthorContentFragmentData() {
        return Optional.ofNullable(resource.getChild("jcr:content/author-cf"))
                .map(r -> r.getValueMap().get("fragmentPath", String.class))
                .map(p -> resource.getResourceResolver().getResource(p + "/jcr:content/data"))
                .filter(r -> "/conf/dhl/settings/dam/cfm/models/author".equals(r.getValueMap().get("cq:model", "")))
                .map(r -> r.getChild("master"))
                .map(Resource::getValueMap)
                .orElse(ValueMap.EMPTY);
    }

    private void initAuthor() {
        ValueMap authorData = getAuthorContentFragmentData();

        authorimage = authorData.get("image", "");
        author = authorData.get("name", "");
        authortitle = authorData.get("title", "");
        authorBriefDescription = authorData.get("description", "");
    }

    public String getCreated(String pattern) {
        return (new SimpleDateFormat(pattern)).format(createdDate);
    }

    /**
     *
     */
    private String getGroupTitle(Resource self) {
        return Optional.ofNullable(self)
                .map(r -> r.adaptTo(Page.class))
                .map(p -> p.getAbsoluteParent(CATEGORY_PAGE_LEVEL))
                .map(Page::getProperties)
                .map(properties -> properties.get(PN_NAV_TITLE, properties.get(PN_TITLE, "")))
                .orElse("");
    }

    /**
     *
     */
    private String getGroupPath(Resource self) {
        return Optional.ofNullable(self)
                .map(r -> r.adaptTo(Page.class))
                .map(p -> p.getAbsoluteParent(CATEGORY_PAGE_LEVEL))
                .map(Page::getPath)
                .orElse("");
    }

    private Date getPublishDate(@NonNull ValueMap properties) {
        Date customPublishDate = properties.get("jcr:content/custompublishdate", Date.class);
        if (customPublishDate != null) {
            return customPublishDate;
        } else {
            Date jcrCreated = properties.get(PN_CREATED, new Date());
            Date cqLastModified = properties.get("jcr:content/" + PN_PAGE_LAST_MOD, jcrCreated);
            return jcrCreated.after(cqLastModified) ? jcrCreated : cqLastModified;
        }
    }
}