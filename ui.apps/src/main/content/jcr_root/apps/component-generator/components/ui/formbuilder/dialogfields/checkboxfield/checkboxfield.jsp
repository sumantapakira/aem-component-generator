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
	String resourcePathBase = "component-generator/components/ui/formbuilder/formproperties/";
%>
<div class="formbuilder-content-form" role="gridcell">
    <sling:include resource="<%= resource %>" resourceType="granite/ui/components/coral/foundation/form/checkbox"/>
</div>
<div class="formbuilder-content-properties checkboxfield">
<%
        String[] settingsList = {"metadatamappertextfield", "textfield"};
        for(String settingComponent : settingsList){
            %>
            <sling:include resource="<%= resource %>" resourceType="<%= resourcePathBase + settingComponent %>"/>
            <%
        }
%>
<coral-icon class="delete-field" icon="delete" size="L" tabindex="0" role="button" alt="<%= xssAPI.encodeForHTMLAttr(i18n.get("Delete")) %>" data-target-id="<%= xssAPI.encodeForHTMLAttr(key) %>"></coral-icon>
</div>

