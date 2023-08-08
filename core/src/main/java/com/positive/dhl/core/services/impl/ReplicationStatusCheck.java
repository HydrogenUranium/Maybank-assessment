package com.positive.dhl.core.services.impl;

import com.day.cq.replication.ReplicationActionType;
import com.day.cq.replication.ReplicationStatus;
import com.day.cq.wcm.api.Page;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

import java.util.Optional;

@Component(
        property = {
                "service.description=DHL Discovery ReplicationStatusCheck implementation that extend Apache Sling Sitemap functionality " +
                        "and overthrow OOTB com.adobe.aem.wcm.seo.impl.sitemap.checks.ReplicationStatusCheck"},
        service = { ReplicationStatusCheck.class })
@Designate(ocd = ReplicationStatusCheck.Configuration.class)
public class ReplicationStatusCheck
{
    private boolean enabled;

    @Activate
    protected void activate(final Configuration configuration) {
        this.enabled = configuration.enabled();
    }

    public boolean isPublished(final Page page) {
        return !enabled || Optional.ofNullable(page)
                .filter(Page::hasContent)
                .map(Page::getContentResource)
                .map(r -> r.adaptTo(ReplicationStatus.class))
                .map(replicationStatus -> replicationStatus.getLastReplicationAction() == ReplicationActionType.ACTIVATE)
                .orElse(Boolean.FALSE);
    }

    @ObjectClassDefinition(name = "DHL Discovery - Page Tree Sitemap Generator Replication Status Check")
    @interface Configuration {
        @AttributeDefinition(
                name = "Enabled",
                description = "If enabled, the check will return true if a given page is activated according to its replication status, " +
                        "otherwise it will be skipped. Defaults to enabled")
        boolean enabled() default true;
    }
}

