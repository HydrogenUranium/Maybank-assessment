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

    private static final int HOME_PAGE_LEVEL = 2;

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

    public List<Page> getAllHomePages(Page page) {
        List<Page> homePages = new LinkedList<>();
        return page == null || page.getDepth() > HOME_PAGE_LEVEL + 1 ? null : getAllHomePages(page, homePages);
    }

    private List<Page> getAllHomePages(Page page, List<Page> list) {
        Iterator<Page> pageIterator = page.listChildren(new PageFilter(false, false));
        while (pageIterator.hasNext()) {
            Page childPage = pageIterator.next();
            int childPageDepth = childPage.getDepth();
            if (childPageDepth == HOME_PAGE_LEVEL + 1) {
                list.add(childPage);
            }
            if (childPageDepth < HOME_PAGE_LEVEL + 1) {
                getAllHomePages(childPage, list);
            }
        }
        return list;
    }
}
