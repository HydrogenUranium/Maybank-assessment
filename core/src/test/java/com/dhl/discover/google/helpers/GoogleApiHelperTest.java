package com.dhl.discover.google.helpers;

import org.apache.http.StatusLine;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.security.NoSuchAlgorithmException;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class GoogleApiHelperTest {

    @Mock
    private CloseableHttpResponse mockHttpResponse;

    @Mock
    private StatusLine mockStatusLine;

    @ParameterizedTest
    @CsvSource({
            "test@dhl.com, 0e0f35136bc2cf0ae7ea4d7a71d8d1d6d0b2c7cc58c24aab2f3eba4202b06075",
            "test@dhl.discover.com, 2ceb6f0cb92546784b8cb965a078fdf3335f2120f1b6b6f9ac7afbd0243fd228",
            "user@googlemail.com, b7821fcf987f87d1b1ebea1bdbe5b2cda97ce6b69c4b5fd2d987801948848b35"
    })
    void testNormalizeAndHashEmailAddress(String email, String expectedHash) throws NoSuchAlgorithmException {
        String result = GoogleApiHelper.normalizeAndHashEmailAddress(email);
        assertEquals(expectedHash, result);
    }

}