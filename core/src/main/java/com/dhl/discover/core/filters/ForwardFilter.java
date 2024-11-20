/* 9fbef606107a605d69c0edbcd8029e5d */
package com.dhl.discover.core.filters;

import com.dhl.discover.core.components.EnvironmentConfiguration;
import com.dhl.discover.core.constants.DiscoverConstants;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.engine.EngineConstants;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.ServletException;
import javax.servlet.FilterConfig;
import java.io.IOException;

/**
 * Servlet filter configured to listen to POST submissions. Main job of this filter is
 * to forward the request to servlet bound to component's resource type if it matches the criteria and its request data contain the
 * component's resource type
 */
@Slf4j
@Component(
		service = Filter.class,
		property = {
				Constants.SERVICE_DESCRIPTION + "=Discover servlet filter meant to trigger on Form submissions",
				EngineConstants.SLING_FILTER_SCOPE + "=" + EngineConstants.FILTER_SCOPE_REQUEST,
				EngineConstants.SLING_FILTER_METHODS + "=" + HttpConstants.METHOD_POST,
				Constants.SERVICE_RANKING + ":Integer=-999"
		}
)
public class ForwardFilter implements Filter {

	@Reference
	private EnvironmentConfiguration environmentConfiguration;

	/**
	 * Main method of this filter. Its job is relatively simple: check if the incoming request contains the parameter {@link DiscoverConstants#FORM_START_PARAM}
	 * and if yes, and the value stored in this parameter does exist in the repository, then forward the request to this resource.
	 * <br /><br />
	 * In all other circumstances (parameter {@link DiscoverConstants#FORM_START_PARAM} not present or its resource does not exist), pass the request along the filter chain.
	 * @param servletRequest is an instance of {@link ServletRequest} object; it is <strong>this</strong> request whose parameter we need to check
	 * @param servletResponse is an instance of {@link ServletResponse} that is a wrapper of the 'response' object
	 * @param filterChain is an object that contains information about the current chain of filters
	 * @throws IOException is thrown in case an acquisition of either the parameter(s) or resources in the repository failed
	 * @throws ServletException is thrown in all other cases when something went wrong
	 */
	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
		final SlingHttpServletRequest request = (SlingHttpServletRequest) servletRequest;
		var requestResource = getResource(request);
		var target = request.getRequestParameter(DiscoverConstants.FORM_START_PARAM);
		if(null != requestResource && null != target){
			var requestDispatcher = request.getRequestDispatcher(removeDiscoverContext(target.getString()));
			if(null != requestDispatcher){
				log.info("About to forward the request to {}", target);
				requestDispatcher.forward(servletRequest, servletResponse);
			}
		} else {
			log.info("Passing request for further processing to subsequent filters / scripts / servlets");
			filterChain.doFilter(servletRequest, servletResponse);
		}
	}

	/**
	 * Tries to obtain the {@link Resource} associated to the value of request parameter 'formStart'. If not present, {@code null} is returned.
	 * @param request is an instance of {@link SlingHttpServletRequest} that contains the request parameters
	 * @return a {@code Resource} related to the value of request parameter 'formStart' or {@code null} if the resource could not be found
	 */
	private Resource getResource(SlingHttpServletRequest request){
		var target = request.getRequestParameter("formStart");
		if(null != target){
			var targetString = target.getString();
			targetString = removeDiscoverContext(targetString);
			targetString = targetString.split("\\.")[0];
			log.debug("Acquired request destination : {} - request will be forwarded there, if this resource exists in the repository", targetString);
			return request.getResourceResolver().getResource(targetString);
		}
		return null;
	}

	/**
	 * Helper method that removes the value of {@link DiscoverConstants#DISCOVER_CONTEXT} from the incoming string (if it starts with it) and returns a new string
	 * @param originalString is the original {@link String} we want to modify
	 * @return new string with {@link DiscoverConstants#DISCOVER_CONTEXT} removed or original String if it was not present in the first place
	 */
	private String removeDiscoverContext(String originalString){
		var assetprefix = environmentConfiguration.getAssetPrefix();
		return originalString.startsWith(assetprefix)
				? originalString.replaceFirst(DiscoverConstants.DISCOVER_CONTEXT, "") : originalString;
	}

    @Override
    public void destroy() {
		// Left blank intentionally
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
		// Left blank intentionally
    }
}
