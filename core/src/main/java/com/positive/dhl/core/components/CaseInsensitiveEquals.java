package com.positive.dhl.core.components;

import com.day.cq.search.Predicate;
import com.day.cq.search.eval.AbstractPredicateEvaluator;
import com.day.cq.search.eval.EvaluationContext;

import lombok.extern.slf4j.Slf4j;
import org.apache.jackrabbit.util.Text;
import org.osgi.service.component.annotations.Component;

/**
 * Custom case insensitive predicate for like operation:
 * containsIgnoreCase.property=jcr:content/jcr:title
 * containsIgnoreCase.value=queryTerm
 * to 'jcr:like(fn:lower-case(jcr:content/@jcr:title),'%queryterm%')'
 */
@Slf4j
@Component(factory = "com.day.cq.search.eval.PredicateEvaluator/containsIgnoreCase")
public class CaseInsensitiveEquals extends AbstractPredicateEvaluator {
    static final String PREDICATE_PROPERTY = "property";
    static final String PREDICATE_VALUE = "value";

    @Override
    public String getXPathExpression(Predicate predicate, EvaluationContext context) {
        log.debug("Evaluating predicate: {}", predicate);

        if (!predicate.hasNonEmptyValue(PREDICATE_PROPERTY)) {
            return null;
        }
        if (predicate.hasNonEmptyValue(PREDICATE_PROPERTY) && null == predicate.get(PREDICATE_VALUE)) {
            return super.getXPathExpression(predicate, context);
        }

        String property = predicate.get(PREDICATE_PROPERTY).replace("/", "/@");
        String value = getTerm(predicate);
        var query = String.format("jcr:like(fn:lower-case(%s),'%s')", property, value);
        log.debug("Generated query: {}", query);
        return query;
    }

    private String getTerm(Predicate predicate) {
        String term = predicate.get(PREDICATE_VALUE).toLowerCase();
        return "%".concat(Text.escapeIllegalXpathSearchChars(term)).concat("%");
    }
}
