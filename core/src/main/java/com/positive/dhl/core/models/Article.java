package com.positive.dhl.core.models;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import com.day.cq.wcm.api.NameConstants;

/**
 *
 */
@Model(adaptables=Resource.class)
public class Article {
	@Inject
	private ResourceResolver resourceResolver;
	
    @Inject
    public String path;
	
    private Boolean valid;
    private Boolean current;
    private int index;
	private Boolean third;
	private Boolean fourth;
	private String createdfriendly;
	private String created;
	private String icon;
	private String grouptitle;
	private String grouppath;
	private String fullTitle;
	private String title;
	private String brief;
	private String author;
	private String authortitle;
	private String authorimage;
	private String readtime;
	private String listimage;
	private String heroimagemob;
	private String heroimagetab;
	private String heroimagedt;
	private String youtubeid;
	private Boolean showshipnow;
	private List<TagWrapper> tags;
	private Integer counter;
	
    /**
	 * 
	 */
	public Boolean getValid() {
		return valid;
	}

    /**
	 * 
	 */
	public void setValid(Boolean valid) {
		this.valid = valid;
	}

    /**
	 * 
	 */
	public Boolean getCurrent() {
		return current;
	}

    /**
	 * 
	 */
	public void setCurrent(Boolean current) {
		this.current = current;
	}

    /**
	 * 
	 */
	public int getIndex() {
		return index;
	}

    /**
	 * 
	 */
	public void setIndex(int index) {
		this.index = index;
	}

    /**
	 * 
	 */
	public Boolean getThird() {
		return third;
	}

    /**
	 * 
	 */
	public void setThird(Boolean third) {
		this.third = third;
	}

    /**
	 * 
	 */
	public Boolean getFourth() {
		return fourth;
	}

    /**
	 * 
	 */
	public void setFourth(Boolean fourth) {
		this.fourth = fourth;
	}

    /**
	 * 
	 */
	public String getCreatedfriendly() {
		return createdfriendly;
	}

    /**
	 * 
	 */
	public void setCreatedfriendly(String createdfriendly) {
		this.createdfriendly = createdfriendly;
	}

    /**
	 * 
	 */
	public String getCreated() {
		return created;
	}

    /**
	 * 
	 */
	public void setCreated(String created) {
		this.created = created;
	}

    /**
	 * 
	 */
	public String getIcon() {
		return icon;
	}

    /**
	 * 
	 */
	public void setIcon(String icon) {
		this.icon = icon;
	}

    /**
	 * 
	 */
	public String getGrouptitle() {
		return grouptitle;
	}

    /**
	 * 
	 */
	public void setGrouptitle(String grouptitle) {
		this.grouptitle = grouptitle;
	}

    /**
	 * 
	 */
	public String getGrouppath() {
		return grouppath;
	}

    /**
	 * 
	 */
	public void setGrouppath(String grouppath) {
		this.grouppath = grouppath;
	}

    /**
	 * 
	 */
	public String getFullTitle() {
		return fullTitle;
	}

    /**
	 * 
	 */
	public void setFullTitle(String fullTitle) {
		this.fullTitle = fullTitle;
	}

    /**
	 * 
	 */
	public String getTitle() {
		return title;
	}

    /**
	 * 
	 */
	public void setTitle(String title) {
		this.title = title;
	}

    /**
	 * 
	 */
	public String getBrief() {
		return brief;
	}

    /**
	 * 
	 */
	public void setBrief(String brief) {
		this.brief = brief;
	}

    /**
	 * 
	 */
	public String getAuthor() {
		return author;
	}

    /**
	 * 
	 */
	public void setAuthor(String author) {
		this.author = author;
	}

    /**
	 * 
	 */
	public String getAuthortitle() {
		return authortitle;
	}

    /**
	 * 
	 */
	public void setAuthortitle(String authortitle) {
		this.authortitle = authortitle;
	}

    /**
	 * 
	 */
	public String getAuthorimage() {
		return authorimage;
	}

    /**
	 * 
	 */
	public void setAuthorimage(String authorimage) {
		this.authorimage = authorimage;
	}

    /**
	 * 
	 */
	public String getReadtime() {
		return readtime;
	}

    /**
	 * 
	 */
	public void setReadtime(String readtime) {
		this.readtime = readtime;
	}

    /**
	 * 
	 */
	public String getListimage() {
		return listimage;
	}

    /**
	 * 
	 */
	public void setListimage(String listimage) {
		this.listimage = listimage;
	}

    /**
	 * 
	 */
	public String getHeroimagemob() {
		return heroimagemob;
	}

    /**
	 * 
	 */
	public void setHeroimagemob(String heroimagemob) {
		this.heroimagemob = heroimagemob;
	}

    /**
	 * 
	 */
	public String getHeroimagetab() {
		return heroimagetab;
	}

    /**
	 * 
	 */
	public void setHeroimagetab(String heroimagetab) {
		this.heroimagetab = heroimagetab;
	}

    /**
	 * 
	 */
	public String getHeroimagedt() {
		return heroimagedt;
	}

    /**
	 * 
	 */
	public void setHeroimagedt(String heroimagedt) {
		this.heroimagedt = heroimagedt;
	}

    /**
	 * 
	 */
	public String getYoutubeid() {
		return youtubeid;
	}

    /**
	 * 
	 */
	public void setYoutubeid(String youtubeid) {
		this.youtubeid = youtubeid;
	}

    /**
	 * 
	 */
	public Boolean getShowshipnow() {
		return showshipnow;
	}

    /**
	 * 
	 */
	public void setShowshipnow(Boolean showshipnow) {
		this.showshipnow = showshipnow;
	}

    /**
	 * 
	 */
	public List<TagWrapper> getTags() {
		return new ArrayList<TagWrapper>(tags);
	}

    /**
	 * 
	 */
	public void setTags(List<TagWrapper> tags) {
		this.tags = new ArrayList<TagWrapper>(tags);
	}

    /**
	 * 
	 */
	public Integer getCounter() {
		return counter;
	}

    /**
	 * 
	 */
	public void setCounter(Integer counter) {
		this.counter = counter;
	}

    /**
	 * 
	 */
	public static List<String> GetArticlePageTypes() {
		List<String> output = new ArrayList<String>();

		output.add("article");
		output.add("articlegated");
		output.add("articlewithtrending");
		output.add("animatedpage201901");
		output.add("animatedpage20190225");
		output.add("animatedpage20190523");
		output.add("animatedpage20190624");
		output.add("animatedpage20190724");
		output.add("animatedpage20190805");
		output.add("animatedpage20191021");
		output.add("animatedpage20191025");
		output.add("animatedpage20191101");
		output.add("animatedpage20191122");
		
		return output;
	}
	
    /**
	 * 
	 */
	public Article() { }
	
    /**
	 * 
	 */
	public Article(String path, ResourceResolver resourceResolver) {
		this.resourceResolver = resourceResolver;
		this.path = path;
		this.init();
	}
    
    /**
	 * 
	 */
    @PostConstruct
	protected void init() {
    	valid = false;
		Resource resource = resourceResolver.getResource(path);
		if (resource != null) {
	    		ValueMap properties = resource.adaptTo(ValueMap.class);
	    		if (properties != null) {
	    			Date createdDate;
	    			String customDate = properties.get("jcr:content/custompublishdate", "");
    				if ((customDate.trim().length() > 0) && (customDate.contains("T"))) {
						try {
	    					String[] parts = customDate.split("T");
							createdDate = (new SimpleDateFormat("yyyy-MM-dd")).parse(parts[0]);
							
						} catch (ParseException e) {
    						createdDate = properties.get("jcr:content/custompublishdate", new Date());
						}
    					
    				} else {
    					createdDate = properties.get("jcr:content/custompublishdate", new Date());
    				}
	    			
	    			
	    			created = (new SimpleDateFormat("yyyy-MM-dd")).format(createdDate);
	    			createdfriendly = (new SimpleDateFormat("dd MMMM yyyy")).format(createdDate);
	    			icon = properties.get("jcr:content/mediatype", "");
	    			
	    			grouptitle = getGroupTitle(resource);
	    			grouppath = getGroupPath(resource);
	    			
	    			fullTitle = properties.get("jcr:content/jcr:title", "");
	    			title = properties.get("jcr:content/navTitle", "");
	    			if ((title == null) || (title.trim().length() == 0)) {
	    				title = fullTitle;
	    			}
	    			brief = properties.get("jcr:content/listbrief", "");
	    			if (brief != null && brief.length() > 120) {
	    				brief = brief.substring(0, 120).concat("...");
	    			}
	    			
	    			listimage = properties.get("jcr:content/listimage", "");

	    			heroimagemob = properties.get("jcr:content/heroimagemob", "");
	    			heroimagetab = properties.get("jcr:content/heroimagetab", "");
	    			heroimagedt = properties.get("jcr:content/heroimagedt", "");
	    			youtubeid = properties.get("jcr:content/youtubeid", "");
	    			readtime = properties.get("jcr:content/readtime", "");

	    			author = properties.get("jcr:content/author", "");
	    			authortitle = properties.get("jcr:content/authortitle", "");
	    			authorimage = properties.get("jcr:content/authorimage", "");

	    			showshipnow = properties.get("jcr:content/showshipnow", false);
	    			
	    			counter = properties.get("jcr:content/counter", 0);

	    			tags = new ArrayList<TagWrapper>();
	    			/*
	    			TagManager tagManager = resourceResolver.adaptTo(TagManager.class);
	    			String[] tagPaths = properties.get("jcr:content/cq:tags", new String[] { });

	    			for (String tagPath: tagPaths) {
	    				Tag tag = tagManager.resolve(tagPath);
	    				if (tag != null) {
	    					tags.add(new TagWrapper(tag));
	    				}
	    			}
	    			*/
	    			
	    			valid = true;
	    		}
		}
	}
    
    /**
	 * 
	 */
    private String getGroupTitle(Resource self) {
		if (self.getParent() != null) {
			Resource parent = self.getParent();
			if (parent != null) {
				ValueMap parentProperties = parent.adaptTo(ValueMap.class);
	    		if ((parentProperties != null) && ("dhl/components/pages/home").equals(parentProperties.get("jcr:content/sling:resourceType", ""))) {
	    			ValueMap selfProperties = self.adaptTo(ValueMap.class);
	
	    			if (selfProperties != null) {
		    			String gtitle = selfProperties.get("jcr:content/navTitle", "");
		    			if ((gtitle == null) || (gtitle.trim().length() == 0)) {
		    				gtitle = selfProperties.get("jcr:content/jcr:title", "");
		    			}
		    			
		    			return gtitle;
	    			}
	    		}
				return getGroupTitle(parent);
			}
		}
		return "";
    }
    
    /**
	 * 
	 */
    private String getGroupPath(Resource self) {
		if (self.getParent() != null) {
			Resource parent = self.getParent();
			if (parent != null) {
				ValueMap parentProperties = parent.adaptTo(ValueMap.class);
	    		if ((parentProperties != null) && ("dhl/components/pages/home").equals(parentProperties.get("jcr:content/sling:resourceType", ""))) {
	    			return self.getPath();
	    		}
				return getGroupPath(parent);
			}
		}
		return "";
    }
}