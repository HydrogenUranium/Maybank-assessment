package com.dhl.discover.core.dto.marketo;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.apache.sling.api.request.RequestParameter;

import java.util.List;
import java.util.Map;

/**
 * Object that is expected to hold parameters received by a servlet to be used for further
 * processing
 */

@Getter
@Setter
@Builder
@ToString
public class FormInputParams {

	/**
	 * This is a Map of {@code String} as values and an array of {@link RequestParameter}s as values that contain all
	 * parameters passed in to the servlet
	 */
	private Map<String, RequestParameter[]> allParams;
	/**
	 * Map of {@code String} as value and a {@link List} of {@code String}s representing the values of these headers (each
	 * header may have more than one value)
	 */
	private Map<String, List<String>> allHeaders;
	private int formId;
	private Map<String,Object> formFields;
}
