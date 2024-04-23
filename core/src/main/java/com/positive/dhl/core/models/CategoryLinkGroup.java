package com.positive.dhl.core.models;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

@Getter
@Setter
@Model(adaptables=Resource.class)
public class CategoryLinkGroup {
    private String header;
    private String link;
    private List<CategoryLinkGroup> links;
    
	public CategoryLinkGroup() {
    	links = new ArrayList<>();
    }
}