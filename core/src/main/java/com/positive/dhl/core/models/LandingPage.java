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
public class LandingPage {
	@Inject
	private ResourceResolver resourceResolver;
	
	@Inject
	private Page currentPage;
	
	private String fullTitle;
	private String title;
	private String heroimagemob;
	private String heroimagetab;
	private String heroimagedt;
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
		ValueMap properties = currentPage.adaptTo(ValueMap.class);
	    if (properties != null) {
			fullTitle = properties.get("jcr:content/jcr:title", "");
			title = properties.get("jcr:content/navTitle", "");
			if ((title == null) || (title.trim().length() == 0)) {
				title = fullTitle;
			}
			
			heroimagemob = properties.get("jcr:content/heroimagemob", "");
			heroimagetab = properties.get("jcr:content/heroimagetab", "");
			heroimagedt = properties.get("jcr:content/heroimagedt", "");
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
	}
}