package com.positive.dhl.core.models;

import java.util.Comparator;

public class LanguageVariantSorter implements Comparator<LanguageVariant> {
	/**
	 * 
	 */
	@Override
	public int compare(LanguageVariant o1, LanguageVariant o2) {
		String o1name = (o1.deflt ? "1" : "0") + o1.getName();
		String o2name = (o2.deflt ? "1" : "0") + o2.getName();
		return o1name.compareTo(o2name);
	}
}