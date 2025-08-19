package com.dhl.discover.core.models;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;

import com.dhl.discover.core.services.ArticleUtilService;
import com.dhl.discover.core.services.PathUtilService;
import lombok.Getter;
import lombok.Setter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import com.day.cq.wcm.api.Page;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class)
@Getter
@Setter
public class LandingPageTwoColumn {
	@OSGiService
	private PathUtilService pathUtilService;

	@Self
	private SlingHttpServletRequest request;

	@OSGiService
	private ArticleUtilService articleUtilService;

	@ScriptVariable
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


	public List<Article> getRelatedArticles() {
		return new ArrayList<>(relatedArticles);
	}

	public void setRelatedArticles(List<Article> relatedArticles) {
		this.relatedArticles = new ArrayList<>(relatedArticles);
	}

	@PostConstruct
    protected void init() {
		shipNowUrl = "https://webshipping.dhl.com";

		//HACK!
		if (currentPage.getPath().contains("-uk")) {
			shipNowUrl = "https://parcel.dhl.co.uk/";
		}

		ValueMap properties = currentPage.adaptTo(ValueMap.class);
	    if (properties != null) {
			fullTitle = properties.get("jcr:content/jcr:title", "");
			title = properties.get("jcr:content/navTitle", "");
			if (title.trim().length() == 0) {
				title = fullTitle;
			}

			herosubtitle = properties.get("jcr:content/herosubtitle", "");
			heroimagemob = properties.get("jcr:content/heroimagemob", "");
			heroimagetab = properties.get("jcr:content/heroimagetab", "");
			heroimagedt = properties.get("jcr:content/heroimagedt", "");

			shipNowMessage = properties.get("jcr:content/shipnowmessage", "");
			shipNowUrl = properties.get("jcr:content/shipnowurl", "");
			preselectedCountry = properties.get("jcr:content/preselectedcountry", "");
		}
	    
	    relatedArticles = new ArrayList<>();
		
		Resource relatedArticlePaths = currentPage.getContentResource("items");
		if (relatedArticlePaths != null) {
			Iterator<Resource> relatedArticlePathsIterator = relatedArticlePaths.listChildren();
			while (relatedArticlePathsIterator.hasNext()) {
				ValueMap props = relatedArticlePathsIterator.next().adaptTo(ValueMap.class);
				if (props != null) {
					String url = props.get("url", "");
					
					var article = articleUtilService.getArticle(url, request);
					if (article != null) {
						relatedArticles.add(article);
					}
				}
			}
		}
	}
}