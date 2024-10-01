package com.positive.dhl.core.models;
 
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Named;

import lombok.experimental.UtilityClass;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 *
 */
@Model(adaptables=Resource.class)
@UtilityClass
public class ArticleList {
	@ValueMapValue
	@Named("items")
	@Optional
	private static Resource linksResource;

	private static List<Article> articles;
	
    /**
	 * 
	 */
	public static List<Article> getArticles() {
		return new ArrayList<>(articles);
	}

    /**
	 * 
	 */
	public static void setArticles(List<Article> articles) {
		ArticleList.articles = new ArrayList<>(articles);
	}

    /**
	 * 
	 */
	@PostConstruct
	protected static void  init() {
		articles = new ArrayList<>();
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