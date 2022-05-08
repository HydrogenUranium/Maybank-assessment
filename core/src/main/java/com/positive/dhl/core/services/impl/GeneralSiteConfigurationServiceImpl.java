package com.positive.dhl.core.services.impl;

import com.positive.dhl.core.components.GeneralSiteComponentConfig;
import com.positive.dhl.core.services.GeneralSiteConfigurationService;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component(
    service = GeneralSiteConfigurationService.class,
    immediate = true,
    property = {
        Constants.SERVICE_ID + "=General Site Configuration Service",
        Constants.SERVICE_DESCRIPTION + "=This service reads values from General Site Configuration"
    })
@Designate(ocd = GeneralSiteComponentConfig.class)
public class GeneralSiteConfigurationServiceImpl implements GeneralSiteConfigurationService {

    private static final String TAG = GeneralSiteConfigurationServiceImpl.class.getSimpleName();
    private static final Logger LOGGER = LoggerFactory.getLogger(GeneralSiteConfigurationServiceImpl.class);

    private GeneralSiteComponentConfig generalSiteComponentConfig;

    @Activate
    protected void activate(GeneralSiteComponentConfig generalSiteComponentConfig) {
        this.generalSiteComponentConfig = generalSiteComponentConfig;
    }

    @Override
    public String getAssetprefix() {
        return this.generalSiteComponentConfig.AssetPrefix();
    }
}
