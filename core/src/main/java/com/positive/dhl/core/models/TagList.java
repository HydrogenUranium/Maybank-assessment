package com.positive.dhl.core.models;
 
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;

import com.day.cq.tagging.TagManager;
import com.day.cq.tagging.Tag;

/**
 *
 */
@Model(adaptables=Resource.class)
public class TagList {
	@Inject
	private ResourceResolver resourceResolver;
	
	@Inject
	@Named("title")
	@Optional
	public String title;
	
	@Inject
	@Named("tags")
	@Optional
	public String[] tagPaths;
	
	private List<TagWrapper> tags;
	
    /**
	 * 
	 */
	public List<TagWrapper> getTags() {
		return new ArrayList<TagWrapper>(tags);
	}

    /**
	 * 
	 */
	public void setTags(List<TagWrapper> tags) {
		this.tags = new ArrayList<TagWrapper>(tags);
	}

    /**
	 * 
	 */
	@PostConstruct
	protected void init() {
		tags = new ArrayList<TagWrapper>();
		if (tagPaths != null) {
			TagManager tagManager = resourceResolver.adaptTo(TagManager.class);
			if (tagManager != null) {
				for (String tagPath: tagPaths) {
					Tag tag = tagManager.resolve(tagPath);
					if (tag != null) {
						tags.add(new TagWrapper(tag));
					}
				}
			}
		}
		resourceResolver.close();
	}
}