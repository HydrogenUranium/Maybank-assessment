/* 9fbef606107a605d69c0edbcd8029e5d */
package com.dhl.discover.core.dto.marketo.formfields;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Jacksonized
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FormFieldsResponse {

	List<Result> result;

	public List<String> getFormFields(){
		List<String> allFormFields = new ArrayList<>();
		if (null != result){
			result.forEach(entry -> allFormFields.add(entry.getId()));
		}
		return allFormFields;
	}
}
