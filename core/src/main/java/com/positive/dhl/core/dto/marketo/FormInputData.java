/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.dto.marketo;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.util.Map;

/**
 * Object that represents the complete Marketo form submission. It can (and should) be used as json template.
 */
@Getter
@Setter
@Builder
@Jacksonized
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FormInputData {
	@JsonProperty("leadFormFields")
	private Map<String,Object> leadFormFields;
	@JsonProperty("visitorData")
	private Map<String,Object> visitorData;
	@JsonProperty("cookie")
	private String cookie;
}
