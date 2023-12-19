/*
 *  Copyright 2015 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.positive.dhl.core.models;

import lombok.Getter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

/**
 * Simple Sling Model that represents a single FAQ item. It's used to populate the FAQ component.

 */
@Model(adaptables=Resource.class)
public class FAQItem {

	@Inject
	public String title;

	@Inject
	public String content;

	@Getter
	private int index;

	public void setIndex(int index) {
		this.index = index;
	}

	/**
	 * Method that gets executed whenever the model is 'constructed' (initialized), such as during the adaptation. It sets
	 * both title & content properties to empty string values to prevent null pointer exceptions (if they're {@code null}).
	 */
	@PostConstruct
	protected void init() {
		if (title == null) {
			title = "";
		}
		if (content == null) {
			content = "";
		}
	}
}
