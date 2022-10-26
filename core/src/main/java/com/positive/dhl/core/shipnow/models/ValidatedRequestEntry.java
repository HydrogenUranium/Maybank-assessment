package com.positive.dhl.core.shipnow.models;

import java.util.HashMap;
import java.util.Map;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.sling.api.SlingHttpServletRequest;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import com.positive.dhl.core.helpers.ValidationHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
public class ValidatedRequestEntry extends HashMap<String, Object> {
	private final Map<String, ValidationType> requiredFields;
	private transient JsonArray errors;
	private boolean validated;

	private static final String FIELD = "field";
	private static final String NOT_VALID = " not valid";

	private static final Logger LOGGER = LoggerFactory.getLogger(ValidatedRequestEntry.class);
	private static final long serialVersionUID = 1L;
	
	public ValidatedRequestEntry() {
		this.validated = false;
		this.requiredFields = new HashMap<>();
	}

	/**
	 * Provides a {@link JsonArray} object with each captured error as one element in the array
	 * @return an array of errors or {@code empty} JsonArray
	 */
	public JsonArray getErrors() {
		if (!this.validated) {
			this.validate();
		}
		if (this.errors != null) {
			return this.errors;
		}
		return new JsonArray();
	}

	/**
	 * Adds a new required field (aka condition) to {@link ValidatedRequestEntry#requiredFields} property (which is a map of String as key and {@link ValidationType#NOT_EMPTY} as value). Simply said,
	 * this merely adds a new 'non empty' condition
	 * @param key is the name of the field
	 * @param request is an instance of {@link SlingHttpServletRequest}
	 */
	public void addRequiredField(String key, SlingHttpServletRequest request) {
		this.addRequiredField(key, request.getParameter(key), ValidationType.NOT_EMPTY);
	}

	/**
	 * Adds a new required field (aka condition) to {@link ValidatedRequestEntry#requiredFields} property (which is a map of String as key and {@link ValidationType} as value). Simply said,
	 * this merely adds a new condition of any type
	 * @param key is the name of the field
	 * @param request is an instance of {@link SlingHttpServletRequest}
	 * @param requirement is an instance of {@link ValidationType} {@code enum}
	 */
	public void addRequiredField(String key, SlingHttpServletRequest request, ValidationType requirement) {
		this.addRequiredField(key, request.getParameter(key), requirement);
	}

	/**
	 * Adds a new required field (aka condition) to {@link ValidatedRequestEntry#requiredFields} property (which is a map of String as key and {@link ValidationType} as value). Simply said,
	 * this merely adds a new condition of any type
	 * @param key is the name of the field
	 * @param value is a String representation of servlet's parameter matching the {@code key}. May be empty string or even {@code null}
	 * @param requirement is an instance of {@link ValidationType} {@code enum}
	 */
	public void addRequiredField(String key, Object value, ValidationType requirement) {
		if (this.requiredFields.containsKey(key)) {
			this.requiredFields.replace(key, requirement);
			
		} else {
			this.requiredFields.put(key, requirement);
		}
		
		this.addOptionalField(key, value);
	}

	/**
	 * Adds a new entry to the map of optional fields
	 * @param key is the key we want to add
	 * @param request is an instance of SlingHttpServletRequest where we want to extract the value from
	 */
	public void addOptionalField(String key, SlingHttpServletRequest request) {
		this.addOptionalField(key, request.getParameter(key));
	}

	/**
	 * Adds a new entry to the map of optional fields
	 * @param key is the key we want to add
	 * @param value is the String representation of the request parameter (may be empty String or even {@code null})
	 */
	public void addOptionalField(String key, Object value) {
		if (this.containsKey(key)) {
			this.replace(key, value);
			
		} else {
			this.put(key, value);
		}
		
		this.validated = false;
	}

	private boolean validateNotEmpty(String key){
		String value = (String) this.get(key);
		return null != value && !value.isEmpty();
	}

	private boolean validateEmail(String key){
		String value = (String) this.get(key);
		return null != value && !value.isEmpty() && ValidationHelper.isEmailAddressValid(value);
	}

	private boolean validatePhone(String key){
		String phoneNumberRaw = (String) this.get(key);
		String phoneNoOpeningBrackets = phoneNumberRaw.replace("(","");
		String phoneNoClosingBrackets = phoneNoOpeningBrackets.replace(")","");
		boolean phoneValidated = ValidationHelper.isPhoneNumberValid(phoneNoClosingBrackets);
		LOGGER.info("Phone number {} appears to be valid",phoneNumberRaw);
		return phoneValidated;
	}


	/**
	 * Goes through all the required {@link ValidatedRequestEntry#requiredFields} map and validates each entry against specific set of validation rules
	 */
	public boolean validate() {
		errors = new JsonArray();
		
		if (this.requiredFields.isEmpty()) {
			LOGGER.info("There are no required fields, assuming no validation is required...");
			return true;
		}

		boolean result = true;
		for (Map.Entry<String, ValidationType> entry: this.requiredFields.entrySet()) {
			String key = entry.getKey();
			switch (entry.getValue()) {
				case NOT_EMPTY:
					LOGGER.info("Going to validate {} against 'not empty' validation rules", key);
					if(!validateNotEmpty(key)){
						updateErrorArray(key);
						result = false;
					}
					break;

				case EMAIL:
					LOGGER.info("Going to validate whether {} is an email address", key);
					if (!validateEmail(entry.getKey())) {
						result = false;
						updateErrorArray(entry.getKey());
					}
					break;

				case PHONE:
					LOGGER.info("Going to validate if {} can be considered valid international phone number", key);
					if(!validatePhone(entry.getKey())){
						result = false;
						updateErrorArray(entry.getKey());
					}
					break;
					
				default:
					LOGGER.info("No validation defined for {}, not doing anything...", key);
					result = true;
					break;
			}
		}
		
		this.validated = true;
		return result;
	}

	private void updateErrorArray(String field){
		JsonObject jsonObject = new JsonObject();
		jsonObject.addProperty(FIELD, field + NOT_VALID);
		errors.add(jsonObject);
	}
}