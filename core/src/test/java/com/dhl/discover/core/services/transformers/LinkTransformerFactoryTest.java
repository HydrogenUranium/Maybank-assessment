package com.dhl.discover.core.services.transformers;

import com.dhl.discover.core.services.PathUtilService;
import org.apache.sling.rewriter.Transformer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LinkTransformerFactoryTest {

    @Mock
    private PathUtilService pathUtilService;

    @Mock
    private LinkTransformerFactory.Configuration configuration;

    @InjectMocks
    private LinkTransformerFactory factory;


    @Test
    void test(){
        when(configuration.rewrite_elements()).thenReturn(new String[]{
                "img:src",
                "source:srcset",
                "source:src",
                "video:poster",
                "video:src",
                "a:href"
        });
        when(configuration.whitelisted_links()).thenReturn(new String[]{"/content/dam/.*"});
        factory.activate(configuration);

        Transformer transformer = factory.createTransformer();

        assertNotNull(transformer);
    }
}