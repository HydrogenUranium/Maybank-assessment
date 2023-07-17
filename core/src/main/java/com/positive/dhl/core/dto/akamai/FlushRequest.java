/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.dto.akamai;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.util.ArrayList;
import java.util.List;

/**
 * Encapsulation of Akamai flush request
 */
@Builder
@Getter
@Setter
@Jacksonized
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FlushRequest {

	@JsonProperty("objects")
	List<String> itemsToFlush;

	public void addItemToFlush(String item){
		if(itemsToFlush == null){
			itemsToFlush = new ArrayList<>();
		}
		itemsToFlush.add(item);
	}

}
