package com.dhl.discover.core.models;

import com.dhl.discover.core.injectors.InjectHomeProperty;
import com.dhl.discover.core.services.PathUtilService;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import javax.inject.Named;
import java.util.LinkedList;
import java.util.List;

@Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
@Getter
public class FollowUs {
    @OSGiService
    private PathUtilService pathUtilService;

    @InjectHomeProperty
    @Named("footer-socialLinksLabel")
    private String socialLinksLabel;

    @InjectHomeProperty
    @Named("multifields/footer-socialLinks")
    private Resource socialLinks;

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