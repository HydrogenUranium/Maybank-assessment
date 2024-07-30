package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.positive.dhl.core.services.PageUtilService;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.*;
import java.util.Map.Entry;
import java.util.stream.Collectors;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class LanguageVariants {
	@Inject
	private Page currentPage;

	@Inject
	private ResourceResolver resourceResolver;

	@OSGiService
	private PageUtilService pageUtilService;

	private HashMap<String, ArrayList<LanguageVariant>> variants;

	private Map<String, LanguageVariant> countries;

	@Getter
	private String currentRegionCode;

	private String currentRegion;
	private String currentLanguage;
	private List<LanguageVariant> languageVariantsList;
	private List<LinkVariant> allLanguageVariants;
	private List<List<LinkVariant>> allLanguageVariantsGrouped;
	
	/**
	 *
	 */
	public boolean hasMultipleLanguageVariants() {
		int count = 0;
		for (Entry<String, ArrayList<LanguageVariant>> entry : variants.entrySet()) {
			count += entry.getValue().size();
			if (count > 1) {
				return true;
			}
		}
		return false;
	}
	
	/**
	 *
	 */
	public String getCurrentRegion() {
		if (currentRegion != null) {
			return currentRegion;
		}
		
		// this statement forces the language selection menu to NOT appear if there is only
		// one single language variant defined
		if (!this.hasMultipleLanguageVariants()) {
			currentRegion = "";
			return currentRegion;
		}
		
		for (Entry<String, ArrayList<LanguageVariant>> entry : variants.entrySet()) {
			for (LanguageVariant variant: entry.getValue()) {
				if (variant.isCurrent()) {
					currentRegion = entry.getKey();
					return currentRegion;
				}
			}
		}
		
		return "";
	}
	
	/**
	 *
	 */
	public String getCurrentLanguage() {
		if (currentLanguage != null) {
			return currentLanguage;
		}
		
		for (Entry<String, ArrayList<LanguageVariant>> entry : variants.entrySet()) {
			for (LanguageVariant variant: entry.getValue()) {
				if (variant.isCurrent()) {
					currentLanguage = variant.getAcceptlanguages().trim();
					if (("*").equals(currentLanguage)) {
						currentLanguage = "en";
					}
					return currentLanguage;
				}
			}
		}
		
		return "en";
	}
	
	/**
	 *
	 */
	public List<LanguageVariant> getLanguageVariants() {
		if (languageVariantsList == null) {
			languageVariantsList = new ArrayList<>();
			
			for (Entry<String, ArrayList<LanguageVariant>> entry : variants.entrySet()) {
				for (LanguageVariant variant: entry.getValue()) {
					if (variant.isCurrent()) {
						languageVariantsList = entry.getValue();
						languageVariantsList.sort(new LanguageVariantSorter());
						return new ArrayList<>(languageVariantsList);
					}
				}
			}
		}
		return new ArrayList<>(languageVariantsList);
	}
	
	/**
	 *
	 */
	public String getAllLanguagesJSON() {
		JsonObject json = new JsonObject();
		JsonArray jsonVariants = new JsonArray();
		for (Entry<String, ArrayList<LanguageVariant>> entry : variants.entrySet()) {
			for (LanguageVariant variant: entry.getValue()) {
				JsonObject v = new JsonObject();
				v.addProperty("path", variant.getLink());
				v.addProperty("languages", variant.getAcceptlanguages());
				
				jsonVariants.add(v);
			}
		}
		
		json.add("variants", jsonVariants);
		return json.toString();
	}
	
	/**
	 *
	 */
	public List<LinkVariant> getAllLanguageVariants() {
		if (allLanguageVariants == null) {
			allLanguageVariants = new ArrayList<>();
	
			for (Entry<String, ArrayList<LanguageVariant>> entry : variants.entrySet()) {
				boolean found = false;
				LanguageVariant first = null;
				for (LanguageVariant variant: entry.getValue()) {
					if (variant.isDeflt()) {
						found = true;
						allLanguageVariants.add(new LinkVariant(entry.getKey(), variant.getLink(), variant.getHome()));
						break;
					}
					
					if (first == null) {
						first = variant;
					}
				}
				
				if ((!found) && (first != null)) {
					allLanguageVariants.add(new LinkVariant(entry.getKey(), first.getLink(), first.getHome()));
				}
			}
		}
		
		allLanguageVariants.sort(new LanguageVariantNameSorter());
		return new ArrayList<>(allLanguageVariants);
	}
	
	/**
	 *
	 */
	public List<List<LinkVariant>> getAllLanguageVariantsGrouped() {
		if (allLanguageVariantsGrouped == null) {
			allLanguageVariantsGrouped = new ArrayList<>();

			List<LinkVariant> group = new ArrayList<>();
			List<LinkVariant> all = this.getAllLanguageVariants();
			for (LinkVariant item: all) {
				group.add(item);

				if (group.size() >= 3) {
					allLanguageVariantsGrouped.add(group);
					group = new ArrayList<>();
				}
			}

			if (!group.isEmpty()) {
				allLanguageVariantsGrouped.add(group);
			}
		}
		
		return new ArrayList<>(allLanguageVariantsGrouped);
	}

    /**
	 * 
	 */
	@PostConstruct
    protected void init() {
		variants = new HashMap<>();
		countries = new HashMap<>();

		Page root = currentPage.getAbsoluteParent(1);
        Page currentHome = pageUtilService.getHomePage(currentPage);
        String currentCountryCode = pageUtilService.getCountryCodeByPagePath(currentPage);
		String currentHomePath = currentHome != null ? currentHome.getPath() : StringUtils.EMPTY;
		String path = currentPage.getPath();

		if (root == null) {
			return;
		}

        List<Page> homePages = pageUtilService.getAllHomePages(root);
        for (Page homepage : homePages) {
            ValueMap homepageProperties = homepage.getProperties();
            boolean hideInNav = homepageProperties.get("hideInNav", false);
            String region = homepageProperties.get("siteregion", "").trim();
            String language = homepageProperties.get("sitelanguage", "").trim();
            String title = homepageProperties.get("jcr:title", "").trim();
            String acceptlanguages = homepageProperties.get("acceptlanguages", "*").trim();
			if(acceptlanguages.equals("*")) {
				acceptlanguages = homepageProperties.get("jcr:language", "*").trim();
			}
            boolean enabled = homepageProperties.get("siteenabled", false);
            boolean deflt = homepageProperties.get("sitedefault", false);
            if (hideInNav || !enabled || region.equals("")) {
                continue;
            }

            String newHomepage = homepage.getPath();
            String newExactPath = homepage.getPath();
            boolean exactPathExists = true;

			if (!StringUtils.isBlank(currentHomePath)) {
				newExactPath = path.replace(currentHomePath, newHomepage);
				Resource resource = resourceResolver.getResource(newExactPath);
				exactPathExists = (resource != null);

				if (!exactPathExists) {
					newExactPath = newHomepage;
				}
			}

			LanguageVariant newItem = new LanguageVariant(language, title, newHomepage, newExactPath, acceptlanguages, deflt, path.contains(homepage.getPath()), exactPathExists);
			if (!variants.containsKey(region)) {
				ArrayList<LanguageVariant> languages = new ArrayList<>();
				variants.put(region, languages);
			}

			ArrayList<LanguageVariant> languages = variants.get(region);
			languages.add(newItem);

			String countryCode = pageUtilService.getCountryCodeByPagePath(homepage);
			setCountries(countryCode, currentCountryCode, deflt, region, newItem);
			setCurrentRegionCode(currentHomePath, newHomepage, countryCode);
		}
	}

	private void setCountries(String countryCode, String currentCountryCode, boolean deflt, String region, LanguageVariant newItem) {
		if (!StringUtils.isBlank(countryCode) && !countryCode.equals(currentCountryCode) && (!countries.containsKey(countryCode) || deflt)) {
			newItem.setRegion(region);
			countries.put(countryCode.equals("global") ? "aa" : countryCode, newItem);
		}
	}

	public Map<String, LanguageVariant> getCountries() {
		Map<String, LanguageVariant> countriesOrderedByRegionWithGlobalOnFirstPosition = getCountriesOrderedByRegion();
		Map<String, LanguageVariant> copy = new LinkedHashMap<>(countriesOrderedByRegionWithGlobalOnFirstPosition);
		countriesOrderedByRegionWithGlobalOnFirstPosition.keySet().retainAll(Collections.singleton("aa"));
		countriesOrderedByRegionWithGlobalOnFirstPosition.putAll(copy);
		return countriesOrderedByRegionWithGlobalOnFirstPosition;
	}

	private Map<String, LanguageVariant> getCountriesOrderedByRegion() {
		return countries.entrySet().stream()
				.sorted(Map.Entry.comparingByValue(Comparator.comparing(LanguageVariant::getRegion)))
				.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));
	}

	private void setCurrentRegionCode(String currentHomePath, String newHomepage, String countryCode) {
		if (currentHomePath.equals(newHomepage)) {
			currentRegionCode = countryCode;
		}
	}
}