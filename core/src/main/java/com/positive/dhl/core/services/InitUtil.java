/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.services;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.osgi.services.HttpClientBuilderFactory;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * Simple utility class whose only purpose (so far, anyway) is to ensure we do not generate the
 * {@link com.fasterxml.jackson.databind.ObjectMapper} or {@link org.apache.http.impl.client.CloseableHttpClient} objects unnecessarily.
 */
@Component(
		service = InitUtil.class
)
public class InitUtil {

	@Reference
	private HttpClientBuilderFactory httpClientBuilderFactory;

	ObjectMapper objectMapper;
	CloseableHttpClient client;

	/**
	 * Provides an instance of Jackson's object mapper (
	 * <a href="https://javadoc.io/doc/com.fasterxml.jackson.core/jackson-databind/2.3.1/com/fasterxml/jackson/databind/ObjectMapper.html">see here</a>) stored in this
	 * object's properties. If the property is {@code null} it first constructs the object mapper and then returns it
	 * @return instance of {@code ObjectMapper}, jackson's library entry point
	 */
	public ObjectMapper getObjectMapper(){
		if(this.objectMapper != null){
			return this.objectMapper;
		}
		this.objectMapper = new ObjectMapper();
		objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
		return this.objectMapper;
	}

	/**
	 * Method that provides an instance of {@code CloseableHttpClient}
	 * @return CloseableHttpClient with Akamai credentials built in (either an existing one or a new one if no client exists yet)
	 */
	public CloseableHttpClient getHttpClient(){

		if(this.client != null){
			return this.client;
		}

		this.client = httpClientBuilderFactory.newBuilder()
				.disableAuthCaching()
				.build();
		return this.client;
	}

	/**
	 * Helper method responsible for nullifying the http client instance and re-initializing it again
	 */
	public void resetClient(){
		this.client = null;
		getHttpClient();
	}
}
