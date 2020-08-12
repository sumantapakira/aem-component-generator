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


import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.*;
import javax.jcr.query.InvalidQueryException;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;
import java.util.HashMap;
import java.util.LinkedHashMap;

public class MultiFieldMap {

    protected Node node;
    protected Node multiFieldValueNode;
    protected String multiFieldNameProperty;
    private static final Logger LOG = LoggerFactory.getLogger(MultiFieldMap.class);
    protected LinkedHashMap<Integer, String> childElement = new LinkedHashMap<Integer, String>();
    protected HashMap<String, Cache> cache = new HashMap<String, Cache>();
    protected int size = 0;

    public MultiFieldMap(Node node, String property) {
        this.node = node;
        this.multiFieldNameProperty = property;

    }

    public MultiFieldMap(Resource resource, String property) {
        this.node = resource.adaptTo(Node.class);
        this.multiFieldNameProperty = property;

    }


    public Node getNode() {

        return this.node;
    }


    private LinkedHashMap<Integer, String> getValues() {
        LinkedHashMap<Integer, String> map = null;
        try {
            final String userId = this.node.getSession().getUserID();
            LOG.debug("getSession getUserID : " + userId);
            Session session = this.node.getSession();

            ResourceResolver serviceResourceResolver = OpenSessionUtil.getProtectedContentServiceResolver(session);
            LOG.debug("serviceResourceResolver : " + serviceResourceResolver);


            QueryManager queryManager;
            Session workingSession;
			if (serviceResourceResolver != null) {
				final Session serviceSession = serviceResourceResolver.adaptTo(Session.class);
				workingSession = serviceSession;
				queryManager = serviceSession.getWorkspace().getQueryManager();
			} else {
				workingSession = this.node.getSession();
				queryManager = this.node.getSession().getWorkspace().getQueryManager();
			}
			String componentPath = this.node.hasProperty("sling:resourceType") ? this.node.getProperty("sling:resourceType").getString() : StringUtils.EMPTY;

            map = findMultifieldNode(componentPath, this.multiFieldNameProperty, queryManager, false, workingSession);
        } catch (RepositoryException e) {
            LOG.error(" Error ", e);
        }
        return map;
    }

    private LinkedHashMap<Integer, String> findMultifieldNode(String basePath, String name, QueryManager queryManager, boolean isIncludeQuery, Session workingSession) throws InvalidQueryException, RepositoryException {
        Node result = null;
        String multiFieldValueNodes = StringUtils.EMPTY;
        StringBuilder componentPath = new StringBuilder();
        componentPath.append("/jcr:root");
        if (!basePath.startsWith("/apps/")) {
            componentPath.append("/apps/");
        }
        componentPath.append(basePath);
		if (!isIncludeQuery) {
			componentPath.append("/cq:dialog");
		}

        StringBuilder fieldConfigStmt = new StringBuilder(componentPath);
        fieldConfigStmt.append("//*[@name='");
        fieldConfigStmt.append(name);
        fieldConfigStmt.append("']");
        LOG.debug("Query is : " + fieldConfigStmt.toString());

        Query fieldConfigQuery = queryManager.createQuery(fieldConfigStmt.toString(), "xpath");
        QueryResult fieldConfigQueryResult = fieldConfigQuery.execute();
        NodeIterator fieldConfigNodes = fieldConfigQueryResult.getNodes();
        if (fieldConfigNodes.hasNext()) {
            result = fieldConfigNodes.nextNode();
        }
        if (result != null) {
            multiFieldValueNodes = result.getPath() + Constants.MULTIFIELD_VALUES_PATH;
            multiFieldValueNode = workingSession.getNode(multiFieldValueNodes);
            NodeIterator multiFieldItr = multiFieldValueNode.getNodes();
            int numberOfProperty = 0;
            while (multiFieldItr.hasNext()) {
                Property propName = multiFieldItr.nextNode().getProperty("name");
                String propValue = propName.getString();
                childElement.put(numberOfProperty++, propValue);
            }
            size = childElement.size();
            cache.put(this.multiFieldNameProperty, new Cache(childElement));

        } else {
            StringBuilder includeConfigStmt = new StringBuilder(componentPath);
            includeConfigStmt.append("//*[@sling:resourceType='granite/ui/components/coral/foundation/include'");
            includeConfigStmt.append("]");
            LOG.debug("Query is : " + includeConfigStmt.toString());

            Query includeConfigQuery = queryManager.createQuery(includeConfigStmt.toString(), "xpath");
            QueryResult includeQueryResult = includeConfigQuery.execute();
            NodeIterator includeConfigItr = includeQueryResult.getNodes();
            while (includeConfigItr.hasNext()) {
                Property includePath = includeConfigItr.nextNode().getProperty("path");
                String includePathValue = includePath.getString();
                includePathValue = includePathValue.replaceFirst("mnt/overlay", "apps");
                childElement = findMultifieldNode(includePathValue, name, queryManager, true, workingSession);
                if (childElement.size() > 0) {
                    break;
                }

            }

        }
        LOG.debug("Returning : " + childElement);
        return childElement;

    }

    public Node getMultiValueNode() {
        return multiFieldValueNode;
    }

    public int getCountOfMultifieldProperties() {
        return this.size;
    }

    public LinkedHashMap<Integer, String> getChildElement() {


        if (cache.get(this.multiFieldNameProperty) == null) {
            LOG.debug("Cache NOT found for key {} ", this.multiFieldNameProperty);
            return getValues();
        } else {
            LOG.debug("Cache found for key {} ", this.multiFieldNameProperty);
            childElement = cache.get(this.multiFieldNameProperty).get();
            return childElement;
        }
    }

    private class Cache {
        LinkedHashMap<Integer, String> cacheElement = new LinkedHashMap<Integer, String>();

        public Cache(LinkedHashMap<Integer, String> map) {
            this.cacheElement = map;

        }

        protected LinkedHashMap<Integer, String> get() {
            return cacheElement;
        }
    }

}
