package com.dhl.discover.core.models;

import com.adobe.cq.wcm.core.components.models.Image;
import com.adobe.cq.wcm.spi.AssetDelivery;
import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.injectors.InjectChildImageModel;
import com.dhl.discover.core.services.AssetUtilService;
import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.core.services.PathUtilService;
import com.dhl.discover.core.services.TagUtilService;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.NonNull;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

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
    private AssetUtilService assetUtilService;

    @OSGiService
    private TagUtilService tagUtilService;

    @OSGiService
    protected AssetDelivery assetDelivery;

    private Date createdDate;
    @Expose
    private String createdfriendly;
    @Expose
    private String created;
    @Expose
    private long createdMilliseconds;

    @Expose
    private String groupTag;
    private String grouptitle;
    private String groupPath;

    @ValueMapValue(name = "jcr:content/jcr:title")
    private String title;
    private String pageTitle;
    @SerializedName("title")
    @Expose
    private String navTitle;
    @Expose
    @ValueMapValue(name ="jcr:content/jcr:description")
    @Default(values = "")
    private String description;

    @Expose
    private String author = StringUtils.EMPTY;
    private String authortitle = StringUtils.EMPTY;
    private String authorBriefDescription = StringUtils.EMPTY;
    private String authorimage = StringUtils.EMPTY;

    @Expose
    @ValueMapValue(name = "jcr:content/readtime")
    @Default(values = "")
    private String readtime;

    /**
     * The image model can only be initialized when adapted from a SlingHttpServletRequest.
     * If adapted from a Resource, the featured image model will remain null.
     */
    @InjectChildImageModel
    @Named("jcr:content/cq:featuredimage")
    @Expose
    private Image featuredImageModel;

    @ValueMapValue(name = "jcr:content/mediatype")
    private String mediaType;

    @Expose
    private List<String> tagsToShow = new ArrayList<>();
    private List<String> highlights = new ArrayList<>();
    private Locale locale;
    @Expose
    protected String path;
    private String jcrPath;
    private ValueMap valueMap;

    public String getPageTitleWithBr() {
        return pageTitle.replaceAll("(\r\n|\n)", "<br>");
    }

    @PostConstruct
    protected void init() {
        valueMap = resource.getValueMap();
        locale = pageUtilService.getLocale(resource);
        jcrPath = resource.getPath();
        path = resource.getResourceResolver().map(resource.getPath().concat(URL_EXTENSION));

        initDates();
        initTitles();
        initAuthor();
        initCategoryData();
        initTags();
    }

    private void initTags() {
        tagsToShow = tagUtilService.getExternalTags(resource);
        highlights = tagUtilService.getHighlightsTags(resource);
    }

    private void initCategoryData() {
        grouptitle = getGroupTitle(resource);
        groupPath = getGroupPath(resource);
        groupTag = tagUtilService.transformToHashtag(grouptitle);
    }

    private void initTitles() {
        navTitle = valueMap.get("jcr:content/navTitle", title);
        pageTitle = valueMap.get("jcr:content/pageTitle", title);
        description = valueMap.get("jcr:content/jcr:description", "");
    }

    private void initDates() {
        createdDate = getPublishDate(valueMap);
        createdMilliseconds = createdDate.getTime();
        created = (new SimpleDateFormat("yyyy-MM-dd")).format(createdDate);
        createdfriendly = DateFormat.getDateInstance(DateFormat.LONG, locale).format(createdDate);
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

    private String getGroupTitle(Resource self) {
        return Optional.ofNullable(self)
                .map(r -> r.adaptTo(Page.class))
                .map(p -> p.getAbsoluteParent(CATEGORY_PAGE_LEVEL))
                .map(Page::getProperties)
                .map(properties -> properties.get(PN_NAV_TITLE, properties.get(PN_TITLE, "")))
                .orElse("");
    }

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