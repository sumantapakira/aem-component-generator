<% 
%><%@include file="/libs/granite/ui/global.jsp" %><%
%><%@ page session="false" contentType="text/html" pageEncoding="utf-8"
         import="com.adobe.granite.ui.components.formbuilder.FormResourceManager,
         		 org.apache.sling.api.resource.Resource,
         		 org.apache.sling.api.resource.ValueMap,
                 com.adobe.granite.ui.components.Config,
         		 java.util.HashMap" %><%

    ValueMap fieldProperties = resource.adaptTo(ValueMap.class);
    Config cfg = new Config(resource);

    HashMap<String, Object> values = new HashMap<String, Object>();
    values.put("granite:class", "pathfield-content-root-descriptor rootfieldmap-"+resource.getName());
    values.put("fieldLabel",   i18n.get("Root path"));
    values.put("emptyText",    i18n.get("Root path"));
    values.put("value",        cfg.get("fieldDescription", "/content"));
   
    FormResourceManager formResourceManager = sling.getService(FormResourceManager.class);
    Resource labelFieldResource = formResourceManager.getDefaultPropertyFieldResource(resource, values);

%><sling:include resource="<%= labelFieldResource %>" resourceType="granite/ui/components/coral/foundation/form/pathfield"/>
