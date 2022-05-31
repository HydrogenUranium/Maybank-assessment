package com.positive.dhl.core.models;
 
import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import javax.jcr.RepositoryException;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;

import com.day.cq.search.QueryBuilder;

/**
 *
 */
@Model(adaptables=Resource.class)
public class CategoryListing {
    @Inject
    private QueryBuilder builder;

	@Inject
	private ResourceResolver resourceResolver;
	
	@Inject
	@Named("path1")
	@Optional
	public String path1;
	
	@Inject
	@Named("path2")
	@Optional
	public String path2;
	
	@Inject
	@Named("path3")
	@Optional
	public String path3;
	
	@Inject
	@Named("path4")
	@Optional
	public String path4;
	
	@Inject
	@Named("path5")
	@Optional
	public String path5;
	
	@Inject
	@Named("path6")
	@Optional
	public String path6;
	
	private CategoryListingItem category1;
	private CategoryListingItem category2;
	private CategoryListingItem category3;
	private CategoryListingItem category4;
	private CategoryListingItem category5;
	private CategoryListingItem category6;
	
    /**
	 * 
	 */
	public CategoryListingItem getCategory1() {
		return category1;
	}

    /**
	 * 
	 */
	public void setCategory1(CategoryListingItem category1) {
		this.category1 = category1;
	}

    /**
	 * 
	 */
	public CategoryListingItem getCategory2() {
		return category2;
	}

    /**
	 * 
	 */
	public void setCategory2(CategoryListingItem category2) {
		this.category2 = category2;
	}

    /**
	 * 
	 */
	public CategoryListingItem getCategory3() {
		return category3;
	}

    /**
	 * 
	 */
	public void setCategory3(CategoryListingItem category3) {
		this.category3 = category3;
	}

    /**
	 * 
	 */
	public CategoryListingItem getCategory4() {
		return category4;
	}

    /**
	 * 
	 */
	public void setCategory4(CategoryListingItem category4) {
		this.category4 = category4;
	}

    /**
	 * 
	 */
	public CategoryListingItem getCategory5() {
		return category5;
	}

    /**
	 * 
	 */
	public void setCategory5(CategoryListingItem category5) {
		this.category5 = category5;
	}

    /**
	 * 
	 */
	public CategoryListingItem getCategory6() {
		return category6;
	}

    /**
	 * 
	 */
	public void setCategory6(CategoryListingItem category6) {
		this.category6 = category6;
	}

    /**
	 * 
	 */
	@PostConstruct
	protected void init() throws RepositoryException {
		if (path1 != null && path1.length() > 0) {
			category1 = new CategoryListingItem(path1, builder, resourceResolver);
		}
		if (path2 != null && path2.length() > 0) {
			category2 = new CategoryListingItem(path2, builder, resourceResolver);
		}
		if (path3 != null && path3.length() > 0) {
			category3 = new CategoryListingItem(path3, builder, resourceResolver);
		}
		if (path4 != null && path4.length() > 0) {
			category4 = new CategoryListingItem(path4, builder, resourceResolver);
		}
		if (path5 != null && path5.length() > 0) {
			category5 = new CategoryListingItem(path5, builder, resourceResolver);
		}
		if (path6 != null && path6.length() > 0) {
			category6 = new CategoryListingItem(path6, builder, resourceResolver);
		}
	}
}