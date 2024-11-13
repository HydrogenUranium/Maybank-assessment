package com.dhl.discover.core.models;
 
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Named;

import lombok.Getter;
import lombok.Setter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

@Model(adaptables=Resource.class)
public class ArticleList {
	@ChildResource
	@Named("items")
	@Optional
	private Resource linksResource;

	@Setter
	@Getter
	private List<Article> articles;

	@PostConstruct
	protected void  init() {
		articles = new ArrayList<>();
		if (linksResource != null) {
			var count = 0;
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