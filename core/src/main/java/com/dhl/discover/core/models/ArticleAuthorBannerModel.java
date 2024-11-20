package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.injectors.InjectHomeProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Required;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;

import javax.annotation.PostConstruct;
import javax.inject.Named;

@Model(adaptables=SlingHttpServletRequest.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class ArticleAuthorBannerModel {
    @ScriptVariable
    @Required
    private Page currentPage;

    @Getter
    @InjectHomeProperty
    @Named("authorBanner-title")
    private String title;

    @InjectHomeProperty
    @Getter
    @Named("articleHeader-followLabel")
    private String followLabel;

    @InjectHomeProperty
    @Getter
    @Named("articleHeader-followPath")
    private String followPath;

    @Getter
    private String brief;

    @PostConstruct
    protected void init() {
        ValueMap currentPageProperties = currentPage.getProperties();
        if (currentPageProperties != null ) {
            brief = currentPageProperties.get("authorBriefDescription", String.class);
        }
    }
}
