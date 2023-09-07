package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.injectors.InjectHomeProperty;
import com.positive.dhl.core.services.PageUtilService;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.LinkedList;
import java.util.List;


@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class HeaderV2Model {
    @OSGiService
    private PageUtilService pageUtilService;

    @Inject
    private Page currentPage;

    @InjectHomeProperty
    private Resource companyLinks;

    @InjectHomeProperty
    @Named("header-typeOpenBusinessAccountButton")
    private String typeOpenBusinessAccountButton;

    @InjectHomeProperty
    @Getter
    @Named("header-openBusinessAccountButtonName")
    private String openBusinessAccountButtonName;

    @InjectHomeProperty
    @Getter
    @Named("header-openBusinessAccountButtonLink")
    private String openBusinessAccountButtonLink;

    @InjectHomeProperty
    @Named("ctaBannerOpenBusinessAccount-buttonName")
    private String openBusinessAccountButtonNameFromBanner;

    @InjectHomeProperty
    @Named("ctaBannerOpenBusinessAccount-buttonLink")
    private String openBusinessAccountButtonLinkFromBanner;

    public List<CompanyLink> getCompanyLinks() {
        List<CompanyLink> links = new LinkedList<>();
        companyLinks.listChildren().forEachRemaining(r -> links.add(r.adaptTo(CompanyLink.class)));
        return links;
    }

    public String getHomePageLink() {
        return pageUtilService.getHomePage(currentPage).getPath() + ".html";
    }

    @PostConstruct
    protected void init() {
        if (!StringUtils.equals(typeOpenBusinessAccountButton, "custom")) {
            openBusinessAccountButtonName = openBusinessAccountButtonNameFromBanner;
            openBusinessAccountButtonLink = openBusinessAccountButtonLinkFromBanner;
        }
    }
}
