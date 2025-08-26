package com.dhl.discover.core.services;

import com.day.cq.wcm.commons.ReferenceSearch;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

@Component(service = ReferenceService.class)
@Slf4j
public class ReferenceService {

    ReferenceSearch getReferenceSearch() {
        return new ReferenceSearch();
    }

    public Set<String> search(ResourceResolver resolver, String path) {
        var referenceSearch = getReferenceSearch()
                .setExact(true)
                .setSearchRoot("/content/dhl")
                .setHollow(true)
                .setMaxReferencesPerPage(-1);

        Map<String, ReferenceSearch.Info> result = referenceSearch.search(resolver, path,100, 0);
        Collection<ReferenceSearch.Info> infos = result.values();

        final Set<String> pagePaths = new LinkedHashSet<>();

        for (ReferenceSearch.Info info : infos) {
            for (String prop : info.getProperties()) {
                if (prop.endsWith("cq:translationSourcePath")) {
                    continue;
                }
                String pagePath = prop.replaceAll("/jcr:content/.*", "");
                if (StringUtils.isNotBlank(pagePath)) {
                    pagePaths.add(pagePath);
                }
            }
        }
        return pagePaths;
    }
}
