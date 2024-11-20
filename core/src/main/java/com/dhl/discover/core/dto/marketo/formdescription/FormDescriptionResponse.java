/* 9fbef606107a605d69c0edbcd8029e5d */
package com.dhl.discover.core.dto.marketo.formdescription;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Getter
@Setter
@Builder
@Jacksonized
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FormDescriptionResponse {

	private String requestId;
	private boolean success;
	private List<Result> result;
}
