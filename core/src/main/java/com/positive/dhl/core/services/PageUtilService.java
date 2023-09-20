package com.positive.dhl.core.services;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageFilter;
import org.apache.sling.api.resource.ValueMap;
import org.osgi.service.component.annotations.Component;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Component(service = PageUtilService.class)
public class PageUtilService {

    public static final int HOME_PAGE_LEVEL = 3;
    public static final int CATEGORY_PAGE_LEVEL = HOME_PAGE_LEVEL + 1;
    public static final int HOME_PAGE_DEPTH = HOME_PAGE_LEVEL + 1;

    private static final String HOME_PAGE_STATIC_RESOURCE_TYPE = "dhl/components/pages/home";
    private static final String HOME_PAGE_DYNAMIC_RESOURCE_TYPE = "dhl/components/pages/editable-home-page";

    public int getHomePageLevel() {
        return HOME_PAGE_LEVEL;
    }

    public Page getHomePage(Page page) {
        return Optional.ofNullable(page)
                .map(p -> p.getAbsoluteParent(getHomePageLevel()))
                .orElse(null);
    }

    public ValueMap getPageProperties(Page page) {
        return Optional.ofNullable(page)
                .map(p -> p.adaptTo(ValueMap.class))
                .orElse(ValueMap.EMPTY);
    }

    public ValueMap getHomePageProperties(Page page) {
        return getPageProperties(getHomePage(page));
    }

    public List<Page> getAllHomePages(Page rootPage) {
        return rootPage == null || rootPage.getDepth() > HOME_PAGE_DEPTH
                ? null
                : getAllHomePages(rootPage, new LinkedList<>());
    }

    public boolean isHomePage(Page page) {
        if(page == null) {
            return false;
        }
        ValueMap pageProperties = page.getProperties();
        String resourceType = pageProperties.get("sling:resourceType", "");
        boolean isHomePageResourceType = resourceType.equals(HOME_PAGE_DYNAMIC_RESOURCE_TYPE) || resourceType.equals(HOME_PAGE_STATIC_RESOURCE_TYPE);
        return page.getDepth() == HOME_PAGE_DEPTH && isHomePageResourceType;
    }

    private List<Page> getAllHomePages(Page page, List<Page> list) {
        Iterator<Page> pageIterator = page.listChildren(new PageFilter(false, false));
        while (pageIterator.hasNext()) {
            var childPage = pageIterator.next();
            if (isHomePage(childPage)) {
                list.add(childPage);
            }
            if (childPage.getDepth() < HOME_PAGE_DEPTH) {
                getAllHomePages(childPage, list);
            }
        }
        return list;
    }
}
