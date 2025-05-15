package com.dhl.discover.core.models;

import com.adobe.cq.wcm.core.components.models.Image;
import com.day.cq.wcm.api.components.Component;
import com.dhl.discover.core.services.PageUtilService;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.*;
import org.apache.sling.models.factory.ModelFactory;

import javax.annotation.PostConstruct;
import javax.inject.Named;
import java.util.List;
import java.util.stream.Collectors;

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
                .collect(Collectors.toList());

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

        @OSGiService
        private ModelFactory modelFactory;

        @Self
        private SlingHttpServletRequest request;

        @SlingObject
        private ResourceResolver resourceResolver;

        @OSGiService
        private PageUtilService pageUtilService;

        @ValueMapValue
        private String linkURL;

        @ChildResource
        private Resource desktopImage;

        @ChildResource
        private Resource mobileImage;

        @Self
        @Getter
        private Image defaultImageModel;

        @Getter
        private Image mobileImageModel;

        @Getter
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
            var article = pageUtilService.getArticle(linkURL, resourceResolver);
            if (article == null) {
                return;
            }
            title = article.getPageTitleWithBr();
            tag = article.getGroupTag();
            mobileImageModel = getImageModel(mobileImage);
            desktopImageModel = getImageModel(desktopImage);
        }

        private Image getImageModel(Resource resource) {
            if (!hasFileReference(resource)) {
                return null;
            }
            return modelFactory.createModelFromWrappedRequest(request, resource, Image.class);
        }

        private boolean hasFileReference(Resource resource) {
            return resource != null &&
                    StringUtils.isNotBlank(resource.getValueMap().get("fileReference", String.class));
        }
    }
}
