package com.positive.dhl.core.models;

import com.day.cq.wcm.api.designer.Style;
import com.positive.dhl.core.services.PageUtilService;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Slf4j
@Model(adaptables = { Resource.class, SlingHttpServletRequest.class })
public class TopTiles {

    @OSGiService
    private PageUtilService pageUtilService;

    @Inject
    private ResourceResolver resourceResolver;

    @ScriptVariable
    protected Style currentStyle;

    @Inject
    @Named("articles")
    @ChildResource
    private Resource articleMultifield;

    @Getter
    private final List<Article> articles = new ArrayList<>();

    @PostConstruct
    protected void init() {
        boolean enableAssetDelivery = currentStyle.get("enableAssetDelivery", false);
        log.debug("Enable Asset Delivery: {}", enableAssetDelivery);

        if (articleMultifield != null) {
            Iterator<Resource> multifieldItems = articleMultifield.listChildren();
            while (multifieldItems.hasNext()) {
                var properties = multifieldItems.next().getValueMap();
                String path = properties.get("articlePath", "");
                var article = pageUtilService.getArticle(path, resourceResolver);
                if (article != null) {
                    articles.add(article);
                    log.debug("Article Listed Image: {}", article.getListimage());
                    article.initAssetDeliveryProperties(enableAssetDelivery);
                    log.debug("Article Listed Image after initialization of asset delivery: {}", article.getListimage());
                }
            }
        }
    }
}
