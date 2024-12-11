package com.dhl.discover.core.models;

import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import java.util.List;

@Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
@Getter
public class Footer {
    @ValueMapValue
    @Default(values = "")
    private String logoIcon;

    @ValueMapValue
    private String logoTitle;

    @ValueMapValue
    private String logoAltText;

    @ValueMapValue
    private String logoLink;

    @ValueMapValue
    private String invitationTitle;

    @ValueMapValue
    private String invitationText;

    @ValueMapValue
    private String promoText;

    @ValueMapValue
    private String categoryLinksLabel;

    @ValueMapValue
    private String companyLinksLabel;

    @ValueMapValue
    private String socialLinksLabel;

    @ChildResource
    private List<LinkModel> companyLinks;

    @ChildResource
    private List<LinkModel> socialLinks;
}
