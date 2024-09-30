package com.positive.dhl.core.models;

import com.day.cq.wcm.api.designer.Style;
import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.PathUtilService;
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

    @OSGiService
    private PathUtilService pathUtilService;

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

    @Getter
    private boolean enableAssetDelivery;

    @PostConstruct
    protected void init() {
        enableAssetDelivery = currentStyle.get("enableAssetDelivery", false);
        log.debug("Enable Asset Delivery: {}", enableAssetDelivery);

        if (articleMultifield != null) {
            Iterator<Resource> multifieldItems = articleMultifield.listChildren();
            while (multifieldItems.hasNext()) {
                var properties = multifieldItems.next().getValueMap();
                String path = properties.get("articlePath", "");
                String mobileImage = properties.get("mobileImage", "");
                String desktopImage = properties.get("desktopImage", "");
                var article = pageUtilService.getArticle(path, resourceResolver);
                if (article != null) {
                    articles.add(article);
                    log.debug("Article Page Image: {}", article.getPageImage());

                    if(!desktopImage.isBlank()) {
                        article.setHeroimagedt(desktopImage);
                        article.setHeroimagetab(desktopImage);
                    } else {
                        article.setHeroimagedt(article.getHeroimagemob());
                        article.setHeroimagetab(article.getHeroimagemob());
                    }
                    if(!mobileImage.isBlank()) {
                        article.setHeroimagemob(mobileImage);
                    }
                    log.debug("Article Page Image after initialization of asset delivery: {}", article.getPageImage());
                }
            }
        }
    }
}
