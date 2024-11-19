package com.positive.dhl.core.models;

import com.day.cq.wcm.api.designer.Style;
import com.positive.dhl.core.injectors.InjectHomeProperty;
import com.positive.dhl.core.services.PageUtilService;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.*;

import javax.annotation.PostConstruct;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Model(adaptables = { Resource.class, SlingHttpServletRequest.class }, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class RelatedPosts {
    @OSGiService
    private PageUtilService pageUtilService;

    @ScriptVariable
    protected Style currentStyle;

    @InjectHomeProperty
    @Named("relatedPosts-title")
    private String homePropertyTitle;

    @SlingObject
    private ResourceResolver resourceResolver;

    @ValueMapValue
    @Getter
    private String title;

    @ValueMapValue
    @Default(values = "customPick")
    private String source;

    @ChildResource
    @Named("articles")
    private Resource articleMultifield;

    @Getter
    private boolean enableAssetDelivery;

    @Getter
    private final List<Article> articles = new ArrayList<>();

    @PostConstruct
    private void init() {
        title = StringUtils.defaultIfBlank(title, homePropertyTitle);
        if (articleMultifield != null) {
            Iterator<Resource> multifieldItems = articleMultifield.listChildren();
            while (multifieldItems.hasNext()) {
                var properties = multifieldItems.next().getValueMap();
                String path = properties.get("articlePath", "");
                var article = pageUtilService.getArticle(path, resourceResolver);
                if (article != null) {
                    articles.add(article);
                }
            }
        }
        enableAssetDelivery = currentStyle.get("enableAssetDelivery", false);
    }
}
