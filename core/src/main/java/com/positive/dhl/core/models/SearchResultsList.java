package com.positive.dhl.core.models;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.*;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import com.day.cq.wcm.api.Page;
import org.apache.jackrabbit.util.Text;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;

import com.day.cq.wcm.api.NameConstants;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class SearchResultsList {
	protected final Integer RESULTS_PER_PAGE = 8;
	protected final Integer MAX_TERMS_ALLOWED = 5;
	
	@Inject
	private SlingHttpServletRequest request;

	@Inject
	private ResourceResolver resourceResolver;

    @Inject
    private QueryBuilder builder;

	@Inject
	private Page currentPage;
	
    private List<Article> results;
	private HashMap<String, Integer> resultSummary;
	private List<Article> trendingArticles;
	private String searchTerm;
	private String searchResultsType;
	private Boolean noSearchTerm;
	private List<Article> pagedResults;
	private Integer numPages;
	private Integer pageNumber;
	private Integer totalResults;
	private List<Integer> pageNumbers;
	private Integer previousPageNumber;
	private Integer nextPageNumber;
	private String sortBy;
	private String test;
	
    /**
	 * 
	 */
	public List<Article> getResults() {
		return new ArrayList<Article>(results);
	}

    /**
	 * 
	 */
	public void setResults(List<Article> results) {
		this.results = new ArrayList<Article>(results);
	}

    /**
	 * 
	 */
	public HashMap<String, Integer> getResultSummary() {
		return resultSummary;
	}

    /**
	 * 
	 */
	public void setResultSummary(HashMap<String, Integer> resultSummary) {
		this.resultSummary = resultSummary;
	}

    /**
	 * 
	 */
	public List<Article> getTrendingArticles() {
		return new ArrayList<Article>(trendingArticles);
	}

    /**
	 * 
	 */
	public void setTrendingArticles(List<Article> trendingArticles) {
		this.trendingArticles = new ArrayList<Article>(trendingArticles);
	}

    /**
	 * 
	 */
	public String getSearchTerm() {
		return searchTerm;
	}

    /**
	 * 
	 */
	public void setSearchTerm(String searchTerm) {
		this.searchTerm = searchTerm;
	}

    /**
	 * 
	 */
	public String getSearchResultsType() {
		return searchResultsType;
	}

    /**
	 * 
	 */
	public void setSearchResultsType(String searchResultsType) {
		this.searchResultsType = searchResultsType;
	}

    /**
	 * 
	 */
	public Boolean getNoSearchTerm() {
		return noSearchTerm;
	}

    /**
	 * 
	 */
	public void setNoSearchTerm(Boolean noSearchTerm) {
		this.noSearchTerm = noSearchTerm;
	}

    /**
	 * 
	 */
	public List<Article> getPagedResults() {
		return new ArrayList<Article>(pagedResults);
	}

    /**
	 * 
	 */
	public void setPagedResults(List<Article> pagedResults) {
		this.pagedResults = new ArrayList<Article>(pagedResults);
	}

    /**
	 * 
	 */
	public Integer getNumPages() {
		return numPages;
	}

    /**
	 * 
	 */
	public void setNumPages(Integer numPages) {
		this.numPages = numPages;
	}

    /**
	 * 
	 */
	public Integer getPageNumber() {
		return pageNumber;
	}

    /**
	 * 
	 */
	public void setPageNumber(Integer pageNumber) {
		this.pageNumber = pageNumber;
	}

    /**
	 * 
	 */
	public Integer getTotalResults() {
		return totalResults;
	}

    /**
	 * 
	 */
	public void setTotalResults(Integer totalResults) {
		this.totalResults = totalResults;
	}

    /**
	 * 
	 */
	public List<Integer> getPageNumbers() {
		return new ArrayList<Integer>(pageNumbers);
	}

    /**
	 * 
	 */
	public void setPageNumbers(List<Integer> pageNumbers) {
		this.pageNumbers = new ArrayList<Integer>(pageNumbers);
	}

    /**
	 * 
	 */
	public Integer getPreviousPageNumber() {
		return previousPageNumber;
	}

    /**
	 * 
	 */
	public void setPreviousPageNumber(Integer previousPageNumber) {
		this.previousPageNumber = previousPageNumber;
	}

    /**
	 * 
	 */
	public Integer getNextPageNumber() {
		return nextPageNumber;
	}

    /**
	 * 
	 */
	public void setNextPageNumber(Integer nextPageNumber) {
		this.nextPageNumber = nextPageNumber;
	}

    /**
	 * 
	 */
	public String getSortBy() {
		return sortBy;
	}

    /**
	 * 
	 */
	public void setSortBy(String sortBy) {
		this.sortBy = sortBy;
	}

    /**
	 * 
	 */
	public String getTest() {
		return test;
	}

    /**
	 * 
	 */
	public void setTest(String test) {
		this.test = test;
	}

    /**
	 * 
	 */
	@PostConstruct
    protected void init() throws RepositoryException, UnsupportedEncodingException {
		searchTerm = request.getParameter("searchfield");
		searchTerm = java.net.URLDecoder.decode(searchTerm, String.valueOf(StandardCharsets.UTF_8));

		searchResultsType = request.getParameter("searchResultsType");
		
		String requestPageNumber = request.getParameter("page");
		if ((requestPageNumber != null) && (requestPageNumber.matches("\\d+"))) {
			pageNumber = Integer.parseInt(requestPageNumber);
		} else {
			pageNumber = 1;
		}
		
		String requestSortBy = request.getParameter("sort");
		if (requestSortBy != null) {
			requestSortBy = requestSortBy.trim().toLowerCase();
			if (!(("date").equals(requestSortBy) || ("title").equals(requestSortBy))) {
				sortBy = "date";
			} else {
				sortBy = requestSortBy;
			}
			
		} else {
			sortBy = "date";
		}
		
		resultSummary = new HashMap<>();
		resultSummary.put("article", 0);
		resultSummary.put("video", 0);
		resultSummary.put("competition", 0);
		resultSummary.put("download", 0);
		resultSummary.put("interactive", 0);
		if (!resultSummary.containsKey(searchResultsType)) {
			searchResultsType = "";
		}
		totalResults = 0;

		noSearchTerm = false;
		results = new ArrayList<Article>();
		if ((searchTerm == null) || (searchTerm.trim().length() == 0)) {
			noSearchTerm = true;
			
		} else {
			Page home = currentPage.getAbsoluteParent(2);
			if (builder != null && home != null) {
				Map<String, String> map = new HashMap<String, String>();
				map.put("path", home.getPath());
				map.put("type", NameConstants.NT_PAGE);
				
				// group terms
				map.put("1_group.p.or", "true");
				String[] fields = { "jcr:content/jcr:title", "jcr:content/pageTitle", "jcr:content/navTitle", "jcr:content/cq:tags" };
				String[] terms = searchTerm.trim().split("\\s");
				String[] termsLowercase = searchTerm.toLowerCase().trim().split("\\s");
				for (int i = 0; i < fields.length; i++) {
					map.put(String.format("1_group.%1$s_group.p.or", (i + 1)), "true");
					int termsCount = 0;
					for (int j = 0; j < terms.length; j++) {
						String term = terms[j];

						// words with less than 3 characters are ignored
						if (term.trim().length() < 3) {
							continue;
						}

						termsCount++;
						map.put(String.format("1_group.%1$s_group.1_group.%2$s_property", (i + 1), (j + 1)), fields[i]);
						map.put(String.format("1_group.%1$s_group.1_group.%2$s_property.operation", (i + 1), (j + 1)), "like");
						map.put(String.format("1_group.%1$s_group.1_group.%2$s_property.value", (i + 1), (j + 1)), "%".concat(Text.escapeIllegalXpathSearchChars(term)).concat("%"));

						if (termsCount >= MAX_TERMS_ALLOWED) {
							break;
						}
					}

					termsCount = 0;
					for (int j = 0; j < termsLowercase.length; j++) {
						String term = termsLowercase[j];

						// words with less than 3 characters are ignored
						if (term.trim().length() < 3) {
							continue;
						}

						termsCount++;
						map.put(String.format("1_group.%1$s_group.2_group.%2$s_property", (i + 1), (j + 1)), fields[i]);
						map.put(String.format("1_group.%1$s_group.2_group.%2$s_property.operation", (i + 1), (j + 1)), "like");
						map.put(String.format("1_group.%1$s_group.2_group.%2$s_property.value", (i + 1), (j + 1)), "%".concat(Text.escapeIllegalXpathSearchChars(term)).concat("%"));

						if (termsCount >= MAX_TERMS_ALLOWED) {
							break;
						}
					}

					termsCount = 0;
					for (int j = 0; j < termsLowercase.length; j++) {
						String term = termsLowercase[j];
						
						// words with less than 3 characters are ignored 
						if (term.trim().length() < 3) {
							continue;
						}
						
						term = Character.toUpperCase(term.charAt(0)) + term.substring(1);

						termsCount++;
						map.put(String.format("1_group.%1$s_group.3_group.%2$s_property", (i + 1), (j + 1)), fields[i]);
						map.put(String.format("1_group.%1$s_group.3_group.%2$s_property.operation", (i + 1), (j + 1)), "like");
						map.put(String.format("1_group.%1$s_group.3_group.%2$s_property.value", (i + 1), (j + 1)), "%".concat(Text.escapeIllegalXpathSearchChars(term)).concat("%"));

						if (termsCount >= MAX_TERMS_ALLOWED) {
							break;
						}
					}
				}

    			// ordering & limiting
				map.put("orderby", "@jcr:content/jcr:score");
    			map.put("orderby.sort", "desc");
    			map.put("p.limit", "50");
	
    			// execute
				List<String> articleTypes = Article.GetArticlePageTypes();
				Query query = builder.createQuery(PredicateGroup.create(map), resourceResolver.adaptTo(Session.class));
		        SearchResult searchResult = query.getResult();
		        if (searchResult != null) {
		        	int count = 0;
					for (Hit hit: searchResult.getHits()) {
						Resource resource = resourceResolver.getResource(hit.getPath());
						if (resource == null) {
							continue;
						}
						
						ValueMap properties = resource.adaptTo(ValueMap.class);
						if (properties == null) {
							continue;
						}

						boolean isCorrectPageType = false;
						String resourceType = properties.get("jcr:content/sling:resourceType", "");
						for (String articleType : articleTypes) {
							if (resourceType.contains(String.format("dhl/components/pages/%1$s", articleType))) {
								isCorrectPageType = true;
								break;
							}
						}

						if (!isCorrectPageType) {
							continue;
						}

						Article article = new Article(hit.getPath(), resourceResolver);

						if (!resultSummary.containsKey(article.getIcon())) {
							resultSummary.put(article.getIcon(), 0);
						}
						resultSummary.put(article.getIcon(), resultSummary.get(article.getIcon()) + 1);
						totalResults++;

						if (searchResultsType.length() == 0) {
							article.setIndex(count);
							article.setFourth((article.getIndex() + 1) % 4 == 0);
							results.add(article);
							count++;
							
						} else {
							if (searchResultsType.equals(article.getIcon())) {
								article.setIndex(count);
								article.setFourth((article.getIndex() + 1) % 4 == 0);
								results.add(article);
								count++;
							}
						}
					}
					
					//sorting
					if (("title").equals(sortBy)) {
						results.sort((o1, o2) -> o1.getTitle().compareTo(o2.getTitle()));
					} else {
						results.sort((o1, o2) -> o2.getCreated().compareTo(o1.getCreated()));
					}
					
					//paging
					numPages = (int) Math.ceil((double)results.size() / (double)RESULTS_PER_PAGE);
					if (pageNumber > numPages) {
						pageNumber = 1;
					}
					
					int startAt = ((pageNumber - 1) * RESULTS_PER_PAGE);
					int endAt = Math.min((startAt + RESULTS_PER_PAGE), results.size());
					pagedResults = results.subList(startAt, endAt);
					
					previousPageNumber = ((pageNumber <= 1) ? 1 : (pageNumber - 1));
					nextPageNumber = ((pageNumber >= numPages) ? numPages : (pageNumber + 1));
					
					pageNumbers = new ArrayList<Integer>();
					for (int i = 1; i <= numPages; i++) {
						pageNumbers.add(i);
					}

					Iterator<Resource> resources = searchResult.getResources();
					if (resources.hasNext()) {
						resources.next().getResourceResolver().close();
					}
					
		        } else {
		        	previousPageNumber = 0;
		        	nextPageNumber = 0;
		        	pageNumber = 0;
		        	numPages = 0;
		        }
			}

			List<Article> trendingArticleResults = new ArrayList<Article>();
			trendingArticles = new ArrayList<Article>();
			if (results.size() == 0) {
	    		if (builder != null) {
	    			Map<String, String> map = new HashMap<String, String>();
	    			map.put("type", NameConstants.NT_PAGE);

	    			map.put("group.p.or", "true");
	    			
	    			List<String> articleTypes = Article.GetArticlePageTypes();
	    			for (int x = 0; x < articleTypes.size(); x++) {
	    				map.put(String.format("group.%1$s_property", (x + 1)), "jcr:content/sling:resourceType");
	    				map.put(String.format("group.%1$s_property.value", (x + 1)), String.format("dhl/components/pages/%1$s", articleTypes.get(x)));
	    				map.put(String.format("group.%1$s_property.operation", (x + 1)), "like");
	    			}
	    			
	    			map.put("orderby", "@jcr:content/custompublishdate");
	    			map.put("orderby.sort", "desc");
	    			
	    			map.put("p.limit", "10");

	    			Query query = builder.createQuery(PredicateGroup.create(map), resourceResolver.adaptTo(Session.class));
	    	        SearchResult searchResult = query.getResult();
	    	        if (searchResult != null) {
	    				int count = 0;
	    				for (Hit hit: searchResult.getHits()) {
	    					ValueMap hitProperties = hit.getProperties();
	    					Boolean hideInNav = hitProperties.get("hideInNav", false);
	    					if (hideInNav) {
	    						continue;
	    					}
	    					
	    					Article article = new Article(hit.getPath(), resourceResolver);
	    					article.setIndex(count);
	    					trendingArticleResults.add(article);
	    				}
	    				
	    				trendingArticleResults.sort((o1, o2) -> o2.getCounter().compareTo(o1.getCounter()));

						for (Article article: trendingArticleResults) {
	    					trendingArticles.add(article);

	    					count++;
	    					if (count > 2) break;
	    				}

						Iterator<Resource> resources = searchResult.getResources();
						if (resources.hasNext()) {
							resources.next().getResourceResolver().close();
						}
	    	        }
	    		}
			}
		}
	}
	
    /**
	 * 
	 */
	public Integer getCountArticles() {
		return getCategoryCount("article");
	}
	
    /**
	 * 
	 */
	public Integer getCountVideo() {
		return getCategoryCount("video");
	}
	
    /**
	 * 
	 */
	public Integer getCountCompetition() {
		return getCategoryCount("competition");
	}
	
    /**
	 * 
	 */
	public Integer getCountDownload() {
		return getCategoryCount("download");
	}
	
    /**
	 * 
	 */
	public Integer getCountInteractive() {
		return getCategoryCount("interactive");
	}
	
    /**
	 * 
	 */
	public Integer getCountAll() {
		return totalResults;
	}
	
    /**
	 * 
	 */
	private int getCategoryCount(String category) {
		if (resultSummary.containsKey(category)) {
			return resultSummary.get(category);
		}
		return 0;
	}
}