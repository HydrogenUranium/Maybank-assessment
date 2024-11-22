package com.dhl.discover.core.models;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.inject.Named;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import com.drew.lang.annotations.NotNull;
import com.dhl.discover.core.injectors.InjectHomeProperty;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;

import com.day.cq.wcm.api.Page;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ArticlePage {
	public static final String VIEW_COUNT = "viewcount";

	@ScriptVariable
	private ResourceResolverFactory resolverFactory;
	
	@ScriptVariable
	private Page currentPage;

	@InjectHomeProperty
	@Getter
	@Named("articleHeader-shareOn")
	private String shareOn;

	@InjectHomeProperty
	@Getter
	@Named("articleHeader-smartShareButtonsLabel")
	private String smartShareButtonsLabel;

	@InjectHomeProperty
	@Getter
	@Default(values = "")
	@Named("articleHeader-smartShareButtonsIconPath")
	private String smartShareButtonsIconPath;

	@InjectHomeProperty
	@Getter
	@Named("articleHeader-followLabel")
	private String followLabel;

	@InjectHomeProperty
	@Getter
	@Named("articleHeader-followPath")
	private String followPath;

	@InjectHomeProperty
	@Named("multifields/socialNetwork")
	private Resource socialNetwork;

	@Getter
	private Article article;

	@PostConstruct
    protected void init() {
		ValueMap properties = currentPage.getProperties();

		if (!properties.isEmpty()) {
			updateViewCount(properties);
		}
		article = currentPage.adaptTo(Article.class);
	}

	public Map<String, String> getSocialNetwork() {
		Map<String, String> socialNetworkMap = new LinkedHashMap<>();
		if (socialNetwork != null) {
			socialNetwork.listChildren().forEachRemaining(r -> {
				ValueMap vm = r.adaptTo(ValueMap.class);
				if (vm != null && !vm.isEmpty()) {
					socialNetworkMap.put(
							vm.get("socialNetworkName", String.class),
							vm.get("socialNetworkIconPath", String.class)
					);
				}
			});
		}
		return socialNetworkMap;
	}

	private void updateViewCount(@NotNull ValueMap properties) {
		int viewcount = properties.get(VIEW_COUNT, 0);
		boolean viewCountUpdated = false;
		try {
			Resource contentResource = currentPage.getContentResource();
			if (contentResource != null) {
				Node currentPageNode = contentResource.adaptTo(Node.class);
				if (currentPageNode != null) {
					currentPageNode.setProperty(VIEW_COUNT, ++viewcount);
					currentPageNode.getSession().save();
					viewCountUpdated = true;
				}
			}
		} catch (RepositoryException ex) {
			//ignore the write
		}

		if (!viewCountUpdated) {
			try {
				Map<String, Object> param = new HashMap<>();
				param.put(ResourceResolverFactory.SUBSERVICE, "datawrite");
				ResourceResolver resolver = resolverFactory.getServiceResourceResolver(param);
				Session session = resolver.adaptTo(Session.class);

				if (session != null) {
					Node currentPageNode = session.getNode(currentPage.getPath());
					if (currentPageNode != null) {
						currentPageNode.setProperty(VIEW_COUNT, ++viewcount);
					}

					session.save();
					session.logout();
				}

			} catch (RepositoryException | LoginException ex) {
				//ignore the write
			}
		}
	}
}