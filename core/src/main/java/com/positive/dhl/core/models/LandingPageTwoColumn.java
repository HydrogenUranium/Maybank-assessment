package com.positive.dhl.core.models;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import com.day.cq.wcm.api.Page;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class LandingPageTwoColumn {
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
	
    /**
	 * 
	 */
	public String getFullTitle() {
		return fullTitle;
	}

    /**
	 * 
	 */
	public void setFullTitle(String fullTitle) {
		this.fullTitle = fullTitle;
	}

    /**
	 * 
	 */
	public String getTitle() {
		return title;
	}

    /**
	 * 
	 */
	public void setTitle(String title) {
		this.title = title;
	}

    /**
	 * 
	 */
	public String getHerosubtitle() {
		return herosubtitle;
	}

    /**
	 * 
	 */
	public void setHerosubtitle(String herosubtitle) {
		this.herosubtitle = herosubtitle;
	}

    /**
	 * 
	 */
	public String getHeroimagemob() {
		return heroimagemob;
	}

    /**
	 * 
	 */
	public void setHeroimagemob(String heroimagemob) {
		this.heroimagemob = heroimagemob;
	}

    /**
	 * 
	 */
	public String getHeroimagetab() {
		return heroimagetab;
	}

    /**
	 * 
	 */
	public void setHeroimagetab(String heroimagetab) {
		this.heroimagetab = heroimagetab;
	}

    /**
	 * 
	 */
	public String getHeroimagedt() {
		return heroimagedt;
	}

    /**
	 * 
	 */
	public void setHeroimagedt(String heroimagedt) {
		this.heroimagedt = heroimagedt;
	}

    /**
	 * 
	 */
	public String getShipNowMessage() {
		return shipNowMessage;
	}

    /**
	 * 
	 */
	public void setShipNowMessage(String shipNowMessage) {
		this.shipNowMessage = shipNowMessage;
	}

    /**
	 * 
	 */
	public String getShipNowUrl() {
		return shipNowUrl;
	}

    /**
	 * 
	 */
	public void setShipNowUrl(String shipNowUrl) {
		this.shipNowUrl = shipNowUrl;
	}

    /**
	 * 
	 */
	public String getPreselectedCountry() {
		return preselectedCountry;
	}

    /**
	 * 
	 */
	public void setPreselectedCountry(String preselectedCountry) {
		this.preselectedCountry = preselectedCountry;
	}

    /**
	 * 
	 */
	public List<Article> getRelatedArticles() {
		return new ArrayList<Article>(relatedArticles);
	}

    /**
	 * 
	 */
	public void setRelatedArticles(List<Article> relatedArticles) {
		this.relatedArticles = new ArrayList<Article>(relatedArticles);
	}

    /**
	 * 
	 */
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
			if ((title == null) || (title.trim().length() == 0)) {
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
	    
	    relatedArticles = new ArrayList<Article>();
		
		Resource relatedArticlePaths = currentPage.getContentResource("items");
		if (relatedArticlePaths != null) {
			Iterator<Resource> relatedArticlePathsIterator = relatedArticlePaths.listChildren();
			while (relatedArticlePathsIterator.hasNext()) {
				ValueMap props = relatedArticlePathsIterator.next().adaptTo(ValueMap.class);
				if (props != null) {
					String url = props.get("url", "");
					
					Article article = new Article(url, resourceResolver);
					relatedArticles.add(article);
				}
			}
		}
		resourceResolver.close();
	}
}