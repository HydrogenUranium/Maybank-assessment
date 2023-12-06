package com.positive.dhl.core.models;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.PathUtilService;
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

@Model(adaptables=SlingHttpServletRequest.class)
public class LandingPage {
	@OSGiService
	private PathUtilService pathUtilService;

	@OSGiService
	private PageUtilService pageUtilService;

	@Inject
	private ResourceResolver resourceResolver;

	@Inject
	private Page currentPage;
	
	@Getter
	@Setter
	private String fullTitle;

	@Getter
	@Setter
	private String title;

	@Setter
	private String heroimagemob;

	public String getHeroimagemob() {
		return pathUtilService.resolveAssetPath(heroimagemob);
	}

	@Setter
	private String heroimagetab;

	public String getHeroimagetab() {
		return pathUtilService.resolveAssetPath(heroimagetab);
	}

	@Setter
	private String heroimagedt;

	public String getHeroimagedt() {
		return pathUtilService.resolveAssetPath(heroimagedt);
	}

	@Getter
	@Setter
	private List<Article> relatedArticles;
	
	@PostConstruct
    protected void init() {
		ValueMap properties = currentPage.getProperties();
	    if (!properties.isEmpty()) {
			fullTitle = properties.get(PN_TITLE, StringUtils.EMPTY);
			title = properties.get(PN_NAV_TITLE, StringUtils.EMPTY);
			if (StringUtils.isBlank(title)) {
				title = fullTitle;
			}
			
			heroimagemob = properties.get("heroimagemob", StringUtils.EMPTY);
			heroimagetab = properties.get("heroimagetab", StringUtils.EMPTY);
			heroimagedt = properties.get("heroimagedt", StringUtils.EMPTY);
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
