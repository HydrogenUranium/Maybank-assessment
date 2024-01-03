package com.positive.dhl.core.models;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import com.drew.lang.annotations.NotNull;
import com.positive.dhl.core.injectors.InjectHomeProperty;
import com.positive.dhl.core.services.PathUtilService;
import lombok.Getter;
import lombok.Setter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.*;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.components.EnvironmentConfiguration;

import static com.positive.dhl.core.constants.DiscoverConstants.HTTPS_PREFIX;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class ArticlePage {
	public static final String VIEW_COUNT = "viewcount";

	@OSGiService
	private PathUtilService pathUtilService;

	@Inject
	private ResourceResolver resourceResolver;
	
	@Inject
	private ResourceResolverFactory resolverFactory;
	
	@Inject
	private Page currentPage;

	@Optional
	@InjectHomeProperty
	@Getter
	@Named("articleHeader-shareOn")
	private String shareOn;

	@Optional
	@InjectHomeProperty
	@Getter
	@Named("articleHeader-smartShareButtonsLabel")
	private String smartShareButtonsLabel;

	@Optional
	@InjectHomeProperty
	@Getter
	@Named("articleHeader-smartShareButtonsIconPath")
	private String smartShareButtonsIconPath;

	@Optional
	@InjectHomeProperty
	@Getter
	@Named("articleHeader-followLabel")
	private String followLabel;

	@Optional
	@InjectHomeProperty
	@Getter
	@Named("articleHeader-followPath")
	private String followPath;

	@Optional
	@InjectHomeProperty
	@Named("multifields/socialNetwork")
	private Resource socialNetwork;

	@OSGiService
	private EnvironmentConfiguration environmentConfiguration;

	@Getter
	private Article article;

	@Getter
	@Setter
	private String ogtagimage;

	@Getter
	@Setter
	private String customStyles;

	@PostConstruct
    protected void init() {
		String assetprefix = environmentConfiguration.getAssetPrefix();
		String akamaiHostname = environmentConfiguration.getAkamaiHostname();

		ValueMap properties = currentPage.getProperties();

		smartShareButtonsIconPath = pathUtilService.resolveAssetPath(smartShareButtonsIconPath);

		if (!properties.isEmpty()) {
			String customOgTagImage = properties.get("ogtagimage", "");
			ogtagimage = customOgTagImage.trim().length() > 0
					? (HTTPS_PREFIX + akamaiHostname + assetprefix).concat(customOgTagImage.trim())
					: HTTPS_PREFIX + akamaiHostname + "/etc.clientlibs/dhl/clientlibs/discover/resources/img/icons/192.png";
			customStyles = properties.get("customstyles", "");
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
							pathUtilService.resolveAssetPath(vm.get("socialNetworkIconPath", String.class))
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