package com.dhl.discover.core.services.transformers;

import com.dhl.discover.core.services.PathUtilService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class NoFollowExternalLinkTransformerFactoryTest {

    @Mock
    private PathUtilService pathUtilService;

    @InjectMocks
    private NoFollowExternalLinkTransformerFactory factory;

    @Test
    void test() {
        assertNotNull(factory.createTransformer());
    }
}