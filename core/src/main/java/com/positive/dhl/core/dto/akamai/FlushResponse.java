/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.dto.akamai;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;
import org.apache.http.HttpStatus;

/**
 * Encapsulation of response provided by Akamai based on flush request
 */
@Builder
@Getter
@Setter
@Jacksonized
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FlushResponse {

	private HttpStatus httpStatus;
	private int estimatedSeconds;
	private String purgeId;
	private String supportId;
	private String detail;

}
