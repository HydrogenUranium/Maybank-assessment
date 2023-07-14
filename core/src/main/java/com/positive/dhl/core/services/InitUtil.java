/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.services;

import com.akamai.edgegrid.signer.ClientCredential;
import com.akamai.edgegrid.signer.apachehttpclient.ApacheHttpClientEdgeGridInterceptor;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.apache.http.client.config.RequestConfig;
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
	CloseableHttpClient generalClient;

	CloseableHttpClient akamaiClient;

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
	 * Method that provides an instance of {@code CloseableHttpClient}. Goal here is to not waste resources on frequent
	 * re-initializations of the client.
	 * @return CloseableHttpClient (either an existing one or a new one if no client exists yet)
	 */
	public CloseableHttpClient getHttpClient(){

		if(this.generalClient != null){
			return this.generalClient;
		}

		this.generalClient = httpClientBuilderFactory.newBuilder()
				.disableAuthCaching()
				.setDefaultRequestConfig(getRequestConfig())
				.build();
		return this.generalClient;
	}

	/**
	 * Builds the RequestConfig using recommended Adobe (<a href="https://experienceleague.adobe.com/docs/experience-manager-cloud-manager/content/using/custom-code-quality-rules.html?lang=en#http-requests-should-always-have-socket-and-connect-timeouts">values</a>
	 * HTTP Requests should always have Socket and Connect timeouts
	 *
	 * @return new instance of {@link RequestConfig} that we can leverage when initializing the http client
	 */
	private RequestConfig getRequestConfig(){
		return RequestConfig.custom()
				.setConnectTimeout(30000)
				.setSocketTimeout(30000)
				.build();
	}

	/**
	 * Helper method responsible for nullifying the http client instance and re-initializing it again
	 */
	public void resetClient(){
		this.generalClient = null;
		getHttpClient();
	}


	/**
	 * Provides the 'akamai' Http client - http client enhanced with akamai credentials. Not to be confused with {@link InitUtil#getHttpClient()}
	 * @return instance of {@link CloseableHttpClient} ready to be used with Akamai APIs
	 */
	public CloseableHttpClient getAkamaiClient(ClientCredential clientCredential){
		if(null != akamaiClient){
			return akamaiClient;
		}

		akamaiClient = httpClientBuilderFactory.newBuilder()
				.addInterceptorFirst(new ApacheHttpClientEdgeGridInterceptor(clientCredential))
				.setDefaultRequestConfig(getRequestConfig())
				.build();

		return this.akamaiClient;
	}
}
