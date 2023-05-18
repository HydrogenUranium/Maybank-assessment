/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.dto.marketo.formdescription;

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
public class Result {

	private String name;
	private List<Field> fields;

	public List<String> getAvailableFormFields(){
		if(null != fields){
			List<String> availableFormFields = new ArrayList<>();
			fields.forEach(field -> availableFormFields.add(field.getName()));
			return availableFormFields;
		}
		return new ArrayList<>();
	}
}
