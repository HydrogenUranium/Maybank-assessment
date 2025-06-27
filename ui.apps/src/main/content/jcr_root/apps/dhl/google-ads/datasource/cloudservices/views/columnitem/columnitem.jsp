<%--
  ADOBE CONFIDENTIAL

  Copyright 2015 Adobe Systems Incorporated
  All Rights Reserved.

  NOTICE:  All information contained herein is, and remains
  the property of Adobe Systems Incorporated and its suppliers,
  if any.  The intellectual and technical concepts contained
  herein are proprietary to Adobe Systems Incorporated and its
  suppliers and may be covered by U.S. and Foreign Patents,
  patents in process, and are protected by trade secret or copyright law.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe Systems Incorporated.
--%><%
%><%@include file="/libs/granite/ui/global.jsp"%><%
%><%@page session="false"%><%
%><%@page import="com.adobe.granite.ui.components.AttrBuilder,
                  com.adobe.granite.ui.components.Tag,
                  com.day.cq.wcm.api.Page,
                  com.day.cq.commons.jcr.JcrConstants,
                  org.apache.commons.lang.StringUtils,
                  org.apache.jackrabbit.util.Text,
                  org.apache.sling.api.resource.ValueMap,
                  org.apache.sling.api.resource.ResourceResolver,
                  com.day.cq.replication.ReplicationStatus,
                  javax.jcr.Node,
                  javax.jcr.RepositoryException,
                  javax.jcr.Session,
                  org.slf4j.Logger,
                  org.slf4j.LoggerFactory,
                  java.util.ArrayList,
                  java.util.Calendar,
                  java.util.Iterator,
                  java.util.List" %>
<%!
    private final Logger log = LoggerFactory.getLogger(getClass());
%><%
final ResourceResolver resolver = slingRequest.getResourceResolver();
Page cqPage = resource.adaptTo(Page.class);
String title = "";
final String LIBS_HOME = "/libs";
final String CONF_GLOBAL_HOME = "/conf/global";
final String BUCKET_NAME = "settings";
final String CONFIG_MODULE_PATH = "cloudconfigs/google-ads";
String name = null;
Boolean isFolder = false;

if (cqPage != null) {
    String cqPageTitle = cqPage.getTitle();
    if (StringUtils.isEmpty(cqPageTitle)) {
        // Fallback to name for the title
        title = cqPage.getName();
    }
    else {
        // Get both name and title if title exists
        title = cqPageTitle;
        name = cqPage.getName();
    }
}
else {
    ValueMap vm = resource.getValueMap();
    title = vm.get(JcrConstants.JCR_CONTENT + "/" + JcrConstants.JCR_TITLE, vm.get(JcrConstants.JCR_TITLE, String.class));
    if (StringUtils.isEmpty(title)) {
        // Fallback to name for the title
        title = resource.getName();
    }
    else {
        // Get both name and title if title exists
        name = resource.getName();
    }
}


Tag tag = cmp.consumeTag();
AttrBuilder attrs = tag.getAttrs();
attrs.set("foundation-collection-item-id", resource.getPath());

if (hasChildren(resource, BUCKET_NAME, CONFIG_MODULE_PATH)) {
    isFolder = true;
    attrs.add("variant", "drilldown");
}

String actionRels = StringUtils.join(getActionRels(resolver, resource, cqPage, CONFIG_MODULE_PATH, isFolder, LIBS_HOME, CONF_GLOBAL_HOME, BUCKET_NAME), " ");

%><coral-columnview-item <%= attrs %>>
    <coral-columnview-item-thumbnail><%
        if (cqPage != null && !isFolder) {
            String thumbnailUrl = getThumbnailUrl(cqPage, 48, 48);
            %><img class="foundation-collection-item-thumbnail" src="<%= xssAPI.getValidHref(request.getContextPath() + thumbnailUrl) %>" alt="" itemprop="thumbnail"><%
        } else {
            %><coral-icon class="foundation-collection-item-thumbnail" icon="folder"></coral-icon><%
        }
    %></coral-columnview-item-thumbnail>
    <coral-columnview-item-content>
        <div class="foundation-collection-item-title" itemprop="title" title="<%= xssAPI.encodeForHTMLAttr(i18n.getVar(title)) %>">
            <%= xssAPI.encodeForHTML(i18n.getVar(title)) %>
        </div><%
        if (name != null && !name.equals(title)) {
            %><div class="foundation-layout-util-subtletext">
                <%= xssAPI.encodeForHTML(name) %>
            </div><%
        }%>
    </coral-columnview-item-content>

    <meta class="foundation-collection-quickactions" data-foundation-collection-quickactions-rel="<%= xssAPI.encodeForHTMLAttr(actionRels) %>">
</coral-columnview-item><%!

    private String getThumbnailUrl(Page page, int width, int height) {
        String ck = "";

        ValueMap metadata = page.getProperties("image/file/jcr:content");
        if (metadata != null) {
            Calendar cal = metadata.get("jcr:lastModified", Calendar.class);
            if (cal != null) {
                ck = "" + (cal.getTimeInMillis() / 1000);
            }
        }

        return Text.escapePath(page.getPath()) + ".thumb." + width + "." + height + ".png?ck=" + ck;
    }

    private static String getThumbnailUrl(Resource r, int width, int height) {
        return Text.escapePath(r.getPath()) + ".thumb." + width + "." + height + ".png";
    }

    private List<String> getActionRels(ResourceResolver resolver, Resource resource, Page page, String modulePath,
        Boolean isFolder, String libsHome, String confGlobal, String bucket) {
        List<String> actionRels = new ArrayList<String>();
        if (page != null) {
          Resource parentResource = resource.getParent();
          if (parentResource != null) {
              if(isGoogleAdsConfig(resource)) {
                  actionRels.add("google-ads-config-edit-activator");
                  actionRels.add("conf-browser-publish-activator");
                  if(isPublished(resource)) {
                  	actionRels.add("conf-browser-unpublish-activator");
                  }
              } else {
                  actionRels.add("no-action");
              }
          }
        } else {
          actionRels.add("no-action");
        }

        return actionRels;
    }


    private boolean isConfInitialized(ResourceResolver resolver, Resource resource, String confGlobal, String bucket, String modulePath) {
        if (resolver.getResource(confGlobal + '/' + bucket + '/' + modulePath + '/' + resource.getName()) != null) {
            return true;
        }
        return false;
    }

    private boolean isConfigMigrated(Resource resource) {
        resource = resource.getChild(JcrConstants.JCR_CONTENT);
        ValueMap resourceVM = resource.adaptTo(ValueMap.class);
        String editForm = resourceVM.get("editformPath", String.class);
        if (editForm != null && !editForm.isEmpty()) {
            return true;
        }
        return false;
    }

    private boolean isGoogleAdsConfig(Resource resource) {
        resource = resource.getChild(JcrConstants.JCR_CONTENT);
        String resourceType = resource.getResourceType();
        if ("dhl/google-ads/components/utilities/cloudconfig/google-ads".equals(resourceType)) {
            return true;
        }
        return false;
    }

    private boolean isPublished(Resource resource) {
    	Resource contentResource = resource.getChild(JcrConstants.JCR_CONTENT);
      ReplicationStatus status = contentResource.adaptTo(ReplicationStatus.class);
      return status.isActivated();
    }

    private boolean hasChildren(Resource resource, String bucket, String modulePath) {

        String resourcePath = resource.getPath();

        // /conf would always have global and other contexts
        if (resourcePath.equals("/conf")) {
            return true;
        }

        if(resourcePath.startsWith("/conf")) {
            for (Iterator<Resource> it = resource.listChildren(); it.hasNext(); ) {
                Resource r = it.next();
                if (r.getName().equals(bucket)) {
                    continue;
                } else {
                    try {
                        Node resNode = r.adaptTo(Node.class);
                        if(resNode.isNodeType("nt:folder") || resNode.isNodeType("sling:Folder")) {
                            return true;
                        }
                    } catch(Exception ex) {
                           log.error("Can't determine if the resource " + resourcePath + " is a configuration container!", ex);
                    }
                }
            }
        }

        if (resourcePath.indexOf(modulePath) == -1) {
            resource = resource.getChild(bucket + '/' + modulePath);
            if (resource == null) {
                return false;
            }
        }

        for (Iterator<Resource> it = resource.listChildren(); it.hasNext(); ) {
            Resource r = it.next();
            // don't consider repository nodes (e.g. rep:policy) or content resources as children
            if (r.getName().startsWith("rep:") || r.getName().equals(JcrConstants.JCR_CONTENT)) {
                continue;
            }
            return true;
        }

        return false;
    }

%>
