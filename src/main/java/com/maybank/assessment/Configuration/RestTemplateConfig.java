package com.maybank.assessment.Configuration;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URI;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate gRestTemplate() {
        RestTemplate restTemplate = new RestTemplate(disableRedirectsFactory());
        restTemplate.getInterceptors().add(strictHostAllowlistInterceptor("www.googleapis.com"));
        return restTemplate;
    }

    private ClientHttpRequestFactory disableRedirectsFactory() {
        return new SimpleClientHttpRequestFactory() {
            @Override
            protected void prepareConnection(HttpURLConnection connection, String httpMethod) throws IOException {
                super.prepareConnection(connection, httpMethod);
                connection.setInstanceFollowRedirects(false);
            }
        };
    }

    private ClientHttpRequestInterceptor strictHostAllowlistInterceptor(String allowedHost) {
        return new ClientHttpRequestInterceptor() {
            @Override
            public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution)
                    throws IOException {
                URI uri = request.getURI();
                if (!"https".equalsIgnoreCase(uri.getScheme()) || !allowedHost.equalsIgnoreCase(uri.getHost())) {
                    throw new IOException("Blocked outbound request: host/scheme not allowed");
                }
                return execution.execute(request, body);
            }
        };
    }
}
