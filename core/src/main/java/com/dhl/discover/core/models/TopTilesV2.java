package com.dhl.discover.core.models;

import com.adobe.cq.wcm.core.components.models.Image;
import com.dhl.discover.core.injectors.InjectChildImageModel;
import com.dhl.discover.core.services.ArticleUtilService;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.*;
import org.apache.sling.models.factory.ModelFactory;
import org.osgi.service.component.annotations.Reference;

import javax.annotation.PostConstruct;
import javax.inject.Named;
import java.util.List;

@Slf4j
@Model(adaptables = { SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TopTilesV2 {

    @Self
    private SlingHttpServletRequest request;

    @OSGiService
    private ModelFactory modelFactory;

    @ChildResource
    @Named("items")
    public List<Resource> tileResources;

    @Getter
    public List<Tile> tiles;

    @PostConstruct
    private void init() {
        if(tileResources == null) {
            return;
        }
        tiles = tileResources.stream()
                .map(resource -> modelFactory.createModelFromWrappedRequest(request, resource, Tile.class))
                .toList();

        for(var i = 0; i < tiles.size(); i++) {
            var tile = tiles.get(i);
            if (tile == null) {
                continue;
            }
            if (i == 0) {
                tile.setFetchPriority("high");
            }
        }
    }


    @Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
    public static class Tile {

        @Self
        private SlingHttpServletRequest request;

        @OSGiService
        private ArticleUtilService articleUtilService;

        @ValueMapValue
        @Getter
        private String linkURL;

        @Self
        @Getter
        private Image defaultImageModel;

        @Getter
        @InjectChildImageModel
        @Named("mobileImage")
        private Image mobileImageModel;

        @Getter
        @InjectChildImageModel
        @Named("desktopImage")
        private Image desktopImageModel;

        @Setter
        @Getter
        private String sizes;

        @Setter
        @Getter
        private String fetchPriority;

        @Getter
        private String title;

        @Getter
        private String tag;

        @PostConstruct
        private void init() {
            var article = articleUtilService.getArticle(linkURL, request);
            if (article == null) {
                return;
            }
            title = article.getPageTitleWithBr();
            tag = article.getGroupTag();
        }
    }
}
