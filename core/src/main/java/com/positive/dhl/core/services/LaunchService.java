package com.positive.dhl.core.services;

import com.day.cq.wcm.api.Page;
import lombok.extern.slf4j.Slf4j;
import org.osgi.service.component.annotations.Component;

import java.util.regex.Pattern;

@Component(
        service = LaunchService.class
)
@Slf4j
public class LaunchService {

    private static final String OUT_OF_SCOPE_RESOURCE_TYPE = "launches/components/outofscope";
    private static final String LAUNCH_PATH_REGEX = "^/content/launches/\\d{4}/\\d{1,2}/\\d{1,2}/[^/]+(/content/.+)?$";
    private static final Pattern LAUNCH_PATH_PATTERN = Pattern.compile(LAUNCH_PATH_REGEX);

    public boolean isLaunchPath(String path) {
        return path.matches(LAUNCH_PATH_REGEX);
    }

    public boolean isLaunchPage(Page page) {
        return isLaunchPath(page.getPath());
    }

    public boolean isOutOfScope(Page page) {
        return page.getContentResource().isResourceType(OUT_OF_SCOPE_RESOURCE_TYPE);
    }

    public String extractPageRelativePath(String launchPath) {
        var matcher = LAUNCH_PATH_PATTERN.matcher(launchPath);
        if (matcher.find()) {
            String pageRelativePath = matcher.group(1);
            if (pageRelativePath != null) {
                return pageRelativePath;
            } else {
                log.info("No page relative path found, only the base launch path present.");
                return "";
            }
        } else {
            log.warn("Invalid launch path format: {}", launchPath);
            return null;
        }
    }

    public Page getSourcePage(Page page) {
        if(page == null || !isLaunchPage(page)) {
            return page;
        }

        String pageRelativePath = extractPageRelativePath(page.getPath());
        var resourceResolver = page.getContentResource().getResourceResolver();
        var pageResource = resourceResolver.getResource(pageRelativePath);
        if (pageResource == null) {
            log.warn("No resource found for page relative path: {}", pageRelativePath);
            return null;
        }

        return pageResource.adaptTo(Page.class);
    }

    public Page resolveOutOfScopeLaunchPage(Page page) {
        if (isLaunchPage(page) && isOutOfScope(page)) {
            return getSourcePage(page);
        }
        return page;
    }
}
