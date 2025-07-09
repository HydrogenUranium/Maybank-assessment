package com.dhl.discover.core.services;

import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.models.Article;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.factory.ModelFactory;
import org.jetbrains.annotations.Nullable;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.io.Serializable;
import java.util.Optional;

@Component(service = ArticleUtilService.class)
public class ArticleUtilService implements Serializable {

    @Reference
    private transient ModelFactory modelFactory;

    /**
     * This method allows get {@link Article} model object by path.
     * @param articlePagePath is a path of the Article {@link Page}
     * @param resourceResolver is a {@link ResourceResolver}
     * @return {@code Article} if the articlePagePath links to the Article otherwise {@code null}
     */
    @Nullable
    public Article getArticle(String articlePagePath, ResourceResolver resourceResolver) {
        return Optional.ofNullable(articlePagePath)
                .filter(StringUtils::isNoneBlank)
                .map(resourceResolver::getResource)
                .map(r -> r.adaptTo(Article.class))
                .orElse(null);
    }

    @Nullable
    public Article getArticle(String articlePagePath, SlingHttpServletRequest request) {
        return Optional.ofNullable(articlePagePath)
                .filter(StringUtils::isNoneBlank)
                .map(path -> request.getResourceResolver().getResource(path))
                .map(r -> modelFactory.createModelFromWrappedRequest(request, r, Article.class))
                .orElse(null);
    }

}
