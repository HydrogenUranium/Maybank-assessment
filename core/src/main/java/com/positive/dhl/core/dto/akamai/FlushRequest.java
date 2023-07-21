/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.dto.akamai;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.jackson.Jacksonized;

import java.util.*;

/**
 * Encapsulation of Akamai flush request
 */
@Builder
@Getter
@Jacksonized
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FlushRequest {

	@JsonProperty("objects")
	Set<String> itemsToFlush;

}
