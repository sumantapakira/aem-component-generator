<%--

ADOBE CONFIDENTIAL
__________________

Copyright 2012 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  All information contained herein is, and remains
the property of Adobe Systems Incorporated and its suppliers,
if any.  The intellectual and technical concepts contained
herein are proprietary to Adobe Systems Incorporated and its
suppliers and are protected by trade secret or copyright law.
Dissemination of this information or reproduction of this material
is strictly forbidden unless prior written permission is obtained
from Adobe Systems Incorporated.

--%><% 
%><%@include file="/libs/granite/ui/global.jsp" %><%
%><%@ page session="false" contentType="text/html" pageEncoding="utf-8"
         import="com.adobe.granite.ui.components.formbuilder.FormResourceManager,
         		 org.apache.sling.api.resource.Resource,
         		 org.apache.sling.api.resource.ValueMap,
                 com.adobe.granite.ui.components.Config,
         		 java.util.HashMap" %><%
    Config cfg = new Config(resource);
    ValueMap fieldProperties = resource.adaptTo(ValueMap.class);
    String key = resource.getName();
	String resourcePathBase = "dam/gui/coral/components/admin/schemaforms/formbuilder/formfieldproperties/";

%>

<div class="formbuilder-content-form" role="gridcell">
    <sling:include resource="<%= resource %>" resourceType="granite/ui/components/coral/foundation/form/checkbox"/>
</div>
<div class="formbuilder-content-properties">

    <input type="hidden" name="<%= xssAPI.encodeForHTMLAttr("./items/" + key) %>">
    <input type="hidden" name="<%= xssAPI.encodeForHTMLAttr("./items/" + key + "/jcr:primaryType") %>" value="nt:unstructured">
    <input type="hidden" name="<%= xssAPI.encodeForHTMLAttr("./items/" + key + "/resourceType") %>" value="granite/ui/components/coral/foundation/form/checkbox">
    <input type="hidden" name="<%= xssAPI.encodeForHTMLAttr("./items/" + key + "/sling:resourceType") %>" value="dam/gui/components/admin/schemafield">
    <input type="hidden" name="<%= xssAPI.encodeForHTMLAttr("./items/" + key + "/granite:data/metaType") %>" value="checkbox">
    <input type="hidden" name="<%= xssAPI.encodeForHTMLAttr("./items/" + key + "/value") %>" value="true">

    <% 
        String[] settingsList = {"textfields", "metadatamappertextfield"};
        for(String settingComponent : settingsList){
            %>
            <sling:include resource="<%= resource %>" resourceType="<%= resourcePathBase + settingComponent %>"/>
            <%
        }
    %>

    <% Boolean defaultchecked = fieldProperties.get("defaultchecked", Boolean.class); %>
    <div class="coral-Form-fieldwrapper coral-Form-fieldwrapper--singleline">
        <coral-checkbox value="true" name="<%= xssAPI.encodeForHTMLAttr("./items/" + key + "/defaultchecked") %>" <%= defaultchecked == null || !defaultchecked ? "" : "checked"%>><%= i18n.get("Default") %></coral-checkbox>
    </div>
    
    <input type="hidden" name="<%= xssAPI.encodeForHTMLAttr("./items/" + key + "/value@Delete") %>" value="true">
    <input type="hidden" name="<%= xssAPI.encodeForHTMLAttr("./items/" + key + "/value@TypeHint") %>" value="Boolean">

    <sling:include resource="<%= resource %>" resourceType="dam/gui/coral/components/admin/schemaforms/formbuilder/formfieldproperties/titlefields"/>

    <coral-icon class="delete-field" icon="delete" size="L" tabindex="0" role="button" alt="<%= xssAPI.encodeForHTMLAttr(i18n.get("Delete")) %>" data-target-id="<%= xssAPI.encodeForHTMLAttr(key) %>" data-target="<%= xssAPI.encodeForHTMLAttr("./items/" + key + "@Delete") %>"></coral-icon>

</div>
<div class="formbuilder-content-properties-rules">
    <label for="field">
    	<span class="rules-label"><%= i18n.get("Field") %></span>
        <%
            String[] fieldRulesList = {"disableineditmodefields", "showemptyfieldinreadonly"};
            for(String ruleComponent : fieldRulesList){
                %>
                    <sling:include resource="<%= resource %>" resourceType="<%= resourcePathBase + ruleComponent %>"/>
                <%
            }

        %>
    </label>
</div>