package com.positive.dhl.core.models;
 
import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;

/**
 *
 */
@Model(adaptables=Resource.class)
public class HomepageArticlesPanel {
	@Inject
	private ResourceResolver resourceResolver;
	
	@Inject
	@Named("firstfeaturepath")
	@Optional
	public String firstArticlePath;
	
	@Inject
	@Named("secondfeaturepath")
	@Optional
	public String secondArticlePath;
	
	@Inject
	@Named("thirdfeaturepath")
	@Optional
	public String thirdArticlePath;

	private Article firstArticle;
	private Article secondArticle;
	private Article thirdArticle;
	
    /**
	 * 
	 */
	public Article getFirstArticle() {
		return firstArticle;
	}

    /**
	 * 
	 */
	public void setFirstArticle(Article firstArticle) {
		this.firstArticle = firstArticle;
	}

    /**
	 * 
	 */
	public Article getSecondArticle() {
		return secondArticle;
	}

    /**
	 * 
	 */
	public void setSecondArticle(Article secondArticle) {
		this.secondArticle = secondArticle;
	}

    /**
	 * 
	 */
	public Article getThirdArticle() {
		return thirdArticle;
	}

    /**
	 * 
	 */
	public void setThirdArticle(Article thirdArticle) {
		this.thirdArticle = thirdArticle;
	}

    /**
	 * 
	 */
	@PostConstruct
	protected void init() {
		if (firstArticlePath != null && firstArticlePath.length() > 0) {
			firstArticle = new Article(firstArticlePath, resourceResolver);
		}
		if (secondArticlePath != null && secondArticlePath.length() > 0) {
			secondArticle = new Article(secondArticlePath, resourceResolver);
		}
		if (thirdArticlePath != null && thirdArticlePath.length() > 0) {
			thirdArticle = new Article(thirdArticlePath, resourceResolver);
		}
	}
}