package com.dhl.discover.core.models;

import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.services.PageUtilService;
import lombok.AccessLevel;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.annotation.PostConstruct;
import javax.inject.Named;
import java.util.List;

@Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
@Getter
public class Header {
    @OSGiService
    @Getter(AccessLevel.NONE)
    private PageUtilService pageUtilService;

    @ScriptVariable
    @Getter(AccessLevel.NONE)
    private Page currentPage;

    @ValueMapValue
    private String buttonName;

    @ValueMapValue
    private String buttonLink;

    @ValueMapValue
    private String signInLabel;

    @ValueMapValue
    private String countrySelectorToggleAriaLabel;

    @ValueMapValue
    private String switchLanguageAriaLabel;

    @ValueMapValue
    private String discoverLogoAriaLabel;

    @ValueMapValue
    private String countryFilterInputAriaLabel;

    @ValueMapValue
    private String categoryLinksLabel;

    @ValueMapValue
    private String homePageLabel;

    @ValueMapValue
    private String moreLinkLabel;

    @ValueMapValue
    private String lessLinkLabel;

    @ValueMapValue
    private String companyLinksLabel;

    @ValueMapValue
    @Default(values = "Search")
    @Named("countrySelector-searchPlaceholder")
    private String countrySearchPlaceholder;

    @ValueMapValue
    @Default(values = "Countries & Regions")
    @Named("countrySelector-searchPlaceholder")
    private String countrySelectorTitle;

    @ChildResource
    private List<LinkModel> companyLinks;

    @ValueMapValue
    private boolean hideNavigationMenu;

    @ValueMapValue
    private String wcagContentLabel;

    @ValueMapValue
    private String wcagFooterLabel;

    @PostConstruct
    private void init() {
        ValueMap currentPageProperties = currentPage.getProperties();
        if (!hideNavigationMenu && !currentPageProperties.isEmpty()) {
            hideNavigationMenu = currentPageProperties.get("hideNavigationMenu", false);
        }
    }

    public String getHomePageLink() {
        return pageUtilService.getHomePage(currentPage).getPath() + ".html";
    }
}
