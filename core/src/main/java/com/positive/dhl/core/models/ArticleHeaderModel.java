package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.injectors.InjectHomeProperty;
import com.positive.dhl.core.services.PageUtilService;
import lombok.Getter;
import lombok.NonNull;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

import static com.day.cq.wcm.api.constants.NameConstants.*;


@Model(adaptables=SlingHttpServletRequest.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class ArticleHeaderModel {
    @Inject
    private Page currentPage;

    @OSGiService
    private PageUtilService pageUtilService;

    @Getter
    private String articleTitle;

    @Getter
    private String publishDate;

    @Getter
    private String publishDateFriendly;

    @Getter
    private String readingDuration;

    @InjectHomeProperty
    @Getter
    @Named("articleHeader-shareOn")
    private String shareOn;

    @InjectHomeProperty
    @Getter
    @Named("articleHeader-smartShareButtonsLabel")
    private String smartShareButtonsLabel;

    @InjectHomeProperty
    @Getter
    @Named("articleHeader-smartShareButtonsIconPath")
    private String smartShareButtonsIconPath;

    @InjectHomeProperty
    @Getter
    @Named("articleHeader-followLabel")
    private String followLabel;

    @InjectHomeProperty
    @Getter
    @Named("articleHeader-followPath")
    private String followPath;

    @InjectHomeProperty
    @Named("multifields/socialNetwork")
    private Resource socialNetwork;

    @PostConstruct
    protected void init() {
        ValueMap currentPageProperties = currentPage.getProperties();
        if (currentPageProperties != null ) {
            articleTitle = currentPageProperties.get(PN_TITLE, String.class);

            Date publishDateValue = getPublishDate(currentPageProperties);
            publishDate = new SimpleDateFormat("yyyy-MM-dd").format(publishDateValue);
            publishDateFriendly = DateFormat.getDateInstance(DateFormat.LONG, pageUtilService.getLocale(currentPage)).format(publishDateValue);

            readingDuration = currentPageProperties.get("readtime", String.class);
        }
    }

    private Date getPublishDate(@NonNull ValueMap properties) {
        Date customPublishDate = properties.get("custompublishdate", Date.class);
        if (customPublishDate != null) {
            return customPublishDate;
        } else {
            Date jcrCreated = properties.get(PN_CREATED, new Date());
            Date cqLastModified = properties.get(PN_PAGE_LAST_MOD, new Date());
            return jcrCreated.after(cqLastModified) ? jcrCreated : cqLastModified;
        }
    }

    public Map<String, String> getSocialNetwork() {
        Map<String, String> socialNetworkMap = new LinkedHashMap<>();
        if (socialNetwork != null) {
            socialNetwork.listChildren().forEachRemaining(r -> {
                ValueMap vm = r.adaptTo(ValueMap.class);
                if (vm != null && !vm.isEmpty()) {
                    socialNetworkMap.put(vm.get("socialNetworkName", String.class), vm.get("socialNetworkIconPath", String.class));
                }
            });
        }
        return socialNetworkMap;
    }
}
