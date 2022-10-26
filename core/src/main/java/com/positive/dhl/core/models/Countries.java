/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.services;

import com.positive.dhl.core.constants.DiscoverConstants;
import com.positive.dhl.core.models.Country;
import lombok.Cleanup;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import java.util.Map;
import java.util.Objects;
import java.util.TreeMap;

@Model(
		adaptables = {
				Resource.class,
				SlingHttpServletRequest.class }
)
public class Countries {

	private static final Logger LOGGER = LoggerFactory.getLogger(Countries.class);

	private final Map<String,Country> countryMap = new TreeMap<>();

	@OSGiService
	private ResourceResolverHelper resourceResolverHelper;

	@PostConstruct
	public void start(){
		populateCountryMap();
	}

	private ResourceResolver getResourceResolver(){
		return Objects.requireNonNull(resourceResolverHelper).getReadResourceResolver();
	}

	/**
	 * Returns all countries
	 * @return a {@code Map} with 'country code' as {@code key} and {@link Country} object as {@code value}
	 */
	public Map<String,Country> getCountries(){
		if(LOGGER.isDebugEnabled()){
				int countries = countryMap.size();
		    LOGGER.debug("Map of all countries contains {} countries.", countries);
		}
		return countryMap;
	}

	/**
	 * Returns specific country identified by its 'country code'
	 * @param countryCode is a String that represents the country-code
	 * @return an instance of {@link Country} object that represents the country associated with the provided country code or {@code null} if there's no such
	 * country
	 */
	public Country getCountry(String countryCode){
		if(LOGGER.isDebugEnabled()){
		    LOGGER.debug("Trying to get a Country object linked to {} country-code", countryCode);
		}
		if(countryMap.containsKey(countryCode)){
			return countryMap.get(countryCode);
		}
		LOGGER.error("Unable to get the country related to country code {}. Returning null...", countryCode);
		return null;
	}

	private void populateCountryMap(){
		@Cleanup ResourceResolver resourceResolver = getResourceResolver();
		Resource resource = resourceResolver.getResource(DiscoverConstants.DISCOVER_COUNTRIES_LOCATION);
		if(null != resource){
			Iterable<Resource> resourceIterator = resource.getChildren();
			for (Resource item : resourceIterator) {
				Country country = item.adaptTo(Country.class);
				countryMap.put(item.getName(),country);
			}
		}
	}

}
