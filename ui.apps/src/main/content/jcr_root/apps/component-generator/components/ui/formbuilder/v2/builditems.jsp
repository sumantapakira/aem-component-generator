
<%@ page session="false"
         contentType="text/html"
         pageEncoding="utf-8"
         import="com.adobe.granite.ui.components.formbuilder.FormResourceManager,
                 com.day.cq.commons.LabeledResource,
                 com.adobe.granite.ui.components.Config,
                 com.day.cq.i18n.I18n,
                 java.util.HashMap,
                 org.apache.sling.api.resource.Resource,
                 org.apache.sling.api.resource.ValueMap,
                 java.util.ArrayList,
                 java.util.Iterator,
                 com.adobe.granite.confmgr.Conf,
                 com.day.cq.dam.commons.util.DamConfigurationConstants,
                 java.util.List,
                 javax.jcr.Node"
        %><%
%><%@include file="/libs/granite/ui/global.jsp" %><%
%><cq:defineObjects /><%
	Config cfg = new Config(resource);
    String sfx = slingRequest.getRequestPathInfo().getSuffix();
    sfx = sfx == null ? "" : sfx;

%>
<div class="editor-right" style="width:40%">
    <coral-tabview>
  		<coral-tablist target="coral-demo-panel-1">
            <coral-tab id="tab-add" href="#" data-target="#field-add"><%= i18n.get("Build Form") %></coral-tab>
            <coral-tab id="tab-edit" href="#" data-target="#field-edit"><%= i18n.get("Settings") %></coral-tab>
            <% if(resource.getPath().contains("metadataschemaeditor")) { %>
            <coral-tab id="tab-edit-rules" href="#" data-target="#field-rules"><%= i18n.get("Rules") %></coral-tab>
            <% } %>
        </coral-tablist>
		<coral-panelstack>
	        <coral-panel id="field-add">
				<ul id="formbuilder-field-templates">
	            <%
	                FormResourceManager formResourceManager = sling.getService(FormResourceManager.class);
	                Resource fieldTemplateResource = formResourceManager.getFormFieldResource(resource);
	            %>
	                <li class="field" data-fieldtype="section" tabindex="0">
	                    <div class="formbuilder-template-title"><coral-icon icon="viewSingle" alt="" size="M"></coral-icon><span><%= i18n.get("Section Header") %></span>
	                    </div>
	                    <script class="field-properties" type="text/x-handlebars-template">
                        <sling:include resource="<%= fieldTemplateResource %>"
                                       resourceType="dam/gui/coral/components/admin/schemaforms/formbuilder/formfields/v2/sectionfield" />
                    	</script>
	                </li>

	                <li class="field" data-fieldtype="text">
	                    <div class="formbuilder-template-title"><coral-icon icon="text" alt="" size="M"></coral-icon><span><%= i18n.get("Text field") %></span></div>
	                    <script class="field-properties" type="text/x-handlebars-template">
                        <sling:include resource="<%= fieldTemplateResource %>"
                                       resourceType="component-generator/components/ui/formbuilder/dialogfields/textfield" />
                    </script>
	                </li>

	                <li class="field" data-fieldtype="text">
	                    <div class="formbuilder-template-title"><coral-icon icon="link" alt="" size="M"></coral-icon><span><%= i18n.get("Pathfield") %></span></div>
	                    <script class="field-properties" type="text/x-handlebars-template">
                        <sling:include resource="<%= fieldTemplateResource %>"
                                       resourceType="component-generator/components/ui/formbuilder/dialogfields/pathfield" />
                    </script>
	                </li>

                     <li class="field" data-fieldtype="text">
	                    <div class="formbuilder-template-title"><coral-icon icon="multipleAdd" alt="" size="M"></coral-icon><span><%= i18n.get("Multifield") %></span></div>
	                    <script class="field-properties" type="text/x-handlebars-template">
                        <sling:include resource="<%= fieldTemplateResource %>"
                                       resourceType="component-generator/components/ui/formbuilder/dialogfields/multifield" />
                    </script>
	                </li>

                     <li class="field" data-fieldtype="text">
	                    <div class="formbuilder-template-title"><coral-icon icon="image" alt="" size="M"></coral-icon><span><%= i18n.get("Image") %></span></div>
	                    <script class="field-properties" type="text/x-handlebars-template">
                        <sling:include resource="<%= fieldTemplateResource %>"
                                       resourceType="component-generator/components/ui/formbuilder/dialogfields/image" />
                    </script>
	                </li>



	                <li class="field" data-fieldtype="number">
	                    <div class="formbuilder-template-title"><coral-icon icon="dashboard" alt="" size="M"></coral-icon><span><%= i18n.get("Number","form builder option") %></span></div>
	                    <script class="field-properties11" type="text/x-handlebars-template">
                        <sling:include resource="<%= fieldTemplateResource %>"
                                       resourceType="component-generator/components/ui/formbuilder/dialogfields/numberfield" />
                    </script>
	                </li>
	                <%
                        HashMap<String, Object> values = new HashMap<String, Object>();
                        values.put("sling.resolutionPath", "Field Label");
                        values.put("fieldLabel", "Default Value");
                        values.put("value", "");
                        Resource dateFieldResource = formResourceManager.getDefaultPropertyFieldResource(resource, values);
                    %>
	                <li class="field" data-fieldtype="datepicker">
	                    <div class="formbuilder-template-title"><coral-icon icon="calendar" alt="" size="M"></coral-icon><span><%= i18n.get("Date") %></span></div>
	                    <script class="field-properties" type="text/x-handlebars-template">
                        <sling:include resource="<%= dateFieldResource %>"
                                       resourceType="component-generator/components/ui/formbuilder/dialogfields/textfield" />
                    </script>
	                </li>

	                 <li class="field" data-fieldtype="dropdown">
	                    <div class="formbuilder-template-title"><coral-icon icon="dropdown" alt="" size="M"></coral-icon><span><%= i18n.get("Dropdown") %></span></div>
	                    <script class="field-properties" type="text/x-handlebars-template">
                        <sling:include resource="<%= fieldTemplateResource %>"
                                       resourceType="component-generator/components/ui/formbuilder/dialogfields/dropdownfield" />
                    </script>
	                    <script id="dropdown-option-template" type="text/x-handlebars-template">
                        <sling:include resource="<%= formResourceManager.getDropdownOptionResource(fieldTemplateResource) %>"
                                       resourceType="dam/gui/coral/components/admin/schemaforms/formbuilder/formfields/v2/dropdownfield/dropdownitem" />
                    </script>
	                </li>

	                <% Resource hiddenFieldResource = formResourceManager.getHiddenFieldResource(resource); %>
	                <li class="field" data-fieldtype="text">
	                    <div class="formbuilder-template-title"><coral-icon icon="viewSingle" alt="" size="M"></coral-icon><span><%= i18n.get("Hidden Field") %></span>
	                    </div>
	                    <script class="field-properties" type="text/x-handlebars-template">
                        <sling:include resource="<%= hiddenFieldResource %>"
                                       resourceType="component-generator/components/ui/formbuilder/dialogfields/hiddenfield" />
                    </script>
	                </li>


                </ul>
	        </coral-panel>
            <coral-panel id="formbuilder-tab-name" class="tab-form-settings">
	            <div id="tab-name">
	                <sling:include resource="<%= fieldTemplateResource %>"
	                               resourceType="dam/gui/coral/components/admin/schemaforms/formbuilder/tabname" />
	            </div>
	            <div class="placeholder">
                    <i><%= i18n.get("Select a metadata schema editor field to edit settings") %></i>
                </div>
	        </coral-panel>
            <% if(resource.getPath().contains("metadataschemaeditor")) { %>
            <coral-panel id="formbuilder-tab-name" class="tab-form-rules">
                <div id="tab-name">
                    <div class="placeholder">
		                <span><%= i18n.get("Select a metadata schema editor field to edit rules.") %></span>
                    </div>
	            </div>
	        </coral-panel>
            <% } %>
	    </coral-panelstack>
	</coral-tabview>
</div>
