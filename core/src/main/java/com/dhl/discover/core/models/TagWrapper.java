package com.dhl.discover.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import com.day.cq.tagging.Tag;

/**
 * @deprecated (will be removed)
 */
@Deprecated(since = "2.1", forRemoval = true)
@Model(adaptables=Resource.class)
public class TagWrapper {
	private Tag tag;
	
    /**
	 * 
	 */
	public String name() {
		return tag.getName();
	}
	
    /**
	 * 
	 */
	public String title() {
		return tag.getTitle();
	}
	
    /**
	 * 
	 */
	public String searchUrl() {
		return "?searchfield=tag:" + this.name();
	}
	
    /**
	 * 
	 */
	public TagWrapper(Tag itag) {
		tag = itag;
	}
}