<%
%><%@include file="/libs/granite/ui/global.jsp" %><%
%><%@ page session="false" contentType="text/html" pageEncoding="utf-8"
         import="org.apache.sling.api.resource.ValueMap" %><%

	ValueMap fieldProperties = resource.adaptTo(ValueMap.class);
	String key = resource.getName();
   //String resourcePathBase = "dam/gui/coral/components/admin/schemaforms/formbuilder/formfieldproperties/";
String resourcePathBase = "component-generator/components/ui/formbuilder/formproperties/";

%>



<div class="formbuilder-content-form" role="gridcell">
    <label class="fieldtype">
    <coral-icon alt="" icon="multi" size="XS"></coral-icon><%= xssAPI.encodeForHTML(i18n.get("Multi Field")) %>
    </label>
    <sling:include resource="<%= resource %>" resourceType="granite/ui/components/coral/foundation/form/textfield"/>
</div>
<div class="formbuilder-content-properties multifield" data-multifield-key=<%= key %>>


    <% 
        String[] settingsList = {"metadatamappertextfield","labelfields", "requiredfields"};
        for(String settingComponent : settingsList){
            %>
            <sling:include resource="<%= resource %>" resourceType="<%= resourcePathBase + settingComponent %>"/>
            <%
        }
    %>

<coral-select name="multifield-select" class="multifield-select-item" placeholder="Select number of field">
  <coral-select-item value="1">
    1
  </coral-select-item>
  <coral-select-item value="2">
    2
  </coral-select-item>
  <coral-select-item value="3">
    3
  </coral-select-item>
  <coral-select-item value="4">
    4
  </coral-select-item>
  <coral-select-item value="5">
    5
  </coral-select-item>
</coral-select>

    <div class="multifield-table-<%= xssAPI.encodeForHTMLAttr(key) %>"></div>    

    <coral-icon class="delete-field" icon="delete" size="L" tabindex="0" role="button" alt="<%= xssAPI.encodeForHTMLAttr(i18n.get("Delete")) %>" data-target-id="<%= xssAPI.encodeForHTMLAttr(key) %>" data-target="<%= xssAPI.encodeForHTMLAttr("./items/" + key + "@Delete") %>"></coral-icon>

</div>
<div class="formbuilder-content-properties-rules">
    <label for="field">
    	<span class="rules-label"><%= i18n.get("Field") %></span>

    </label>  
    <label for="requirement">
    	<span class="rules-label"><%= i18n.get("Requirement") %></span>
        <% String requiredField = "v2/requiredfields"; %>

    </label> 
    <label for="visibililty">    
        <span class="rules-label"><%= i18n.get("Visibility") %></span>
        <% String visibilityField = "visibilityfields"; %>

    </label>     
</div>
