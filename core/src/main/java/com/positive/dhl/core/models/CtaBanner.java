package com.positive.dhl.core.models;

import com.positive.dhl.core.injectors.InjectAsset;
import com.positive.dhl.core.injectors.InjectHomeProperty;
import com.positive.dhl.core.services.AssetUtilService;
import lombok.Getter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

@Model(adaptables = Resource.class)
public class CtaBanner {

    @OSGiService
    private AssetUtilService assetUtils;

    @Inject
    @Named("points")
    @Optional
    private Resource pointsMultifield;

    @InjectHomeProperty
    @Named("ctaBannerSubscribeToOurNewsletter-points")
    @Optional
    private Resource pointsMultifieldSubscribe;

    @InjectHomeProperty
    @Named("ctaBannerOpenBusinessAccount-points")
    @Optional
    private Resource pointsMultifieldOpenBusinessAccount;

    @Inject
    @Optional
    @Getter
    private String style;


    @Inject
    @Optional
    @Default(values = "custom")
    private String type;

    @Inject
    @Optional
    @Getter
    private String title;

    @InjectHomeProperty
    @Named("ctaBannerSubscribeToOurNewsletter-title")
    @Optional
    private String titleSubscribe;

    @InjectHomeProperty
    @Named("ctaBannerOpenBusinessAccount-title")
    @Optional
    private String titleOpenBusinessAccount;

    @InjectAsset
    @Getter
    @Optional
    private String mobileBackgroundImage;

    @InjectHomeProperty
    @Named("ctaBannerSubscribeToOurNewsletter-mobileBackgroundImage")
    @Optional
    private String mobileBackgroundImageSubscribe;

    @InjectHomeProperty
    @Named("ctaBannerOpenBusinessAccount-mobileBackgroundImage")
    @Optional
    private String mobileBackgroundImageOpenBusinessAccount;

    @InjectAsset
    @Getter
    @Optional
    private String tabletBackgroundImage;

    @InjectHomeProperty
    @Named("ctaBannerSubscribeToOurNewsletter-tabletBackgroundImage")
    @Optional
    private String tabletBackgroundImageSubscribe;

    @InjectHomeProperty
    @Named("ctaBannerOpenBusinessAccount-tabletBackgroundImage")
    @Optional
    private String tabletBackgroundImageOpenBusinessAccount;

    @InjectAsset
    @Getter
    @Optional
    private String desktopBackgroundImage;

    @InjectHomeProperty
    @Named("ctaBannerSubscribeToOurNewsletter-desktopBackgroundImage")
    @Optional
    private String desktopBackgroundImageSubscribe;

    @InjectHomeProperty
    @Named("ctaBannerOpenBusinessAccount-desktopBackgroundImage")
    @Optional
    private String desktopBackgroundImageOpenBusinessAccount;


    @Inject
    @Getter
    @Optional
    private String buttonName;

    @InjectHomeProperty
    @Named("ctaBannerSubscribeToOurNewsletter-buttonName")
    @Optional
    private String buttonNameSubscribe;

    @InjectHomeProperty
    @Named("ctaBannerOpenBusinessAccount-buttonName")
    @Optional
    private String buttonNameOpenBusinessAccount;

    @Inject
    @Getter
    @Optional
    private String buttonLink;

    @InjectHomeProperty
    @Named("ctaBannerSubscribeToOurNewsletter-buttonLink")
    @Optional
    private String buttonLinkSubscribe;

    @InjectHomeProperty
    @Named("ctaBannerOpenBusinessAccount-buttonLink")
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
        mobileBackgroundImage = assetUtils.resolvePath(mobileBackgroundImageSubscribe);
        tabletBackgroundImage = assetUtils.resolvePath(tabletBackgroundImageSubscribe);
        desktopBackgroundImage = assetUtils.resolvePath(desktopBackgroundImageSubscribe);
        buttonName = buttonNameSubscribe;
        buttonLink = buttonLinkSubscribe;
    }

    private void initOpenBusinessAccount() {
        title = titleOpenBusinessAccount;
        points = extractPoints(pointsMultifieldOpenBusinessAccount);
        mobileBackgroundImage = assetUtils.resolvePath(mobileBackgroundImageOpenBusinessAccount);
        tabletBackgroundImage = assetUtils.resolvePath(tabletBackgroundImageOpenBusinessAccount);
        desktopBackgroundImage = assetUtils.resolvePath(desktopBackgroundImageOpenBusinessAccount);
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
            list.add(properties.get("point", ""));
        }
        return list;
    }
}
