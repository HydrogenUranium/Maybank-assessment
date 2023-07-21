/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.dto.akamai;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

	private String describedBy;
	private String detail;
	private long estimatedSeconds;
	private long httpStatus;
	private String purgeId;
	private String supportId;
	private String title;
}
