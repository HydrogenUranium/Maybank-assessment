package com.positive.dhl.core.models;

import com.positive.dhl.core.injectors.InjectAsset;
import com.positive.dhl.core.injectors.InjectHomeProperty;
import com.positive.dhl.core.services.PathUtilService;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class})
public class CtaBannerWithPoints {

    @OSGiService
    private PathUtilService pathUtilService;

    @ChildResource
    @Named("points")
    @Optional
    private Resource pointsMultifield;

    @InjectHomeProperty
    @Named("multifields/ctaBanner-subscribeToOurNewsletter-points")
    @Optional
    private Resource pointsMultifieldSubscribe;

    @InjectHomeProperty
    @Named("multifields/ctaBanner-openBusinessAccount-points")
    @Optional
    private Resource pointsMultifieldOpenBusinessAccount;

    @Inject
    @Optional
    @Default(values = "custom")
    private String type;

    @Inject
    @Optional
    @Getter
    private String title;

    @InjectHomeProperty
    @Named("ctaBanner-subscribeToOurNewsletter-title")
    @Optional
    private String titleSubscribe;

    @InjectHomeProperty
    @Named("ctaBanner-openBusinessAccount-title")
    @Optional
    private String titleOpenBusinessAccount;

    @InjectAsset
    @Getter
    @Optional
    private String mobileBackgroundImage;

    @InjectHomeProperty
    @Named("ctaBanner-subscribeToOurNewsletter-mobileBackgroundImage")
    @Optional
    private String mobileBackgroundImageSubscribe;

    @InjectHomeProperty
    @Named("ctaBanner-openBusinessAccount-mobileBackgroundImage")
    @Optional
    private String mobileBackgroundImageOpenBusinessAccount;

    @InjectAsset
    @Getter
    @Optional
    private String tabletBackgroundImage;

    @InjectHomeProperty
    @Named("ctaBanner-subscribeToOurNewsletter-tabletBackgroundImage")
    @Optional
    private String tabletBackgroundImageSubscribe;

    @InjectHomeProperty
    @Named("ctaBanner-openBusinessAccount-tabletBackgroundImage")
    @Optional
    private String tabletBackgroundImageOpenBusinessAccount;

    @InjectAsset
    @Getter
    @Optional
    private String desktopBackgroundImage;

    @InjectHomeProperty
    @Named("ctaBanner-subscribeToOurNewsletter-desktopBackgroundImage")
    @Optional
    private String desktopBackgroundImageSubscribe;

    @InjectHomeProperty
    @Named("ctaBanner-openBusinessAccount-desktopBackgroundImage")
    @Optional
    private String desktopBackgroundImageOpenBusinessAccount;

    @Inject
    @Getter
    @Optional
    private String buttonName;

    @InjectHomeProperty
    @Named("ctaBanner-subscribeToOurNewsletter-buttonName")
    @Optional
    private String buttonNameSubscribe;

    @InjectHomeProperty
    @Named("ctaBanner-openBusinessAccount-buttonName")
    @Optional
    private String buttonNameOpenBusinessAccount;

    @Inject
    @Getter
    @Optional
    private String buttonLink;

    @InjectHomeProperty
    @Named("ctaBanner-subscribeToOurNewsletter-buttonLink")
    @Optional
    private String buttonLinkSubscribe;

    @InjectHomeProperty
    @Named("ctaBanner-openBusinessAccount-buttonLink")
    @Optional
    private String buttonLinkOpenBusinessAccount;

    @Getter
    private final String id = "cta-banner_" + UUID.randomUUID();

    @Getter
    private List<String> points = new ArrayList<>();

    @PostConstruct
    protected void init() {
        switch (type) {
            case ("businessAccount"):
                initOpenBusinessAccount();
                break;
            case ("subscribeNewsletter"):
                initSubscribe();
                break;
            default:
                initCustom();
        }
    }

    private void initCustom() {
        points = extractPoints(pointsMultifield);
    }

    private void initSubscribe() {
        title = titleSubscribe;
        points = extractPoints(pointsMultifieldSubscribe);
        mobileBackgroundImage = pathUtilService.resolveAssetPath(mobileBackgroundImageSubscribe);
        tabletBackgroundImage = pathUtilService.resolveAssetPath(tabletBackgroundImageSubscribe);
        desktopBackgroundImage = pathUtilService.resolveAssetPath(desktopBackgroundImageSubscribe);
        buttonName = buttonNameSubscribe;
        buttonLink = buttonLinkSubscribe;
    }

    private void initOpenBusinessAccount() {
        title = titleOpenBusinessAccount;
        points = extractPoints(pointsMultifieldOpenBusinessAccount);
        mobileBackgroundImage = pathUtilService.resolveAssetPath(mobileBackgroundImageOpenBusinessAccount);
        tabletBackgroundImage = pathUtilService.resolveAssetPath(tabletBackgroundImageOpenBusinessAccount);
        desktopBackgroundImage = pathUtilService.resolveAssetPath(desktopBackgroundImageOpenBusinessAccount);
        buttonName = buttonNameOpenBusinessAccount;
        buttonLink = buttonLinkOpenBusinessAccount;
    }

    private List<String> extractPoints(Resource pointsMultifield) {
        List<String> list = new ArrayList<>();
        if (pointsMultifield == null) {
            return list;
        }

        Iterator<Resource> multifieldItems = pointsMultifield.listChildren();
        while (multifieldItems.hasNext()) {
            var properties = multifieldItems.next().getValueMap();
            list.add(properties.get("text", ""));
        }
        return list;
    }
}
