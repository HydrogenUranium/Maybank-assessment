package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.positive.dhl.core.services.PageUtilService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map.Entry;

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

	private String currentRegion;
	private String currentLanguage;
	private ArrayList<LanguageVariant> languageVariants;
	private ArrayList<LinkVariant> allLanguageVariants;
	private ArrayList<ArrayList<LinkVariant>> allLanguageVariantsGrouped;
	
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
				if (variant.getCurrent()) {
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
				if (variant.getCurrent()) {
					currentLanguage = variant.getAcceptLanguages().trim();
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
		if (languageVariants == null) {
			languageVariants = new ArrayList<>();
			
			for (Entry<String, ArrayList<LanguageVariant>> entry : variants.entrySet()) {
				for (LanguageVariant variant: entry.getValue()) {
					if (variant.getCurrent()) {
						languageVariants = entry.getValue();
						languageVariants.sort(new LanguageVariantSorter());
						return new ArrayList<>(languageVariants);
					}
				}
			}
		}
		return new ArrayList<>(languageVariants);
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
				v.addProperty("languages", variant.getAcceptLanguages());
				
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
					if (variant.getDeflt()) {
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
	public List<ArrayList<LinkVariant>> getAllLanguageVariantsGrouped() {
		if (allLanguageVariantsGrouped == null) {
			allLanguageVariantsGrouped = new ArrayList<>();

			ArrayList<LinkVariant> group = new ArrayList<>();
			ArrayList<LinkVariant> all = this.getAllLanguageVariants();
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

		Page root = currentPage.getAbsoluteParent(1);
		Page currentHome = pageUtilService.getHomePage(currentPage);
		String path = currentPage.getPath();

		if (root == null) {
			return;
		}

		List<Page> homePages = pageUtilService.getAllHomePages(root);
		for (Page homepage : homePages) {
			ValueMap homepageProperties = homepage.adaptTo(ValueMap.class);
			if ((homepageProperties != null) && ("dhl/components/pages/home").equals(homepageProperties.get("jcr:content/sling:resourceType", ""))) {
				boolean hideInNav = homepageProperties.get("jcr:content/hideInNav", false);
				if (hideInNav) {
					continue;
				}

				String region = homepageProperties.get("jcr:content/siteregion", "").trim();
				String language = homepageProperties.get("jcr:content/sitelanguage", "").trim();
				String acceptlanguages = homepageProperties.get("jcr:content/acceptlanguages", "").trim();
				Boolean enabled = homepageProperties.get("jcr:content/siteenabled", false);
				Boolean deflt = homepageProperties.get("jcr:content/sitedefault", false);
				if ((!enabled) || (region.equals(""))) {
					continue;
				}

				String newHomepage = homepage.getPath();
				String newExactPath = homepage.getPath();
				boolean exactPathExists = true;

				if (currentHome != null) {
					newExactPath = path.replace(currentHome.getPath(), newHomepage);
					Resource resource = resourceResolver.getResource(newExactPath);
					exactPathExists = (resource != null);

					if (!exactPathExists) {
						newExactPath = newHomepage;
					}
				}
				
				LanguageVariant newItem = new LanguageVariant(language, newHomepage, newExactPath, acceptlanguages, deflt, path.contains(homepage.getPath()), exactPathExists);
				if (!variants.containsKey(region)) {
					ArrayList<LanguageVariant> languages = new ArrayList<>();
					variants.put(region, languages);
				}
				
				ArrayList<LanguageVariant> languages = variants.get(region);
				languages.add(newItem);
			}
		}
	}
}