package com.dhl.discover.core.models;

import com.day.cq.dam.api.Asset;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;

import javax.annotation.PostConstruct;
import java.time.Duration;
import java.util.Optional;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
public class VideoAsset {

    @Self
    private Asset asset;

    private String name;
    private String title;
    private String description;
    private String uploadDateISO;
    private String durationISO;
    private String path;

    private String getMetadata(String key) {
        return Optional.ofNullable(asset.getMetadata(key)).map(Object::toString).orElse(null);
    }

    private String extractDurationISO() {
        String scale = getMetadata("xmpDM:scale");
        String value = getMetadata("xmpDM:value");
        if(StringUtils.isAnyBlank(scale, value) || scale == null) {
            return null;
        }
        String[] scaleParts = scale.split("/");
        if(scaleParts.length < 2) {
            return null;
        }
        var numerator = Integer.parseInt(scaleParts[0]);
        var denominator = Integer.parseInt(scaleParts[1]);
        var valueInt = Long.parseLong(value);

        long durationInWholeSeconds = (valueInt * numerator) / denominator;

        return Optional.ofNullable(Duration.ofSeconds(durationInWholeSeconds)).map(Duration::toString).orElse(null);
    }

    @PostConstruct
    private void init() {
        path = asset.getPath();
        name = asset.getName();
        uploadDateISO = getMetadata("xmp:CreateDate");
        durationISO = extractDurationISO();
        description = asset.getMetadataValue("dc:description");
        title = asset.getMetadataValue("dc:title");
    }
}
