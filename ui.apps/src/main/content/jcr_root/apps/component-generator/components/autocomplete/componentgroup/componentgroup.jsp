<%--
  Copyright 2020 Sumanta Pakira
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
   http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
--%> 
<%@ page import="com.adobe.granite.ui.components.ds.DataSource" %>
<%@ page import="com.adobe.granite.ui.components.ds.SimpleDataSource" %>
<%@ page import="com.adobe.granite.ui.components.ds.ValueMapResource" %>
<%@ page import="com.day.cq.search.PredicateGroup" %>
<%@ page import="com.day.cq.search.Query" %>
<%@ page import="com.day.cq.search.QueryBuilder" %>
<%@ page import="com.day.cq.search.result.SearchResult" %>
<%@ page import="org.apache.commons.collections.IteratorUtils" %>
<%@ page import="org.apache.commons.collections.Transformer" %>
<%@ page import="org.apache.commons.collections.iterators.TransformIterator" %>
<%@ page import="org.apache.sling.api.resource.ResourceResolver" %>
<%@ page import="org.apache.sling.api.wrappers.ValueMapDecorator" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ page import="com.aem.component.generator.core.servlets.*" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@include file="/libs/foundation/global.jsp"%><%
    final ResourceResolver resolver = resourceResolver;
    final String path = resource.getPath();
    List<Resource> resultList = null;
    List<String> componentList = null;
    DataSource ds;
   ComponentListService componentsService = sling.getService(ComponentListService.class);
   componentList = componentsService.getListOfComponentsGroup(resolver);
    if( resource != null ){
        if( componentList != null ){
            ds = new SimpleDataSource(new TransformIterator(componentList.iterator(), new Transformer() {
                public Object transform(Object input) {
                    try {
                         ValueMap vm = new ValueMapDecorator(new HashMap<String, Object>());
                        vm.put("text", input);
                        vm.put("value", input);
                        return new ValueMapResource(resolver, path, "nt:unstructured", vm);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }
            }));
            request.setAttribute(DataSource.class.getName(), ds);
        }
    }
%>