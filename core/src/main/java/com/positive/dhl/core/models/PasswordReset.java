package com.positive.dhl.core.models;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class PasswordReset {
	@Inject
	private SlingHttpServletRequest request;
	
	private List<Article> results;
	private String username;
	private String token;
	private String responseText;
	
    /**
	 * 
	 */
	public List<Article> getResults() {
		if (results == null) {
			results = new ArrayList<Article>();
		}
		return new ArrayList<Article>(results);
	}

    /**
	 * 
	 */
	public void setResults(List<Article> results) {
		this.results = new ArrayList<Article>(results);
	}

    /**
	 * 
	 */
	public String getUsername() {
		return username;
	}

    /**
	 * 
	 */
	public void setUsername(String username) {
		this.username = username;
	}

    /**
	 * 
	 */
	public String getToken() {
		return token;
	}

    /**
	 * 
	 */
	public void setToken(String token) {
		this.token = token;
	}

    /**
	 * 
	 */
	public String getResponseText() {
		return responseText;
	}

    /**
	 * 
	 */
	public void setResponseText(String responseText) {
		this.responseText = responseText;
	}

    /**
	 * 
	 */
	@PostConstruct
    protected void init() {
		username = request.getParameter("username");
		token = request.getParameter("token");
	}
}