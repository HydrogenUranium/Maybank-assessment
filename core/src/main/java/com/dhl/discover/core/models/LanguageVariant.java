package com.dhl.discover.core.models;

import javax.inject.Named;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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

    public LanguageVariant(String name, String title, String home, String link, String langCode, boolean deflt, boolean current, boolean exact) {
        this.home = home;
        this.title = title;
        this.link = link;
        this.langCode = langCode;
        this.name = name;
        this.deflt = deflt;
        this.current = current;
        this.exact = exact;
    }
}