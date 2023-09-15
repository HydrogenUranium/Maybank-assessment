package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.injectors.InjectHomeProperty;
import com.positive.dhl.core.services.PageUtilService;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

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
    @Named("header/buttonName")
    private String buttonName;

    @InjectHomeProperty
    @Getter
    @Named("header/buttonLink")
    private String buttonLink;

    @InjectHomeProperty
    @Named("header/companyLinks")
    private Resource companyLinks;

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
