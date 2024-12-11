package com.dhl.discover.core.models;

import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.services.PageUtilService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.RequestAttribute;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;

@Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ExperienceFragmentLocalization {
    private static final String PAGES_FOLDER = "/content";
    private static final String EXPERIENCE_FRAGMENTS_FOLDER = "/content/experience-fragments";
    private static final String EXPERIENCE_FRAGMENT_MASTER_LOCATION = "/content/experience-fragments/dhl/language-masters/en-master";

    @Self
    private SlingHttpServletRequest request;

    @OSGiService
    private PageUtilService pageUtilService;

    @ScriptVariable
    private Page currentPage;

    @RequestAttribute
    private String path;

    private boolean isExperienceFragmentMasterReference() {
        return path.startsWith(EXPERIENCE_FRAGMENT_MASTER_LOCATION);
    }

    private boolean isExperienceFragmentPage() {
        return currentPage.getPath().startsWith(EXPERIENCE_FRAGMENTS_FOLDER);
    }

    public String getLocalizedPath() {
        if(!isExperienceFragmentMasterReference() || isExperienceFragmentPage()) {
            return path;
        }

        String relativeRootPath = pageUtilService.getHomePage(currentPage)
                .getPath().replaceFirst(PAGES_FOLDER, EXPERIENCE_FRAGMENTS_FOLDER);
        String localizedVariationPath = path.replaceFirst(EXPERIENCE_FRAGMENT_MASTER_LOCATION, relativeRootPath);
        var localizedVariationResource = request.getResourceResolver().getResource(localizedVariationPath);

        return localizedVariationResource != null ? localizedVariationPath : path;
    }
}
