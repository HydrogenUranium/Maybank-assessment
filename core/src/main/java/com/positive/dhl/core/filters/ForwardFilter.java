/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.filters;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.engine.EngineConstants;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;

import javax.servlet.*;
import java.io.IOException;

/**
 * Servlet filter configured to listen to POST submissions to selector {@code form} and suffix {@code html}. Main job of this filter is
 * to forward the request to servlet bound to component's resource type if it matches the criteria and its request data contain the
 * component's resource type
 */
@Component(
		service = Filter.class,
		property = {
				Constants.SERVICE_DESCRIPTION + "=Discover servlet filter meant to trigger on Form submissions",
				EngineConstants.SLING_FILTER_SCOPE + "=" + EngineConstants.FILTER_SCOPE_REQUEST,
				EngineConstants.SLING_FILTER_METHODS + "=" + HttpConstants.METHOD_POST,
				EngineConstants.SLING_FILTER_SELECTORS + "=" + "form",
				EngineConstants.SLING_FILTER_EXTENSIONS + "=" + "html",
				Constants.SERVICE_RANKING + ":Integer=-999"
		}
)
public class ForwardFilter implements Filter {


	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
		final SlingHttpServletRequest request = (SlingHttpServletRequest) servletRequest;
		var requestResource = getResource(request);
		if(requestResource != null){
			var requestDispatcher = request.getRequestDispatcher(requestResource);
			if(null != requestDispatcher){
				requestDispatcher.forward(servletRequest, servletResponse);
			}
		}
		filterChain.doFilter(servletRequest, servletResponse);
	}

	/**
	 * Tries to obtain the {@link Resource} associated to the value of request parameter 'formStart'. If not present, {@code null} is returned.
	 * @param request is an instance of {@link SlingHttpServletRequest} that contains the request parameters
	 * @return a {@code Resource} related to the value of request parameter 'formStart' or {@code null} if the resource could not be found
	 */
	private Resource getResource(SlingHttpServletRequest request){
			var target = request.getRequestParameter("formStart");
			if(null != target){
				return request.getResourceResolver().getResource(target.getString());
			}
		return null;
	}

	@Override
	public void destroy() {
		// not implemented
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		// not implemented
	}
}
