package com.positive.dhl.core.models;

import lombok.Getter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.inject.Inject;
import java.util.LinkedHashMap;
import java.util.Map;

@Model(adaptables= Resource.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class ArticleHeaderModel {
    @Getter
    @ValueMapValue
    private String articleTitle;

    @Getter
    @ValueMapValue
    private String publishDate;

    @Getter
    @ValueMapValue
    private String readingDuration;

    @Getter
    @ValueMapValue
    private String shareOn;

    @Getter
    @ValueMapValue
    private String smartShareButtonsLabel;

    @Getter
    @ValueMapValue
    private String smartShareButtonsIconPath;

    @Inject
    private Resource socialNetwork;

    public Map<String, String> getSocialNetwork() {
        Map<String, String> socialNetworkMap = new LinkedHashMap<>();
        if (socialNetwork != null) {
            socialNetwork.listChildren().forEachRemaining(r -> {
                ValueMap vm = r.adaptTo(ValueMap.class);
                if (vm != null && !vm.isEmpty()) {
                    socialNetworkMap.put(vm.get("socialNetworkName", String.class), vm.get("socialNetworkIconPath", String.class));
                }
            });
        }
        return socialNetworkMap;
    }
}
