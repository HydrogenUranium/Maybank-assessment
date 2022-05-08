package com.positive.dhl.core.models;

import java.util.Date;

import javax.inject.Inject;
import javax.inject.Named;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;

/**
 *
 */
@Model(adaptables=Resource.class)
public class Competition {
	@Inject
	@Named("enddate")
	@Optional
	public Date enddate;

	@Inject
	@Named("description")
	@Optional
	public String description;

	@Inject
	@Named("description2")
	@Optional
	public String description2;

	@Inject
	@Named("description3")
	@Optional
	public String description3;

	@Inject
	@Named("description4")
	@Optional
	public String description4;

	@Inject
	@Named("description5")
	@Optional
	public String description5;

	@Inject
	@Named("showq2")
	@Optional
	public Boolean showq2;

	@Inject
	@Named("showq3")
	@Optional
	public Boolean showq3;

	@Inject
	@Named("showq4")
	@Optional
	public Boolean showq4;

	@Inject
	@Named("showq5")
	@Optional
	public Boolean showq5;
	
    /**
	 * 
	 */
	public Boolean hasDescription2() {
		return ((description2 != null) && (description2.trim().length() > 0));
	}
	
    /**
	 * 
	 */
	public Boolean hasDescription3() {
		return ((description3 != null) && (description3.trim().length() > 0));
	}
	
    /**
	 * 
	 */
	public Boolean hasDescription4() {
		return ((description4 != null) && (description4.trim().length() > 0));
	}
	
    /**
	 * 
	 */
	public Boolean hasDescription5() {
		return ((description5 != null) && (description5.trim().length() > 0));
	}
	
    /**
	 * 
	 */
	public Boolean closed() {
		return enddate.before(new Date());
	}
}