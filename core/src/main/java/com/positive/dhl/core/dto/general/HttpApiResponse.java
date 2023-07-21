/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.dto.general;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class HttpApiResponse {

	private int httpStatus;
	private String jsonResponse;

}
