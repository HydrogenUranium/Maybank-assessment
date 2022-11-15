package com.positive.dhl.core.models;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import com.day.cq.wcm.api.Page;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class ArticlePage {
	@Inject
	private ResourceResolver resourceResolver;
	
	@Inject
	private ResourceResolverFactory resolverFactory;
	
	@Inject
	private Page currentPage;
	
	private Article article;
	private String ogtagimage;
	private String customStyles;
	
    /**
	 * 
	 */
	public Article getArticle() {
		return article;
	}

    /**
	 * 
	 */
	public void setArticle(Article article) {
		this.article = article;
	}

    /**
	 * 
	 */
	public String getOgtagimage() {
		return ogtagimage;
	}

    /**
	 * 
	 */
	public void setOgtagimage(String ogtagimage) {
		this.ogtagimage = ogtagimage;
	}

    /**
	 * 
	 */
	public String getCustomStyles() {
		return customStyles;
	}

    /**
	 * 
	 */
	public void setCustomStyles(String customStyles) {
		this.customStyles = customStyles;
	}

    /**
	 * 
	 */
	@PostConstruct
    protected void init() {
		ValueMap properties = currentPage.adaptTo(ValueMap.class);
		
		if (properties != null) {
			// spec says just hard-code these things; which isn't too nice...
			String customOgTagImage = properties.get("jcr:content/ogtagimage", "");
			ogtagimage = "https://www.dhl.com/discover/etc.clientlibs/dhl/clientlibs/clientlib-site/resources/img/icons/192.png";
			if (customOgTagImage.trim().length() > 0) {
				ogtagimage = ("https://www.dhl.com/discover").concat(customOgTagImage.trim());
			}
			
			customStyles = properties.get("jcr:content/customstyles", "");
			
			int viewcount = properties.get("jcr:content/viewcount", 0);
			boolean viewCountUpdated = false;
			try {
				Node currentPageNode = currentPage.getContentResource().adaptTo(Node.class);
				if (currentPageNode != null) {
					currentPageNode.setProperty("viewcount", ++viewcount);
					currentPageNode.getSession().save();
					viewCountUpdated = true;
				}

			} catch (RepositoryException ex) {
				//ignore the write
			}
			
			if (!viewCountUpdated) {
				try {
					Map<String, Object> param = new HashMap<String, Object>();
					param.put(ResourceResolverFactory.SUBSERVICE, "datawrite");
					ResourceResolver resolver = resolverFactory.getServiceResourceResolver(param);
					Session session = resolver.adaptTo(Session.class);
	
					if (session != null) {
						Node currentPageNode = session.getNode(currentPage.getPath());
						if (currentPageNode != null) {
							currentPageNode.setProperty("viewcount", ++viewcount);
						}
			
						session.save(); 
						session.logout();
					}
					
				} catch (RepositoryException ex) {
					//ignore the write
					
				} catch (LoginException e) {
					// ignore the login exception
				}
			}
		}
		article = new Article(currentPage.getPath(), resourceResolver);
	}
}