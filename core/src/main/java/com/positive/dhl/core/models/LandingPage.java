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
@Getter
@Setter
public class LandingPage {
	@OSGiService
	private PathUtilService pathUtilService;

	@OSGiService
	private PageUtilService pageUtilService;

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
					
					var article = pageUtilService.getArticle(url, resourceResolver);
					if (article != null) {
						relatedArticles.add(article);
					}
				}
			}
		}
	}
}
