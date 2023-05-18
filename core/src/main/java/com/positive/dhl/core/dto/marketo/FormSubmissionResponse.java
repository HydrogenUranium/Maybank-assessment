package com.positive.dhl.core.dto.marketo;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Getter
@Setter
@Jacksonized
@Builder
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FormSubmissionResponse {

	@JsonProperty("requestId")
	String requestId;
	@JsonProperty("result")
	List<MarketoSubmissionResult> marketoSubmissionResultList;
	@JsonProperty("errors")
	List<FormSubmissionErrors> formSubmissionErrors;
	@JsonProperty("success")
	boolean success;
	@JsonProperty("dhl error message")
	String dhlErrorMessage;
}
