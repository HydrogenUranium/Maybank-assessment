package com.positive.dhl.core.services.impl;

import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PublisherGroupServiceTest {

    @Mock
    private PublisherGroupService.Configuration configuration;

    private final PublisherGroupService publisherGroupService = new PublisherGroupService();

    @ParameterizedTest
    @CsvSource({
            "/content/my=malaysia, /content/my/home, global",
            "/content/my:malaysia, /content/en/home, global",
            "/content/my:malaysia, /content/my/home, malaysia",
    })
    void getPublisherGroup(String mapping, String pagePath, String expected) {
        when(configuration.mappings()).thenReturn(new String[]{mapping});
        when(configuration.defaultParticipant()).thenReturn("global");
        publisherGroupService.activate(configuration);

        String result = publisherGroupService.getPublisherGroup(pagePath);

        assertEquals(expected, result);
    }
}