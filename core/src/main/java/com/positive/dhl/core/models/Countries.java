package com.positive.dhl.core.models;

import com.positive.dhl.core.components.EnvironmentConfiguration;
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
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.TreeMap;
import java.util.stream.Collectors;


/**
 * Countries is a <a href="https://sling.apache.org/documentation/bundles/models.html">Sling Model</a>
 * class (adaptable from {@link Resource} & {@link SlingHttpServletRequest}) that provides access
 * to
 * country information
 */
@Model(
		adaptables = {
				Resource.class,
				SlingHttpServletRequest.class }
)
public class Countries {

	private static final Logger LOGGER = LoggerFactory.getLogger(Countries.class);

	private final Map<String,Country> countryMap = new TreeMap<>();
	private final Map<String,String> dialingCodesMap = new TreeMap<>();
	private final Map<String,String> optionValuesMap = new TreeMap<>();

	@OSGiService
	private ResourceResolverHelper resourceResolverHelper;

	@OSGiService
	private EnvironmentConfiguration environmentConfiguration;

	/**
	 * Init method, populates the map of countries on model's load
	 */
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

	/**
	 * Method that returns the international dialing codes as a {@link Map} of country code as {@code key} and concatenated
	 * string of uppercase country code with the actual international dialing code
	 * as {@code value}
	 * @return a Map of dialing codes
	 */
	public Map<String,String> getDialingCodes(){
		if(dialingCodesMap.isEmpty()){
			if(LOGGER.isDebugEnabled()){
			    LOGGER.debug("Populating a map of dialing codes as it's empty");
			}
			countryMap.forEach((key,value) -> dialingCodesMap.put(key.toUpperCase(Locale.ROOT) +
					" (+" + value.getCallingCode() + ")", String.valueOf(value.getCallingCode())));
		}

		return dialingCodesMap;
	}

	/**
	 * Provides the ordered {@link Map} of country code as {@code key} and country name as {@code value}
	 * @return a Map representing the country codes & their names
	 */
	public Map<String,String> getCountrySelectOptionValues(){
		if(optionValuesMap.isEmpty()){
			countryMap.forEach((key,value) -> optionValuesMap.put(value.getCountryName() +
					"|" + key.toUpperCase(Locale.ROOT) + "|" + value.getCurrency(), value.getCountryName() ));
		}
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
	 * @return String representing the country name (as exists in the repository) or {@code null} in case it doesn't exist.
	 * @throws RepositoryException is thrown in case a problem occurred when accessing the repository's properties
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
		Resource resource = resourceResolver.getResource(environmentConfiguration.getCountryInfoLocation());
		if(null != resource){
			Iterable<Resource> resourceIterator = resource.getChildren();
			for (Resource item : resourceIterator) {
				Country country = item.adaptTo(Country.class);
				countryMap.put(item.getName(),country);
			}
		}
	}

}
