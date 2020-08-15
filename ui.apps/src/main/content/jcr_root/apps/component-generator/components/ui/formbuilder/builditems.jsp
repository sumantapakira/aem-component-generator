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

	                <li class="field" data-fieldtype="text">
	                    <div class="formbuilder-template-title"><coral-icon icon="text" alt="" size="M"></coral-icon><span><%= i18n.get("Text field") %></span></div>
	                    <script class="field-properties" type="text/x-handlebars-template">
                        <sling:include resource="<%= fieldTemplateResource %>"
                                       resourceType="component-generator/components/ui/formbuilder/dialogfields/textfield" />
                        </script>
	                </li>

                    <li class="field" data-fieldtype="text">
	                    <div class="formbuilder-template-title"><coral-icon icon="text" alt="" size="M"></coral-icon><span><%= i18n.get("Rich Text field") %></span></div>
	                    <script class="field-properties" type="text/x-handlebars-template">
                        <sling:include resource="<%= fieldTemplateResource %>"
                                       resourceType="component-generator/components/ui/formbuilder/dialogfields/richtextfield" />
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

                    <li class="field" data-fieldtype="dropdown">
	                    <div class="formbuilder-template-title"><coral-icon icon="dropdown" alt="" size="M"></coral-icon><span><%= i18n.get("Dropdown") %></span></div>
	                    <script class="field-properties" type="text/x-handlebars-template">
                        <sling:include resource="<%= fieldTemplateResource %>"
                                       resourceType="component-generator/components/ui/formbuilder/dialogfields/dropdownfield" />
                        </script>
	                </li>

	                <li class="field" data-fieldtype="text">
                     	<div class="formbuilder-template-title"><coral-icon icon="dropdown" alt="" size="M"></coral-icon><span><%= i18n.get("Checkbox") %></span></div>
                     	<script class="field-properties" type="text/x-handlebars-template">
                        <sling:include resource="<%= fieldTemplateResource %>"
                             resourceType="component-generator/components/ui/formbuilder/dialogfields/checkboxfield" />
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
                    <i><%= i18n.get("Select Dialog editor field to edit settings") %></i>
                </div>
	        </coral-panel>
		 </coral-panelstack>
	</coral-tabview>
</div>
