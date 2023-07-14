/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.constants;

import java.util.HashMap;
import java.util.Map;

public enum AkamaiInvalidationResult {

	OK("ok - flush request accepted"),
	SKIPPED("skipped - akamai flush not applicable for this resource"),
	REJECTED("rejected - akamai request error");

	private static final Map<String, AkamaiInvalidationResult> BY_LABEL = new HashMap<>();

	static {
		for (AkamaiInvalidationResult dataOutputType : values()) {
			BY_LABEL.put(dataOutputType.label, dataOutputType);
		}
	}

	public final String label;

	AkamaiInvalidationResult(String label) {
		this.label = label;
	}

	public static AkamaiInvalidationResult valueOfLabel(String label) {
		return BY_LABEL.get(label);
	}

}
