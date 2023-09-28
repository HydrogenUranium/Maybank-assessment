package com.positive.dhl.core.models;

import com.positive.dhl.core.injectors.InjectHomeProperty;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Named;
import java.util.LinkedList;
import java.util.List;

@Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class FooterV2Model {

    @InjectHomeProperty
    @Getter
    @Named("footer-logoIcon")
    private String logoIcon;

    @InjectHomeProperty
    @Getter
    @Named("footer-logoTitle")
    private String logoTitle;

    @InjectHomeProperty
    @Getter
    @Named("footer-logoAltText")
    private String logoAltText;

    @InjectHomeProperty
    @Getter
    @Named("footer-logoLink")
    private String logoLink;

    @InjectHomeProperty
    @Getter
    @Named("footer-invitation-title")
    private String invitationTitle;

    @InjectHomeProperty
    @Getter
    @Named("footer-invitation-text")
    private String invitationText;

    @InjectHomeProperty
    @Getter
    @Named("footer-promo-text")
    private String promoText;

    @InjectHomeProperty
    @Getter
    @Named("footer-categoryLinksLabel")
    private String categoryLinksLabel;

    @InjectHomeProperty
    @Getter
    @Named("footer-companyLinksLabel")
    private String companyLinksLabel;

    @InjectHomeProperty
    @Named("multifields/footer-companyLinks")
    private Resource companyLinks;

    @InjectHomeProperty
    @Getter
    @Named("footer-socialLinksLabel")
    private String socialLinksLabel;

    @InjectHomeProperty
    @Named("multifields/footer-socialLinks")
    private Resource socialLinks;

    public List<LinkModel> getCompanyLinks() {
        return getInnerLinks(companyLinks);
    }

    public List<LinkModel> getSocialLinks() {
        return getInnerLinks(socialLinks);
    }

    private List<LinkModel> getInnerLinks(Resource parentResource) {
        List<LinkModel> links = new LinkedList<>();
        if (parentResource != null) {
            parentResource.listChildren().forEachRemaining(r -> links.add(r.adaptTo(LinkModel.class)));
        }
        return links;
    }
}
