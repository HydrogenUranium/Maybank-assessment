package com.dhl.discover.core.dto.marketo;

import com.dhl.discover.core.dto.marketo.formfields.FormFieldsResponse;
import com.dhl.discover.core.dto.marketo.formfields.Result;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class FormFieldsResponseTest {

    private FormFieldsResponse formFieldsResponse;

    @BeforeEach
    void setUp() {
        formFieldsResponse = new FormFieldsResponse();
    }

    @Test
    void testGetFormFields_withNullResult_shouldReturnEmptyList() {
        formFieldsResponse.setResult(null);
        List<String> formFields = formFieldsResponse.getFormFields();

        assertNotNull(formFields, "Form fields list should not be null");
        assertTrue(formFields.isEmpty(), "Form fields list should be empty");
    }

    @Test
    void testGetFormFields_withEmptyResult_shouldReturnEmptyList() {
        formFieldsResponse.setResult(Collections.emptyList());

        List<String> formFields = formFieldsResponse.getFormFields();

        assertNotNull(formFields, "Form fields list should not be null");
        assertTrue(formFields.isEmpty(), "Form fields list should be empty");
    }

    @Test
    void testGetFormFields_withSingleResult_shouldReturnSingleField() {
        Result result = new Result();
        result.setId("firstName");
        formFieldsResponse.setResult(Collections.singletonList(result));
        List<String> formFields = formFieldsResponse.getFormFields();

        assertNotNull(formFields, "Form fields list should not be null");
        assertEquals(1, formFields.size(), "Form fields list should have one entry");
        assertEquals("firstName", formFields.get(0), "Form field should match the input ID");
    }

    @Test
    void testGetFormFields_withMultipleResults_shouldReturnAllFields() {
        List<Result> results = new ArrayList<>();
        Result result1 = new Result();
        result1.setId("firstName");
        Result result2 = new Result();
        result2.setId("lastName");
        Result result3 = new Result();
        result3.setId("email");
        results.add(result1);
        results.add(result2);
        results.add(result3);
        formFieldsResponse.setResult(results);
        List<String> formFields = formFieldsResponse.getFormFields();

        assertNotNull(formFields, "Form fields list should not be null");
        assertEquals(3, formFields.size(), "Form fields list should have three entries");
        assertEquals(Arrays.asList("firstName", "lastName", "email"), formFields,
                "Form fields should match the input IDs in order");
    }

    @Test
    void testGetterAndSetter_forResult() {
        List<Result> results = new ArrayList<>();
        Result result = new Result();
        result.setId("testField");
        results.add(result);

        formFieldsResponse.setResult(results);

        assertSame(results, formFieldsResponse.getResult(), "Getter should return the same list that was set");
        assertEquals(1, formFieldsResponse.getResult().size(), "Result list should have one entry");
        assertEquals("testField", formFieldsResponse.getResult().get(0).getId(), "Result ID should match");
    }

    @Test
    void testJacksonization_defaultValues() {
        FormFieldsResponse response = new FormFieldsResponse();

        assertNull(response.getResult(), "Default result should be null");
    }
}
