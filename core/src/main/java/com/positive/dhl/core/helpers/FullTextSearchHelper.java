package com.positive.dhl.core.helpers;

import com.positive.dhl.core.utils.IndexUtils;
import com.positive.dhl.core.utils.QueryManagerUtils;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.resource.ResourceResolver;

import javax.jcr.RepositoryException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Arrays;

@UtilityClass
@Slf4j
public class FullTextSearchHelper {
    public static final int MAX_TERMS_FULL_TEXT_SEARCH = 20;
    public static final int MAX_COMBINATION_FULL_TEXT_SEARCH = 5;

    public List<List<String>> getFullTextSpellcheckedSearchTerms(String string, String searchScope, ResourceResolver resourceResolver) {
        var trimmedString = string.trim().toLowerCase();
        List<List<String>> spellcheckedTerms;
        List<List<String>> terms = getFullTextSearchTerms(trimmedString);

        try {
            spellcheckedTerms = getSpellcheckedFullTextSearchTerms(trimmedString, searchScope, resourceResolver);
        } catch (RepositoryException e) {
            log.warn("Failed to get spellchecked Terms");
            spellcheckedTerms = new ArrayList<>();
        }

        return combineSearchTermLists(spellcheckedTerms, terms);
    }

    private List<List<String>> combineSearchTermLists(List<List<String>> list1, List<List<String>> list2) {
        int size1 = list1.size();
        int size2 = list2.size();
        int maxSize = Math.max(size1, size2);

        List<List<String>> result = new ArrayList<>();

        for (var i = 0; i < maxSize; i++) {
            Set<String> mergedSet = new HashSet<>();

            if (i < size1) {
                mergedSet.addAll(list1.get(size1 - 1 - i));
            }
            if (i < size2) {
                mergedSet.addAll(list2.get(size2 - 1 - i));
            }

            result.add(0, new ArrayList<>(mergedSet));
        }

        return result;
    }

    private List<List<String>> getSpellcheckedFullTextSearchTerms(String string, String searchScope, ResourceResolver resourceResolver) throws RepositoryException {
        List<String> words = getWords(string);
        List<String> spellcheckedWords = new ArrayList<>();

        var queryManager = QueryManagerUtils.getQueryManager(resourceResolver);
        var indexName = IndexUtils.getSuggestionIndexName(searchScope, resourceResolver);

        for (String word : words) {
            List<String> spellcheckSuggestions = QueryManagerUtils.getSpellcheckedWords(word, indexName, queryManager);
            spellcheckedWords.add(spellcheckSuggestions.isEmpty() ? word : spellcheckSuggestions.get(0));
        }

        return getFullTextSearchTerms(String.join(" ", spellcheckedWords));
    }

    public List<List<String>> getFullTextSearchTerms(String string) {
        var trimmedString = string.trim().toLowerCase();
        List<List<String>> terms = new ArrayList<>();
        List<String> words = getWords(trimmedString);

        var longestCombination = Integer.min(MAX_COMBINATION_FULL_TEXT_SEARCH, words.size());

        for (var length = longestCombination; length > 0; length--) {
            terms.add(getWordCombinations(trimmedString, length));
        }

        return terms;
    }

    private List<String> getWords(String string) {
        return Arrays.asList(string.trim().split("\\s+"));
    }

    private List<String> getWordCombinations(String string, int length) {
        List<String> words = getWords(string);
        List<String> terms = new ArrayList<>();

        for (var start = 0; start <= words.size() - length && terms.size() < MAX_TERMS_FULL_TEXT_SEARCH; start++) {
            var combination = new StringBuilder();
            for (int i = start; i < start + length; i++) {
                if (i > start) {
                    combination.append(" ");
                }
                combination.append(words.get(i));
            }
            terms.add(combination.toString());
        }

        return terms;
    }
}
