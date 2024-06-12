package com.positive.dhl.core.services.schema.impl;

import com.google.gson.JsonObject;
import com.positive.dhl.core.models.Video;
import com.positive.dhl.core.models.VideoAsset;
import com.positive.dhl.core.services.PathUtilService;
import com.positive.dhl.core.services.schema.SchemaAdapter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.util.Optional;

import static com.positive.dhl.core.constants.SchemaMarkupType.VIDEO_OBJECT;
import static com.positive.dhl.core.utils.SchemaMarkupUtils.createSchema;
import static com.positive.dhl.core.utils.SchemaMarkupUtils.isValidVideoObjectSchema;

@Component(service = SchemaAdapter.class)
public class VideoSchemaAdapter implements SchemaAdapter {
    public static final String RESOURCE_TYPE = "dhl/components/content/video";

    @Reference
    private PathUtilService pathUtilService;

    @Override
    public boolean canHandle(Resource resource) {
        return resource.isResourceType(RESOURCE_TYPE);
    }

    @Override
    public JsonObject toJson(Resource resource, SlingHttpServletRequest request) {
        var resolver = resource.getResourceResolver();
        Video videoComponentModel = resource.adaptTo(Video.class);
        if(videoComponentModel == null) {
            return null;
        }

        var videoAssetModel = Optional.ofNullable(resolver.getResource(videoComponentModel.getVideoPath()))
                .map(r -> r.adaptTo(VideoAsset.class)).orElse(null);

        if(videoAssetModel == null) {
            return null;
        }

        var videoJson = createSchema(VIDEO_OBJECT);
        addProperty(videoJson, "name", videoAssetModel.getTitle());
        addProperty(videoJson, "description", videoAssetModel.getDescription());
        addProperty(videoJson, "thumbnailUrl", pathUtilService.getFullMappedPath(videoComponentModel.getPoster(), request));
        addProperty(videoJson, "uploadDate", videoAssetModel.getUploadDateISO());
        addProperty(videoJson, "duration", videoAssetModel.getDurationISO());
        addProperty(videoJson, "contentUrl", pathUtilService.getFullMappedPath(videoAssetModel.getPath(), request));

        return isValidVideoObjectSchema(videoJson) ? videoJson : null;
    }

    private void addProperty(JsonObject jsonObject, String property, String value) {
        if (StringUtils.isNotBlank(value)) {
            jsonObject.addProperty(property, value);
        }
    }
}
