/*
 * Copyright Sumanta Pakira
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
package com.aem.component.generator.core.commons;

import com.google.common.collect.ImmutableMap;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.osgi.framework.BundleContext;
import org.osgi.framework.FrameworkUtil;
import org.osgi.framework.ServiceReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.Map;

public final class OpenSessionUtil {

    private static final Logger LOG = LoggerFactory.getLogger(OpenSessionUtil.class);

    private static final String SUBSERVICE_NAME = "component-generator";

    private static final Map<String, Object> AUTH_INFO = ImmutableMap.<String, Object>of(ResourceResolverFactory.SUBSERVICE,
            SUBSERVICE_NAME);

    private static final ThreadLocal<ResourceResolver> threadResourceResolver = new ThreadLocal<ResourceResolver>();


    public static ResourceResolver getProtectedContentServiceResolver(Session session) throws RepositoryException {
        LOG.debug("userId : " + session.getUserID());
        if (isResourceResolverAlreadyOpened()) {
            return getAlreadyOpenedResourceResolver();
        }

        BundleContext bundleContext = FrameworkUtil.getBundle(OpenSessionUtil.class).getBundleContext();
        if (shouldUseServiceUser(bundleContext, session)) {
            ResourceResolver resourceResolver = getServiceResourceResolver(bundleContext);
            threadResourceResolver.set(resourceResolver);
            return resourceResolver;
        }
        return null;
    }

    public static void closeProtectedContentServiceResolver() {
        ResourceResolver resourceResolver = threadResourceResolver.get();
        if (resourceResolver != null) {
            if (resourceResolver.isLive()) {
                resourceResolver.close();
            }
            resourceResolver = null;
            threadResourceResolver.remove();
        }
    }

    private static boolean isResourceResolverAlreadyOpened() {
        ResourceResolver resourceResolver = threadResourceResolver.get();
        return resourceResolver != null && resourceResolver.isLive();
    }

    private static ResourceResolver getAlreadyOpenedResourceResolver() {
        return threadResourceResolver.get();
    }

    private static boolean shouldUseServiceUser(BundleContext bundleContext, Session session) throws RepositoryException {

        boolean anonymousUser = "anonymous".equalsIgnoreCase(session.getUserID());
        if (anonymousUser) {
            return true;
        } else {
            return !session.hasPermission("/apps/", Session.ACTION_READ);
        }

    }

    private static ResourceResolver getServiceResourceResolver(BundleContext bundleContext) {
        ResourceResolverFactory resourceResolverFactory = getService(bundleContext, ResourceResolverFactory.class);
        try {
            return resourceResolverFactory.getServiceResourceResolver(AUTH_INFO);
        } catch (LoginException ex) {
            LOG.error("Failed to get resource resolver" + ex.getMessage());
        }
        return null;
    }

    private static <T> T getService(BundleContext bundleContext, Class<T> clazz) {
        final ServiceReference<T> serviceReference = bundleContext.getServiceReference(clazz);
        return bundleContext.getService(serviceReference);
    }
}