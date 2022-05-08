package com.positive.dhl.core.models;
 
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;

/**
 *
 */
@Model(adaptables=Resource.class)
public class ArticleList {
	@Inject
	@Named("items")
	@Optional
	private Resource linksResource;

	private static List<Article> articles;
	
    /**
	 * 
	 */
	public static List<Article> getArticles() {
		return new ArrayList<Article>(articles);
	}

    /**
	 * 
	 */
	public static void setArticles(List<Article> articles) {
		ArticleList.articles = new ArrayList<Article>(articles);
	}

    /**
	 * 
	 */
	@PostConstruct
	protected void init() {
		articles = new ArrayList<Article>();
		if (linksResource != null) {
			int count = 0;
			Iterator<Resource> linkResources = linksResource.listChildren();
			while (linkResources.hasNext()) {
				Article link = linkResources.next().adaptTo(Article.class);
				if (link != null) {
					link.setIndex(count);
					link.setFourth((link.getIndex() + 1) % 4 == 0);
					articles.add(link);
					count++;
				}
			}
		}
	}
}