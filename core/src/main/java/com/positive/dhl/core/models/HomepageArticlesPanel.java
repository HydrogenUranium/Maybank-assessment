package com.positive.dhl.core.models;
 
import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

import com.positive.dhl.core.services.PageUtilService;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

/**
 *
 */
@Model(adaptables=Resource.class)
public class HomepageArticlesPanel {

	@OSGiService
	private PageUtilService pageUtilService;

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

	@Getter
	@Setter
	private Article firstArticle;

	@Getter
	@Setter
	private Article secondArticle;

	@Getter
	@Setter
	private Article thirdArticle;

	@PostConstruct
	protected void init() {
		firstArticle = StringUtils.isNoneBlank(firstArticlePath)
				? pageUtilService.getArticle(firstArticlePath, resourceResolver) : null;
		secondArticle = StringUtils.isNoneBlank(secondArticlePath)
				? pageUtilService.getArticle(secondArticlePath, resourceResolver) : null;
		thirdArticle = StringUtils.isNoneBlank(thirdArticlePath)
				? pageUtilService.getArticle(thirdArticlePath, resourceResolver) : null;
	}
}