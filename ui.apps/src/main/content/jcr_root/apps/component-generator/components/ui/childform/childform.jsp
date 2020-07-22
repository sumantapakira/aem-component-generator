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
%><%@include file="/libs/granite/ui/global.jsp"%><%
%><%@page import="javax.jcr.RepositoryException,
                java.util.Iterator,
                javax.jcr.Node,
                com.adobe.granite.ui.components.AttrBuilder,
                com.adobe.granite.ui.components.Tag,
                org.apache.sling.api.resource.Resource,
                org.apache.sling.api.resource.ResourceResolver,
                org.apache.sling.api.resource.ValueMap,
                com.adobe.granite.ui.components.Config,
                com.day.cq.dam.api.DamConstants,
                com.adobe.granite.confmgr.Conf,
                com.day.cq.dam.commons.util.DamConfigurationConstants,
                com.day.cq.dam.commons.util.DamUtil,
                org.apache.sling.tenant.Tenant,
                com.adobe.granite.xss.XSSAPI,
                com.adobe.granite.ui.components.ComponentHelper,
                com.day.cq.commons.LabeledResource,
				com.day.cq.i18n.I18n"%><%

String schemaListVanity = "/mnt/overlay/dam/gui/content/metadataschemaeditor/schemalist.html";
String contextPath = request.getContextPath();
String schemaExtHome = slingRequest.getParameter("formPath");
Resource schemaExtHomeRes = resourceResolver.getResource(schemaExtHome);
String schemaHome =  DamConfigurationConstants.OOTB_METADATA_SCHEMA_FORM_HOME;
if(schemaExtHomeRes != null){
    Conf conf = resourceResolver.getResource(DamUtil.getTenantAssetsRoot(resourceResolver)).adaptTo(Conf.class);
    schemaHome = conf.getItem(DamConfigurationConstants.ADMIN_UI_OOTB_CONF_RELPATH).get(DamConfigurationConstants.METADATA_SCHEMA_HOME, DamConfigurationConstants.OOTB_METADATA_SCHEMA_FORM_HOME);

}


String resourcePath = resource.getPath();
String relativePath = "";
boolean isFormModified = false;
if(resourcePath.startsWith(schemaExtHome)){
    isFormModified = true;
    relativePath = resourcePath.substring(schemaExtHome.length());
}else if(resourcePath.startsWith(schemaHome)){
    relativePath = resourcePath.substring(schemaHome.length());
}
System.out.println(resource.getPath());
String title = resource.adaptTo(LabeledResource.class).getTitle() != null ? resource.adaptTo(LabeledResource.class).getTitle():resource.getName() ;

Tag tag = cmp.consumeTag();
AttrBuilder attrs = tag.getAttrs();
cmp.populateCommonAttrs(attrs);
attrs.addClass("foundation-collection-navigator");
attrs.set("data-foundation-collection-item-id", relativePath);
attrs.add("is", "coral-table-row");
attrs.add("data-path", xssAPI.encodeForHTMLAttr(resourcePath));
attrs.add("data-name", xssAPI.encodeForHTMLAttr(resource.getName()));
attrs.add("data-type", "form");

%>

<tr <%= attrs %>>
    <td is="coral-table-cell">
        <coral-checkbox coral-table-rowselect></coral-checkbox>
    </td>
    <td class="foundation-collection-item-title" is="coral-table-cell">
        <% if(!isFormModified) { %>
            <coral-icon class="locked" icon="lockOn"></coral-icon>
        <% } %>
        <%= xssAPI.encodeForHTML(title) %>
    </td>
</tr>
