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
<%
%><%@include file="/libs/granite/ui/global.jsp" %><%
%><%@ page session="false" contentType="text/html" pageEncoding="utf-8"
         import="com.adobe.granite.ui.components.formbuilder.FormResourceManager,
         		 org.apache.sling.api.resource.Resource,
         		 org.apache.sling.api.resource.ValueMap,
                 com.adobe.granite.ui.components.Config,
         		 java.util.HashMap"%><%

    ValueMap fieldProperties = resource.adaptTo(ValueMap.class);
    Config cfg = new Config(resource);

    HashMap<String, Object> values = new HashMap<String, Object>();
    values.put("granite:class", "field-required-checkbox required-map-"+resource.getName());
    values.put("text",   i18n.get("Required"));
    values.put("value",        i18n.getVar(fieldProperties.get("true", String.class)));

    FormResourceManager formResourceManager = sling.getService(FormResourceManager.class);
    Resource labelFieldResource = formResourceManager.getDefaultPropertyFieldResource(resource, values);

%><sling:include resource="<%= labelFieldResource %>" resourceType="granite/ui/components/coral/foundation/form/checkbox"/>
