package com.dhl.discover.core.services.impl;

import com.dhl.discover.core.constants.DiscoverConstants;
import com.dhl.discover.core.dto.marketo.FormInputBase;
import com.dhl.discover.core.dto.marketo.FormInputData;
import com.dhl.discover.core.services.InputParamHelper;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.xss.XSSAPI;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.Cookie;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

import static org.apache.commons.text.lookup.StringLookupFactory.KEY_LOCALHOST;

@Component(
		service = InputParamHelper.class
)
public class InputParamHelperImpl implements InputParamHelper {

	private static final Logger LOGGER = LoggerFactory.getLogger(InputParamHelperImpl.class);

	@Reference
	XSSAPI xssapi;

	@Override
	public FormInputBase buildForm(SlingHttpServletRequest request, List<String> permittedFieldNames, List<String> permittedFields) {
		Map<String,Object> leadFormFields = buildFormData(request.getRequestParameterMap(),permittedFieldNames,permittedFields );
		int formId = getFormId(request);
		List<FormInputData> input = new ArrayList<>();

		FormInputData.FormInputDataBuilder formInputData = FormInputData.builder()
				.leadFormFields(leadFormFields)
				.visitorData(buildVisitorData(request));

		if(LOGGER.isDebugEnabled()){
		    LOGGER.debug("Form Input data: {}", formInputData);
		}

		String cookie = getCookie(request);
		if(null != cookie){
			formInputData.cookie(cookie);
		}

		input.add(formInputData.build());

		if(formId == 0 || leadFormFields.isEmpty()){
			return FormInputBase.builder()
					.formId(formId)
					.formInputData(input)
					.isOk(false)
					.build();
		}
		return FormInputBase.builder()
				.formId(formId)
				.formInputData(input)
				.isOk(true)
				.build();
	}

	@Override
	public int getFormId(SlingHttpServletRequest request) {
		var paramValue = getRequestParameter(request, DiscoverConstants.FORMID_PARAM_NAME);
		if(null != paramValue){
			return Integer.parseInt(paramValue);
		}
		LOGGER.error("Form ID parameter was not present in the form submission. We return 0 but that is most likely wrong");
		return 0;
	}

	@Override
	public String getRequestParameter(SlingHttpServletRequest request, String paramName) {
		if(null != paramName){
			var parameter = request.getRequestParameter(paramName);
			if(null != parameter){
				return xssapi.filterHTML(parameter.getString().trim());
			}
		}
		return null;
	}

	/**
	 * Helper method that tries to extract the 'marketo' cookie from the form (javascript code is expected to add this). If not available,
	 * we try to look in cookies received with the request to the servlet. If we find the cookie in 'form' data, we return it immediately.
	 * @param request is an instance of {@link SlingHttpServletRequest} that we leverage to extract the cookie data from
	 * @return value of the 'marketo' cookie or {@code null}
	 */
	private String getCookie(SlingHttpServletRequest request){
		String cookie = request.getParameter(DiscoverConstants.COOKIE_PARAM_NAME);
		if(null != cookie) {
			return xssapi.filterHTML(cookie);
		}
		Cookie[] cookies = request.getCookies();
		if(null != cookies){
			for (Cookie marketoCookie : cookies){
				if (marketoCookie.getName().toLowerCase().contains(DiscoverConstants.MARKETO_COOKIE_NAME)){
					return xssapi.filterHTML(marketoCookie.getValue());
				}
			}
		}

		return null;
	}

	private Map<String,Object> buildVisitorData(SlingHttpServletRequest request){
		Map<String,Object> visitorData = new HashMap<>();
		String ip = getIp(request);
		var queryString = request.getQueryString();
		String userAgent = request.getHeader(DiscoverConstants.USER_AGENT_HEADER);
		String referrer = request.getParameter("referer");
		if(null == referrer){
			referrer = request.getParameter("_mktoReferrer");
		}

		visitorData.put(DiscoverConstants.LEAD_CLIENT_IP_ADDRESS, ip);
		if(null != queryString){
			visitorData.put(DiscoverConstants.QUERY_STRING, queryString);
		}

		if(null != userAgent){
			visitorData.put(DiscoverConstants.USER_AGENT_STRING, userAgent);
		}

		if(null != referrer){
			visitorData.put(DiscoverConstants.PAGE_URL, referrer);
		}
		return visitorData;
	}

	/**
	 * Marketo currently does not support IPv6 addresses so this method replace the IPv6 to default IPv4 address to prevent error
	 * and allow Marketo handle this request
	 * @param request is an instance of {@link SlingHttpServletRequest}
	 * @return value of the 'IPv4 address'
	 */
	private String getIp(SlingHttpServletRequest request)  {
		String ip = request.getRemoteAddr();

		try {
			var address = InetAddress.getByName(ip);
			ip = address instanceof Inet4Address ? ip : InetAddress.getByName(KEY_LOCALHOST).getHostAddress();
		} catch (UnknownHostException e) {
			LOGGER.error("Unable to read IP address");
			if(LOGGER.isDebugEnabled()) {
				LOGGER.debug("Unable to read IP address: {}", e.getMessage());
			}
		}

		return ip;
	}


	private Map<String,Object> buildFormData(Map<String, RequestParameter[]> allParams, List<String> permittedFieldNames,List<String> fields){
		Map<String,Object> formData = new HashMap<>();
		allParams.entrySet().stream()
				.filter(entry -> 	!entry.getKey().equalsIgnoreCase(DiscoverConstants.COOKIE_PARAM_NAME))
				.filter(entry -> fields.contains(entry.getKey()))
				.forEach(entry -> formData.put(getFieldName(permittedFieldNames,entry.getKey()), entry.getValue()[0].getString()));
		if(formData.isEmpty()){
			LOGGER.error("Unable to extract any form fields from the incoming request. That is wrong");
		}
		return formData;
	}

	private String getFieldName(List<String> permittedFieldNames, String nameUnderTest){
		Optional<String> optional = permittedFieldNames.stream()
				.filter(entry -> entry.toLowerCase().equalsIgnoreCase(nameUnderTest))
				.findFirst();
		return optional.orElse(xssapi.filterHTML(nameUnderTest));
	}
}
