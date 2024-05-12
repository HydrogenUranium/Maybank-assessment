package com.positive.dhl.core.services;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.auth.core.spi.AuthenticationInfo;
import org.apache.sling.auth.core.spi.AuthenticationInfoPostProcessor;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.ItemExistsException;
import javax.jcr.ItemNotFoundException;
import javax.jcr.Session;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.Date;

@Slf4j
@Component(name = "DiscoverInfoPostProcessor", service = AuthenticationInfoPostProcessor.class, immediate = true)
public class DiscoverAuthenticationInfoPostProcessor implements AuthenticationInfoPostProcessor {

    @Reference
    private ResourceResolverHelper resourceResolverHelper;

    @Override
    public void postProcess(AuthenticationInfo info, HttpServletRequest req, HttpServletResponse res) {

        if (info == null) {
            log.debug("AuthenticationInfo is null. Skip post processing this request.");
            return;
        }

        String userId = info.getUser();
        if (StringUtils.isNotBlank(userId)) {

            try(var resolver = resourceResolverHelper.getUserManagerResourceResolver()) {
                JackrabbitSession session = ((JackrabbitSession) resolver.adaptTo(Session.class));

                if (session == null) {
                    log.error("Session is null");
                    throw new NullPointerException("Session is null");
                }

                UserManager userManager = session.getUserManager();
                Authorizable user = userManager.getAuthorizable(userId);

                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");

                if (user == null) {
                    log.error("There is no user with the ID {}.", userId);
                    throw new ItemNotFoundException("There is no user with the ID " + userId);
                }

                user.setProperty("profile/lastloggedin", session.getValueFactory().createValue(sdf.format(new Date())));

                session.save();
                session.logout();

            } catch (Exception e) {
                log.error("Error in CustomAuthenticationInfoPostProcessor" + e.getMessage());
            }
        }
    }
}
