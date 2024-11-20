package com.dhl.discover.core.models;

import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.annotation.PostConstruct;
import java.util.regex.Pattern;

@Getter
@Model(adaptables=Resource.class)
public class Infogram {
    private static final Pattern PATTERN =
            Pattern.compile("\\[infogram\\s+id=\"([a-f0-9-]+)\"\\s+prefix=\"([a-zA-Z0-9]+)\"\\s+format=\"([^\"]+)\"\\s+title=\"([^\"]+)\"\\]");

    @ValueMapValue
    private String wordPressEmbedField;

    private String id;
    private String prefix;
    private String format;
    private String title;
    private boolean isValid = false;

    @PostConstruct
    private void init() {
        if(StringUtils.isBlank(wordPressEmbedField)) {
            return;
        }

        var matcher = PATTERN.matcher(wordPressEmbedField);

        if (matcher.find()) {
            id = matcher.group(1);
            prefix = matcher.group(2);
            format = matcher.group(3);
            title = matcher.group(4);
            isValid = true;
        }
    }
}
