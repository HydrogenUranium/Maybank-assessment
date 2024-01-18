package com.positive.dhl.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mockStatic;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class UniqueIdTest {

    private final AemContext context = new AemContext();

    @BeforeEach
    void setUp() throws Exception {
        context.addModelsForClasses(UniqueId.class);
    }

    @Mock
    private UUID uuid;

    @Test
    void testUniqueIdGenerated() {
        String expectedId = "id";
        try (MockedStatic<UUID> uuidMock = mockStatic(UUID.class)) {
            uuidMock.when(UUID::randomUUID).thenReturn(uuid);
            Mockito.when(uuid.toString()).thenReturn(expectedId);

            Resource resource = context.resourceResolver().getResource("/");

            UniqueId uniqueId = resource.adaptTo(UniqueId.class);

            assertNotNull(uniqueId, "UniqueId model should not be null");
            assertEquals(expectedId, uniqueId.getId(), "UniqueId should match the mocked value");
        }
    }
}