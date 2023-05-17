package com.positive.dhl.core.models;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.wcm.api.constants.NameConstants;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class PageNotFoundRedirect {
	@Inject
	private SlingHttpServletResponse response;

    @Inject
    private QueryBuilder builder;

	@Inject
	private ResourceResolver resourceResolver;

    /**
	 *
	 */
	@PostConstruct
    protected void init() throws RepositoryException, IOException {
		var page404 = "/content/dhl.html";

    if (builder != null) {
			Map<String, String> map = new HashMap<>();
			map.put("type", NameConstants.NT_PAGE);
			map.put("property", "jcr:content/sling:resourceType");
			map.put("property.value", "dhl/components/pages/page404");
			var query = builder.createQuery(PredicateGroup.create(map), resourceResolver.adaptTo(Session.class));
	    var searchResult = query.getResult();
      if (searchResult != null) {
				if(!searchResult.getHits().isEmpty()){
					for (Hit hit: searchResult.getHits()) {
						// this appears to look for the last hit and set the redirect target to it; this is probably not correct
						page404 = hit.getPath().concat(".html");
					}
				}

				Iterator<Resource> resources = searchResult.getResources();
				if (resources.hasNext()) {
					resources.next().getResourceResolver().close();
				}
	    }
    }

		response.sendRedirect(page404);
	}
}
