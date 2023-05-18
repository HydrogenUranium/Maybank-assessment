/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.dto.marketo;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * Contains properties required to handle the communication with Marketo backend, both for authentication and data submission
 */
@Getter
@Setter
@Builder
public class MarketoConnectionData {

	private String url;
	private String secretId;
	private String clientId;
	private String formSubmissionAPIPath;
	private String authAPIPath;
	private String formDescriptionAPIPath;
	private String formFieldsAPIPath;
}
