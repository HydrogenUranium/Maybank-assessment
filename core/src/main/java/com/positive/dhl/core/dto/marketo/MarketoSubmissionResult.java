/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.dto.marketo;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Jacksonized
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MarketoSubmissionResult {

	@JsonProperty("id")
	private long id;
	@JsonProperty("status")
	private String status;
}
