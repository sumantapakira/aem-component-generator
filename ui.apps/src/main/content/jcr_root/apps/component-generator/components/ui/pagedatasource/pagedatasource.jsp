<%--
  ADOBE CONFIDENTIAL

  Copyright 2013 Adobe Systems Incorporated
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
--%><%@include file="/libs/granite/ui/global.jsp"%><%
%><%@page import="java.util.ArrayList,
                  javax.jcr.Node,java.util.List,
                  java.util.Iterator,
                  org.apache.commons.collections.Transformer,
                  org.apache.commons.collections.iterators.TransformIterator,
                  org.apache.sling.api.resource.ResourceWrapper,
                  org.apache.sling.api.resource.Resource,
                  org.apache.sling.api.resource.ResourceUtil,
                  com.adobe.granite.ui.components.ds.AbstractDataSource,
                  com.adobe.granite.ui.components.ds.DataSource,
                  com.adobe.granite.ui.components.Config,
                  com.adobe.granite.ui.components.ExpressionHelper,
                  com.adobe.granite.ui.components.PagingIterator,
                  com.day.cq.dam.commons.util.DamUtil,
                  com.day.cq.dam.commons.util.SchemaFormHelper,
                  com.adobe.granite.confmgr.Conf,
				com.aem.component.generator.core.servlets.*,
                  org.apache.sling.api.resource.ResourceResolver,
                  com.day.cq.dam.commons.util.DamConfigurationConstants,
                  java.util.List"%><%

Config dsCfg = new Config(resource.getChild(Config.DATASOURCE));
ExpressionHelper ex = cmp.getExpressionHelper();
final String itemRT = dsCfg.get("itemResourceType", String.class);
final Integer offset = ex.get(dsCfg.get("offset", String.class), Integer.class);
final Integer limit = ex.get(dsCfg.get("limit", String.class), Integer.class);



final ResourceResolver resolver = resourceResolver;
ComponentListService componentsService = sling.getService(ComponentListService.class);
Iterator<Resource> appsComponentItr =  componentsService.getCustomizedComponentList(resolver,sling, slingRequest);

@SuppressWarnings("unchecked")
DataSource datasource = new AbstractDataSource() {
    public Iterator<Resource> iterator() {
        Iterator<Resource> it = new PagingIterator<Resource>(appsComponentItr, offset, limit);
        return new TransformIterator(it, new Transformer() {
            public Object transform(Object o) {
                final Resource r = ((Resource) o);
                return new ResourceWrapper(r) {
                    public String getResourceType() {
                        return itemRT;
                    }
                };
            }
        });
    }
};
request.setAttribute(DataSource.class.getName(), datasource);
%>
