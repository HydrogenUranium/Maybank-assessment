package com.dhl.discover.core.models;

import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.services.PageUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ExperienceFragmentLocalizationTest {

    private final AemContext context = new AemContext();

    @Mock
    private PageUtilService pageUtilService;

    @BeforeEach
    void init() {
        context.registerService(PageUtilService.class, pageUtilService);
        context.addModelsForClasses(ExperienceFragmentLocalization.class);
        context.load().json("/com/dhl/discover/core/models/ExperienceFragmentLocalization/page.json", "/content/dhl/global");
        context.load().json("/com/dhl/discover/core/models/ExperienceFragmentLocalization/fragments.json", "/content/experience-fragments/dhl");
        Page page = context.pageManager().getPage("/content/dhl/global/en-global");
        context.currentPage(page);
        when(pageUtilService.getHomePage(any(Page.class))).thenReturn(page);

    }

    @Test
    void getLocalizedPath_shouldReturnLocalised_whenLocalizedExist() {
        context.request().setAttribute("path",
                "/content/experience-fragments/dhl/language-masters/en-master/banners/newsletter-subscription/master");
        ExperienceFragmentLocalization model = context.request().adaptTo(ExperienceFragmentLocalization.class);

        String result = model.getLocalizedPath();

        assertEquals("/content/experience-fragments/dhl/global/en-global/banners/newsletter-subscription/master", result);
    }

    @Test
    void getLocalizedPath_shouldReturnOriginal_whenLocalizedNotExist() {
        context.request().setAttribute("path",
                "/content/experience-fragments/dhl/language-masters/en-master/banners/newsletter-subscription/banner");
        ExperienceFragmentLocalization model = context.request().adaptTo(ExperienceFragmentLocalization.class);

        String result = model.getLocalizedPath();

        assertEquals("/content/experience-fragments/dhl/language-masters/en-master/banners/newsletter-subscription/banner", result);
    }

}