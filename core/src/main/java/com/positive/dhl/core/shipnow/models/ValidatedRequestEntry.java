package com.positive.dhl.core.shipnow.models;

import java.util.HashMap;
import java.util.Map;

import org.apache.sling.api.SlingHttpServletRequest;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import com.positive.dhl.core.helpers.ValidationHelper;

public class ValidatedRequestEntry extends HashMap<String, Object> {
	private final HashMap<String, ValidationType> requiredFields;
	private transient JsonArray errors;
	private Boolean validated;
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public ValidatedRequestEntry() {
		this.validated = false;
		this.requiredFields = new HashMap<String, ValidationType>();
	}
	
	/**
	 *
	 */
	public JsonArray getErrors() {
		if (!this.validated) {
			this.Validate();
		}
		if (this.errors != null) {
			return this.errors;
		}
		return new JsonArray();
	}
	
	/**
	 *
	 */
	public void AddRequiredField(String key, Object value) {
		this.AddRequiredField(key, value, ValidationType.NotEmpty);
	}
	
	/**
	 *
	 */
	public void AddRequiredField(String key, SlingHttpServletRequest request) {
		this.AddRequiredField(key, request.getParameter(key), ValidationType.NotEmpty);
	}
	
	/**
	 *
	 */
	public void AddRequiredField(String key, SlingHttpServletRequest request, ValidationType requirement) {
		this.AddRequiredField(key, request.getParameter(key), requirement);
	}
	
	/**
	 *
	 */
	public void AddRequiredField(String key, Object value, ValidationType requirement) {
		if (this.requiredFields.containsKey(key)) {
			this.requiredFields.replace(key, requirement);
			
		} else {
			this.requiredFields.put(key, requirement);
		}
		
		this.AddOptionalField(key, value);
	}
	
	/**
	 *
	 */
	public void AddOptionalField(String key, SlingHttpServletRequest request) {
		this.AddOptionalField(key, request.getParameter(key));
	}
	
	/**
	 *
	 */
	public void AddOptionalField(String key, Object value) {
		if (this.containsKey(key)) {
			this.replace(key, value);
			
		} else {
			this.put(key, value);
		}
		
		this.validated = false;
	}
	
	/**
	 *
	 */
	public Boolean Validate() {
		errors = new JsonArray();
		
		if (this.requiredFields.isEmpty()) {
			return true;
		}
		
		boolean result = true;
		for (Map.Entry<String, ValidationType> entry: this.requiredFields.entrySet()) {
			Object val = null;
			switch (entry.getValue()) {
				case NotEmpty:
					if (this.containsKey(entry.getKey())) {
						val = this.get(entry.getKey());
					}
					if ((val == null) || (val.toString().isEmpty())) {
						result = false;
						JsonObject field = new JsonObject();
						field.addProperty("field", (entry.getKey() + " not valid"));
						errors.add(field);
					}
					break;

				case Email:
					if (this.containsKey(entry.getKey())) {
						val = this.get(entry.getKey());
					}
					if ((val == null) || (val.toString().isEmpty()) || (!ValidationHelper.EmailAddressValid(val.toString()))) {
						result = false;
						JsonObject field = new JsonObject();
						field.addProperty("field", (entry.getKey() + " not valid"));
						errors.add(field);
					}
					break;
					
				default:
					if (this.containsKey(entry.getKey())) {
						val = this.get(entry.getKey());
					}
					if (val == null) {
						result = false;
						JsonObject field = new JsonObject();
						field.addProperty("field", (entry.getKey() + " not valid"));
						errors.add(field);
					}
					break;
			}
		}
		
		this.validated = true;
		return result;
	}
}