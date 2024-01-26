package com.positive.dhl.core.models;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Required;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.annotation.PostConstruct;
import java.lang.reflect.Field;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Model(adaptables= Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ServicePointLocatorModel {
    @Self
    private Resource resource;

    @ValueMapValue
    private String domain;

    @ValueMapValue
    private String countryCodeQueryParam;
    @ValueMapValue
    private String addressQueryParam;
    @ValueMapValue
    private String servicePointIDQueryParam;
//  @ValueMapValue
//  private String idfQueryParam;
    @ValueMapValue
    private String maxDistanceQueryParam;

    @ValueMapValue
    private String languageQueryParam;
//  @ValueMapValue
//  private String languageCountryCodeQueryParam;
    @ValueMapValue
    private String resultUomQueryParam;

    @ValueMapValue
    private String capabilityQueryParam;

    @ValueMapValue
    private String lengthQueryParam;
    @ValueMapValue
    private String widthQueryParam;
    @ValueMapValue
    private String heightQueryParam;
    @ValueMapValue
    private String dimensionsUomQueryParam;
    @ValueMapValue
    private String weightQueryParam;
    @ValueMapValue
    private String weightUomQueryParam;

    @ValueMapValue
    private String openDayQueryParam;
    @ValueMapValue
    private String openBeforeQueryParam;
    @ValueMapValue
    private String openAfterQueryParam;

//  @ValueMapValue
//  private String clientAppCodeQueryParam;

    @Getter
    private String url;

    @PostConstruct
    protected void init() {
        try {
            url = StringUtils.isBlank(domain)
                    ? StringUtils.EMPTY
                    : new URIBuilder(domain)
                    .addParameters(getQueryParams())
                    .build()
                    .toString();
        } catch (IllegalAccessException | URISyntaxException ex) {
            log.error("An error occurred preparing URL for Service Point Locator", ex);
        }
    }

    public List<NameValuePair> getQueryParams() throws IllegalAccessException {
        List<NameValuePair> queryParams = new ArrayList<>();
        Field[] classFields = this.getClass().getDeclaredFields();
        for (var field : classFields) {
            var fieldName = field.getName();
            if (fieldName.endsWith("QueryParam")) {
                var queryParamName = fieldName.replace("QueryParam", "");
                var queryParamValue = field.get(this);
                if (queryParamValue != null) {
                    queryParams.add(new BasicNameValuePair(queryParamName, queryParamValue.toString()));
                }
            }
        }
        return queryParams;
    }
}
