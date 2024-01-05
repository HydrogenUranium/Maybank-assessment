package com.positive.dhl.core.components;

import com.day.cq.search.Predicate;
import com.day.cq.search.eval.AbstractPredicateEvaluator;
import com.day.cq.search.eval.EvaluationContext;

import lombok.extern.slf4j.Slf4j;
import org.osgi.service.component.annotations.Component;

@Slf4j
@Component(factory = "com.day.cq.search.eval.PredicateEvaluator/equalsIgnoreCase")
public class CaseInsensitiveEquals extends AbstractPredicateEvaluator {
    static final String PREDICATE_PROPERTY = "property";
    static final String PREDICATE_VALUE = "value";

    @Override
    public String getXPathExpression(Predicate predicate, EvaluationContext context) {
        log.debug("Evaluating predicate: {}", predicate);
        String property = predicate.get(PREDICATE_PROPERTY);
        String value = predicate.get(PREDICATE_VALUE).toLowerCase().replace("'", "''");
        var query = String.format("fn:lower-case(@%s)='%s'", property, value);
        log.debug("Generated query: {}", query);
        return query;
    }
}
