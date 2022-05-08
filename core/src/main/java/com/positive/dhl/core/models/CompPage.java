package com.positive.dhl.core.models;

import javax.annotation.PostConstruct;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class CompPage {
	private String status;
	
    /**
	 * 
	 */
	public String getStatus() {
		return status;
	}

    /**
	 * 
	 */
	public void setStatus(String status) {
		this.status = status;
	}

    /**
	 * 
	 */
	@PostConstruct
    protected void init() {
		status = "";
	}
}