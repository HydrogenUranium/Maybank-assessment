package com.dhl.discover.core.models;

        import com.day.cq.wcm.api.Page;
        import lombok.Getter;
        import org.apache.commons.lang3.StringUtils;
        import org.apache.sling.api.SlingHttpServletRequest;
        import org.apache.sling.models.annotations.DefaultInjectionStrategy;
        import org.apache.sling.models.annotations.Model;
        import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
        import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

        import javax.annotation.PostConstruct;

@Model(adaptables= SlingHttpServletRequest.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class ArticleCarouselModel {

    @ScriptVariable
    private Page currentPage;

    @ValueMapValue
    @Getter
    private String titleCarousel;

    @ValueMapValue
    @Getter
    private String type;

    @Getter
    private String titleFromLinkedPage;

    @PostConstruct
    protected void init() {

        titleFromLinkedPage = currentPage.getNavigationTitle();

        if (StringUtils.isEmpty(titleCarousel)) {
            titleCarousel = titleFromLinkedPage;
        }
    }
}
