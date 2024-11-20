/* 9fbef606107a605d69c0edbcd8029e5d */
package com.dhl.discover.core.dto.general;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * Simple abstraction wrapping the http status & payload into a single object
 */
@Builder
@Getter
@Setter
public class HttpApiResponse {

	private int httpStatus;
	private String jsonResponse;

}
