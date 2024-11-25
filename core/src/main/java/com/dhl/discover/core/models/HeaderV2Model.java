package com.dhl.discover.core.models;

import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.injectors.InjectHomeProperty;
import com.dhl.discover.core.services.PageUtilService;
import lombok.AccessLevel;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;

import javax.annotation.PostConstruct;
import javax.inject.Named;
import java.util.LinkedList;
import java.util.List;


@Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
@Getter
public class HeaderV2Model {
    @OSGiService
    @Getter(AccessLevel.NONE)
    private PageUtilService pageUtilService;

    @ScriptVariable
    @Getter(AccessLevel.NONE)
    private Page currentPage;

    @InjectHomeProperty
    @Named("header-buttonName")
    private String buttonName;

    @InjectHomeProperty
    @Named("header-buttonLink")
    private String buttonLink;

    @InjectHomeProperty
    @Named("header-signInLabel")
    private String signInLabel;

    @InjectHomeProperty
    @Named("header-countrySelectorToggleAriaLabel")
    private String countrySelectorToggleAriaLabel;

    @InjectHomeProperty
    @Named("header-switchLanguageAriaLabel")
    private String switchLanguageAriaLabel;

    @InjectHomeProperty
    @Named("header-countryFilterInputAriaLabel")
    private String countryFilterInputAriaLabel;


    @InjectHomeProperty
    @Named("header-categoryLinksLabel")
    private String categoryLinksLabel;

    @InjectHomeProperty
    @Named("header-homePageLabel")
    private String homePageLabel;

    @InjectHomeProperty
    @Named("header-moreLinkLabel")
    private String moreLinkLabel;

    @InjectHomeProperty
    @Named("header-lessLinkLabel")
    private String lessLinkLabel;

    @InjectHomeProperty
    @Named("header-companyLinksLabel")
    private String companyLinksLabel;

    @InjectHomeProperty
    @Default(values = "Search")
    @Named("header-countrySelector-searchPlaceholder")
    private String countrySearchPlaceholder;

    @InjectHomeProperty
    @Default(values = "Countries & Regions")
    @Named("header-countrySelector-title")
    private String countrySelectorTitle;

    @InjectHomeProperty
    @Getter(AccessLevel.NONE)
    @Named("multifields/header-companyLinks")
    private Resource companyLinks;

    private String hideNavigationMenu;

    @PostConstruct
    private void init() {
        ValueMap currentPageProperties = currentPage.getProperties();
        if (!currentPageProperties.isEmpty()) {
            hideNavigationMenu = currentPageProperties.get("hideNavigationMenu", "");
        }
    }

    public List<LinkModel> getCompanyLinks() {
        List<LinkModel> links = new LinkedList<>();
        if (companyLinks != null) {
            companyLinks.listChildren().forEachRemaining(r -> links.add(r.adaptTo(LinkModel.class)));
        }
        return links;
    }

    public String getHomePageLink() {
        return pageUtilService.getHomePage(currentPage).getPath() + ".html";
    }
}
