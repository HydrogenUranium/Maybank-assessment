package com.positive.dhl.core.models;
 
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;

/**
 *
 */
@Model(adaptables=Resource.class)
public class FAQ {
    @SlingObject
    private Resource resource;

	@Inject
	@Named("items")
	@Optional
	private Resource linksResource;

	private List<FAQItem> accordionitems;

    /**
     *
     */
    public String getId() {
        return String.valueOf(Math.abs(resource.getPath().hashCode() - 1));
    }
	
    /**
	 * 
	 */
	public List<FAQItem> getAccordionitems() {
		return new ArrayList<FAQItem>(accordionitems);
	}

    /**
	 * 
	 */
	public void setAccordionitems(List<FAQItem> accordionitems) {
		this.accordionitems = new ArrayList<FAQItem>(accordionitems);
	}

    /**
	 * 
	 */
	@PostConstruct
	protected void init() {
		accordionitems = new ArrayList<FAQItem>();
		if (linksResource != null) {
			int count = 0;
			Iterator<Resource> linkResources = linksResource.listChildren();
			while (linkResources.hasNext()) {
				FAQItem link = linkResources.next().adaptTo(FAQItem.class);
				if (link != null) {
					link.setIndex(++count);
					accordionitems.add(link);
				}
			}
		}
	}
}