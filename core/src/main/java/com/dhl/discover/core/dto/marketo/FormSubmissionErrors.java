/* 9fbef606107a605d69c0edbcd8029e5d */
package com.dhl.discover.core.dto.marketo;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Setter
@Jacksonized
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FormSubmissionErrors {

	private String code;
	private String message;

}
