package com.positive.dhl.core.services.schema.impl;

import com.day.cq.dam.api.Asset;
import com.google.gson.JsonObject;
import com.positive.dhl.core.models.Article;
import com.positive.dhl.core.models.Video;
import com.positive.dhl.core.models.VideoAsset;
import com.positive.dhl.core.services.PathUtilService;
import com.positive.dhl.core.utils.SchemaMarkupUtils;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.function.Function;

import static com.positive.dhl.core.constants.SchemaMarkupType.VIDEO_OBJECT;
import static com.positive.dhl.core.utils.SchemaMarkupUtils.createSchema;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class VideoSchemaAdapterTest {
    private final AemContext context = new AemContext();

    private Resource resource;

    @Mock
    private PathUtilService pathUtilService;

    @InjectMocks
    private VideoSchemaAdapter adapter ;

    @Mock
    private Video videoModel;

    @BeforeEach
    void setUp() {
        context.registerAdapter(Resource.class, Video.class, (Function<Resource, Video>)r -> videoModel);
        context.addModelsForClasses(Asset.class, VideoAsset.class);
        context.load().json("/com/positive/dhl/core/models/VideoAsset/content.json", "/content/dam/global-master/video.webm");
        resource = context.create().resource("/content/dhl/home/jcr:content/video",
                "sling:resourceType", "dhl/components/content/video");
    }

    @Test
    void canHandle() {
        assertTrue(adapter.canHandle(resource));
    }

    @Test
    void toJson() {
        when(videoModel.getVideoPath()).thenReturn("/content/dam/global-master/video.webm");
        when(videoModel.getPoster()).thenReturn("/content/dam/global-master/video.png");
        when(pathUtilService.getFullMappedPath(anyString(), any()))
                .thenAnswer(invocationOnMock -> "https://www.example.com" + invocationOnMock.getArgument(0));

        JsonObject expected = createSchema(VIDEO_OBJECT);
        expected.addProperty("name", "title");
        expected.addProperty("description", "description");
        expected.addProperty("thumbnailUrl", "https://www.example.com/content/dam/global-master/video.png");
        expected.addProperty("uploadDate", "{Date}Thu Apr 25 2024 09:17:25 GMT+0000");
        expected.addProperty("duration", "PT13S");
        expected.addProperty("contentUrl", "https://www.example.com/content/dam/global-master/video.webm");


        try(MockedStatic<SchemaMarkupUtils> mockedStatic = mockStatic(SchemaMarkupUtils.class)) {
            mockedStatic.when(() -> SchemaMarkupUtils.isValidVideoObjectSchema(any())).thenReturn(true);
            mockedStatic.when(() -> SchemaMarkupUtils.createSchema(any())).thenCallRealMethod();

            JsonObject json = adapter.toJson(resource, context.request());

            assertEquals(expected, json);
        }
    }
}