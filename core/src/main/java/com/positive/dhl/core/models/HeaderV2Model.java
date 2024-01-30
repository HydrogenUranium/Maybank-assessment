package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.injectors.InjectHomeProperty;
import com.positive.dhl.core.services.PageUtilService;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.LinkedList;
import java.util.List;


@Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class HeaderV2Model {
    @OSGiService
    private PageUtilService pageUtilService;

    @Inject
    private Page currentPage;

    @InjectHomeProperty
    @Getter
    @Named("header-buttonName")
    private String buttonName;

    @InjectHomeProperty
    @Getter
    @Named("header-buttonLink")
    private String buttonLink;

    @InjectHomeProperty
    @Getter
    @Named("header-signInLabel")
    private String signInLabel;

    @InjectHomeProperty
    @Getter
    @Named("header-categoryLinksLabel")
    private String categoryLinksLabel;

    @InjectHomeProperty
    @Getter
    @Named("header-homePageLabel")
    private String homePageLabel;

    @InjectHomeProperty
    @Getter
    @Named("header-moreLinkLabel")
    private String moreLinkLabel;

    @InjectHomeProperty
    @Getter
    @Named("header-lessLinkLabel")
    private String lessLinkLabel;

    @InjectHomeProperty
    @Getter
    @Named("header-companyLinksLabel")
    private String companyLinksLabel;

    @InjectHomeProperty
    @Named("multifields/header-companyLinks")
    private Resource companyLinks;

    @Getter
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
