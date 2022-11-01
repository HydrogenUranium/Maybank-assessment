/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.constants;

/**
 * Class holding immutable 'configuration' (and other) values
 */
public class DiscoverConstants {

	public static final String DISCOVER_READ_SERVICE="discoverReader";
	public static final String DISCOVER_WRITE_SERVICE="discoverWriter";
	public static final String DISCOVER_COUNTRIES_LOCATION = "/apps/dhl/appdata/countries";

	private DiscoverConstants() {
		throw new IllegalStateException("Not meant to be instantiated");
	}

}
