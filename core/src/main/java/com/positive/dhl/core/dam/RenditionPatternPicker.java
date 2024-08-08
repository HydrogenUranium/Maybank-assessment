package com.positive.dhl.core.dam;

import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.Rendition;
import com.day.cq.dam.api.RenditionPicker;
import org.osgi.annotation.versioning.ProviderType;

import java.util.List;
import java.util.regex.Pattern;

@ProviderType
public class RenditionPatternPicker implements RenditionPicker {
    private final Pattern pattern;

    public RenditionPatternPicker(String pattern) {
        this.pattern = Pattern.compile(pattern);
    }

    @Override
    public final Rendition getRendition(final Asset asset) {
        List<Rendition> renditions = asset.getRenditions();

        boolean hasOriginal = asset.getOriginal() != null;
        boolean hasRenditions = !renditions.isEmpty();

        for (final Rendition rendition : renditions) {
            var matcher = pattern.matcher(rendition.getName());

            if (matcher.find()) {
                return rendition;
            }
        }

        if (hasOriginal) {
            return asset.getOriginal();
        } else if (hasRenditions) {
            return renditions.get(0);
        } else {
            return null;
        }
    }
}