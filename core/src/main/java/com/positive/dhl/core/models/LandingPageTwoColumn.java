package com.positive.dhl.core.models;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import com.positive.dhl.core.services.PageUtilService;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import com.day.cq.wcm.api.Page;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import static com.day.cq.wcm.api.constants.NameConstants.PN_NAV_TITLE;
import static com.day.cq.wcm.api.constants.NameConstants.PN_TITLE;

@Getter
@Setter
@Model(adaptables=SlingHttpServletRequest.class)
public class LandingPageTwoColumn {
	@OSGiService
	private PageUtilService pageUtilService;

	@Inject
	private ResourceResolver resourceResolver;
	
	@Inject
	private Page currentPage;
	
	private String fullTitle;
	private String title;
	private String herosubtitle;
	private String heroimagemob;
	private String heroimagetab;
	private String heroimagedt;
	private String shipNowMessage;
	private String shipNowUrl;
	private String preselectedCountry;
	private List<Article> relatedArticles;
	
	@PostConstruct
    protected void init() {
		shipNowUrl = pageUtilService.getCountryCodeByPagePath(currentPage).equals("gb")
				? "https://webshipping.dhl.com" : "https://parcel.dhl.co.uk/";

		ValueMap properties = currentPage.getProperties();
	    if (!properties.isEmpty()) {
			fullTitle = properties.get(PN_TITLE, StringUtils.EMPTY);
			title = properties.get(PN_NAV_TITLE, StringUtils.EMPTY);
			if (StringUtils.isBlank(title)) {
				title = fullTitle;
			}

			herosubtitle = properties.get("herosubtitle", StringUtils.EMPTY);
			heroimagemob = properties.get("heroimagemob", StringUtils.EMPTY);
			heroimagetab = properties.get("heroimagetab", StringUtils.EMPTY);
			heroimagedt = properties.get("heroimagedt", StringUtils.EMPTY);

			shipNowMessage = properties.get("shipnowmessage", StringUtils.EMPTY);
			shipNowUrl = properties.get("shipnowurl", StringUtils.EMPTY);
			preselectedCountry = properties.get("preselectedcountry", StringUtils.EMPTY);
		}
	    
	    relatedArticles = new ArrayList<>();
		
		Resource relatedArticlePaths = currentPage.getContentResource("items");
		if (relatedArticlePaths != null) {
			Iterator<Resource> relatedArticlePathsIterator = relatedArticlePaths.listChildren();
			while (relatedArticlePathsIterator.hasNext()) {
				ValueMap props = relatedArticlePathsIterator.next().adaptTo(ValueMap.class);
				if (props != null) {
					String url = props.get("url", StringUtils.EMPTY);
					
					Article article = pageUtilService.getArticle(url, resourceResolver);
					relatedArticles.add(article);
				}
			}
		}
	}
}
