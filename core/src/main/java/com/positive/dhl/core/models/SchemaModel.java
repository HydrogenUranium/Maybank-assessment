package com.positive.dhl.core.models;

import com.positive.dhl.core.services.schema.SchemaService;
import com.positive.dhl.core.utils.RequestUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.Self;

import java.util.List;

import static com.day.cq.commons.jcr.JcrConstants.JCR_CONTENT;
import static com.day.cq.wcm.api.constants.NameConstants.NT_PAGE;

@Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class SchemaModel {

    @Self
    private SlingHttpServletRequest request;

    @OSGiService
    private SchemaService schemaService;

    public List<String> getSchemas() {
        var root = RequestUtils.getResource(request);

        if(root.isResourceType(NT_PAGE)) {
            root = root.getChild(JCR_CONTENT);
        }

        return schemaService.getSchemas(root, request);
    }
}
