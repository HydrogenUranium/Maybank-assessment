package com.positive.dhl.core.models;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import com.positive.dhl.core.utils.RequestUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

/**
 *
 */
@Model(adaptables = { Resource.class, SlingHttpServletRequest.class })
public class ShipNowForm {
	@Inject
	private SlingHttpServletRequest request;
	
	private String source;
	private String leadOriginator;
	private String shipnowmessage;
	private String shipnowurl;
	private String preselectedcountry;
	
    /**
	 * 
	 */
	public String getSource() {
		return source;
	}

    /**
	 * 
	 */
	public void setSource(String source) {
		this.source = source;
	}

    /**
	 * 
	 */
	public String getLeadOriginator() {
		return leadOriginator;
	}

    /**
	 * 
	 */
	public void setLeadOriginator(String leadOriginator) {
		this.leadOriginator = leadOriginator;
	}

    /**
	 * 
	 */
	public String getShipnowmessage() {
		return shipnowmessage;
	}

    /**
	 * 
	 */
	public void setShipnowmessage(String shipnowmessage) {
		this.shipnowmessage = shipnowmessage;
	}

    /**
	 * 
	 */
	public String getShipnowurl() {
		return shipnowurl;
	}

    /**
	 * 
	 */
	public void setShipnowurl(String shipnowurl) {
		this.shipnowurl = shipnowurl;
	}

    /**
	 * 
	 */
	public String getPreselectedcountry() {
		return preselectedcountry;
	}

    /**
	 * 
	 */
	public void setPreselectedcountry(String preselectedcountry) {
		this.preselectedcountry = preselectedcountry;
	}

    /**
	 * 
	 */
	@PostConstruct
	protected void init() {
		source = RequestUtils.getRequestValue(request, "source");
		leadOriginator = RequestUtils.getRequestValue(request, "lead_originator");
		
		shipnowmessage = "";
		shipnowurl = "";
		preselectedcountry = "";
	}
}