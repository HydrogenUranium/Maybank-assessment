package com.positive.dhl.core.components;

import com.day.cq.search.Predicate;
import com.day.cq.search.eval.EvaluationContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

import static org.junit.jupiter.api.Assertions.*;

class CaseInsensitiveEqualsTest {

    private Predicate predicate;

    @Mock
    private EvaluationContext context;

    @BeforeEach
    void setUp() {
        predicate = new Predicate("containsIgnoreCase");
    }

    @Test
    void test_withValidPredicate() {
        predicate.set("property", "jcr:content/jcr:title");
        predicate.set("value", "QUERY-term");

        CaseInsensitiveEquals caseInsensitiveEquals = new CaseInsensitiveEquals();

        String actual = caseInsensitiveEquals.getXPathExpression(predicate, context);
        assertEquals("jcr:like(fn:lower-case(jcr:content/@jcr:title),'%query-term%')", actual);
    }

    @Test
    void test_withEmptyPredicate() {
        CaseInsensitiveEquals caseInsensitiveEquals = new CaseInsensitiveEquals();

        String actual = caseInsensitiveEquals.getXPathExpression(predicate, context);
        assertNull(actual);
    }
}
