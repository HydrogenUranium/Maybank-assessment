package com.dhl.discover.core.models;

import java.util.Comparator;

public class LanguageVariantNameSorter implements Comparator<Link> {
	/**
	 * 
	 */
	@Override
	public int compare(Link o1, Link o2) {
		return o1.name.compareTo(o2.name);
	}
}