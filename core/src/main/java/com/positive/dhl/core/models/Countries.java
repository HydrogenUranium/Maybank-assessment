/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.models;

import com.positive.dhl.core.constants.DiscoverConstants;
import com.positive.dhl.core.services.ResourceResolverHelper;
import lombok.Cleanup;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import java.util.*;
import java.util.stream.Collectors;

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

	public Map<String,String> getCountryNames(){
		Map<String,String> unorderedMap = countryMap.entrySet().stream()
				.filter(e -> e.getValue().getCountryName() != null)
				.collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue().getCountryName()));
		return new TreeMap<>(unorderedMap);
	}

	public Map<String,String> getDialingCodes(){
		Map<String,String> dialingCodesMap = new TreeMap<>();
		countryMap.forEach((key,value) -> dialingCodesMap.put(key,key.toUpperCase(Locale.ROOT) + " (+" + value.getCallingCode() + ")"));
		return dialingCodesMap;
	}

	public Map<String,String> getCountrySelectOptionValues(){
		Map<String,String> optionValuesMap = new TreeMap<>();
		countryMap.forEach((key,value) -> optionValuesMap.put(value.getCountryName() + "|" + key.toUpperCase(Locale.ROOT) + "|" + value.getCurrency(), value.getCountryName() ));
		return optionValuesMap;
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

	/**
	 * Returns country name based on the country code
	 * @param country is a JCR Node representing the country code we want to find
	 * @return String representing the country name (as exists in the repository) or {@code null} in case it doesn't exist
	 */
	public String getCountryName(Node country) throws RepositoryException {
			Resource resource = resourceResolverHelper.getReadResourceResolver().getResource(country.getName());
			if(null != resource){
				Country ctry = resource.adaptTo(Country.class);
				if(null != ctry){
					return ctry.getCountryName();
				}
			}
			return null;
	}

	/**
	 * Returns the international calling code based on the country code
	 *
	 * @param countryCode is a String representing the country code we want to find
	 * @return String representing the international calling code (as exists in the repository) or number 0 (zero) in case it doesn't exist
	 */
	public String getDialingCode(String countryCode){
		if(countryMap.containsKey(countryCode)){
			return "+" + countryMap.get(countryCode).getCallingCode();
		}
		return "0";
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
