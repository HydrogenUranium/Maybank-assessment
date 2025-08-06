package com.dhl.discover.core.models;

import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.services.PageUtilService;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.day.cq.commons.jcr.JcrConstants.JCR_TITLE;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class LanguageVariants {
	@ScriptVariable
	private Page currentPage;

	@SlingObject
	private ResourceResolver resourceResolver;

	@OSGiService
	private PageUtilService pageUtilService;

	private HashMap<String, ArrayList<LanguageVariant>> variants;

	private Map<String, LanguageVariant> countries;

	@Getter
	private String currentRegionCode;

	private String currentRegion;
	private List<LanguageVariant> languageVariantsList;
	private List<LinkVariant> allLanguageVariants;
	private List<List<LinkVariant>> allLanguageVariantsGrouped;

	public boolean hasMultipleLanguageVariants() {
		var count = 0;
		for (Entry<String, ArrayList<LanguageVariant>> entry : variants.entrySet()) {
			count += entry.getValue().size();
			if (count > 1) {
				return true;
			}
		}
		return false;
	}

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

	public List<LinkVariant> getAllLanguageVariants() {
		if (allLanguageVariants == null) {
			allLanguageVariants = new ArrayList<>();

			for (Entry<String, ArrayList<LanguageVariant>> entry : variants.entrySet()) {
				includeAllLanguageVariants(entry, allLanguageVariants);
			}
		}

		allLanguageVariants.sort(new LanguageVariantNameSorter());
		return new ArrayList<>(allLanguageVariants);
	}

	private void includeAllLanguageVariants(Entry<String, ArrayList<LanguageVariant>> entry, List<LinkVariant> allLanguageVariants) {
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

	@PostConstruct
    protected void init() {
		variants = new HashMap<>();
		countries = new HashMap<>();

        var currentHome = pageUtilService.getHomePage(currentPage);
        String currentCountryCode = pageUtilService.getCountryCodeByPagePath(currentPage);
		String currentHomePath = currentHome != null ? currentHome.getPath() : StringUtils.EMPTY;
		String path = currentPage.getPath();

        List<Page> homePages = pageUtilService.getAllHomePages(resourceResolver);
        for (Page homepage : homePages) {
            ValueMap homepageProperties = homepage.getProperties();
            boolean hideInNav = homepageProperties.get("hideInNav", false);
            String region = homepageProperties.get("siteregion", "").trim();
            String language = homepageProperties.get("sitelanguage", "").trim();
            String title = homepageProperties.get(JCR_TITLE, "").trim();
            String langCode = homepage.getLanguage().toLanguageTag();

            boolean enabled = homepageProperties.get("siteenabled", false);
            boolean deflt = homepageProperties.get("sitedefault", false);
            if (hideInNav || !enabled || region.isEmpty()) {
                continue;
            }

            String newHomepage = homepage.getPath();
            String newExactPath = homepage.getPath();
            var exactPathExists = true;

			if (!StringUtils.isBlank(currentHomePath)) {
				newExactPath = path.replace(currentHomePath, newHomepage);
				boolean isValidPath = Optional.ofNullable(pageUtilService.getPage(newExactPath, resourceResolver))
						.map(Page::getContentResource)
						.isPresent();

				if (!isValidPath) {
					newExactPath = newHomepage;
				}
			}

			var newItem = LanguageVariant.builder()
					.name(language)
					.title(title)
					.home(newHomepage)
					.link(newExactPath)
					.langCode(langCode)
					.deflt(deflt)
					.current(path.contains(homepage.getPath()))
					.exact(exactPathExists)
					.build();
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
		if (!StringUtils.isBlank(countryCode) && countryCode.equals("global") && !countries.containsKey("aa") && deflt) {
			newItem.setRegion(region);
			countries.put(countryCode.equals("global") ? "aa" : countryCode, newItem);
		}
		else if (!StringUtils.isBlank(countryCode) && !countryCode.equals(currentCountryCode) && !countryCode.equals("global") && (!countries.containsKey(countryCode) || deflt)) {
			newItem.setRegion(region);
			countries.put(countryCode, newItem);
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

	public Map<String, String> getSpecificCountries() {
		return Map.of(
				"tw","Taiwan",
				"hk","Hong Kong",
				"mo", "Macau");
	}


}