package com.dhl.discover.core.models;

import javax.inject.Named;

import lombok.*;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 *
 */
@Model(adaptables=Resource.class)
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LanguageVariant {
    @Setter
    public String region;

    @ValueMapValue
    public String name;

    @ValueMapValue
    @Named("jcr:title")
    public String title;

    @ValueMapValue
    public String home;

    @ValueMapValue
    public String link;

    @ValueMapValue
    public String langCode;

    @ValueMapValue
    public boolean deflt;

    @ValueMapValue
    public boolean current;

    @ValueMapValue
    public boolean exact;

}