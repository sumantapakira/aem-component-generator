<%
%><%@include file="/libs/granite/ui/global.jsp" %><%
%><%@ page session="false" contentType="text/html" pageEncoding="utf-8"
         import="org.apache.sling.api.resource.ValueMap" %><%

	ValueMap fieldProperties = resource.adaptTo(ValueMap.class);
	String key = resource.getName();
 String resourcePathBase = "component-generator/components/ui/formbuilder/formproperties/";
%>
<div class="formbuilder-content-form" role="gridcell">
    <label class="fieldtype">
    <coral-icon alt="" icon="text" size="XS"></coral-icon><%= xssAPI.encodeForHTML(i18n.get("Rich Text Field")) %>
    </label>
    <sling:include resource="<%= resource %>" resourceType="granite/ui/components/coral/foundation/form/textfield"/>
</div>
<div class="formbuilder-content-properties richtextfield">
    <%
        String[] settingsList = {"metadatamappertextfield","descriptionfield","requiredfields"};
        for(String settingComponent : settingsList){
            %>
            <sling:include resource="<%= resource %>" resourceType="<%= resourcePathBase + settingComponent %>"/>
            <%
        }
    %>
    <coral-icon class="delete-field" icon="delete" size="L" tabindex="0" role="button" alt="<%= xssAPI.encodeForHTMLAttr(i18n.get("Delete")) %>" data-target-id="<%= xssAPI.encodeForHTMLAttr(key) %>"></coral-icon>
</div>
<div class="formbuilder-content-properties-rules">
    <label for="field">
    	<span class="rules-label"><%= i18n.get("Field") %></span>
    </label>
</div>
