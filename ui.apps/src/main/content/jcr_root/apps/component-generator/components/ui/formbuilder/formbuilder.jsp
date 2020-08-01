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
<%@ page session="false"%><%
%><%@include file="/libs/granite/ui/global.jsp" %><%
%><%@page import="org.apache.sling.tenant.Tenant,
                  com.adobe.granite.ui.components.Config,
                  com.day.cq.dam.commons.util.DamConfigurationConstants,
                  com.adobe.granite.compatrouter.CompatSwitchingService" %><%
%>

<ui:includeClientLib categories="component.generator.dialog.editor" />

<%
    slingRequest.setAttribute("sling.max.calls", 5000);

    Config cfg = new Config(resource);
    String componentHome = slingRequest.getParameter("formPath");
    if(componentHome == null || componentHome.trim().isEmpty()){
        componentHome = slingRequest.getRequestPathInfo().getSuffix();
    }
    String suffix = slingRequest.getRequestPathInfo().getSuffix();
    suffix = null == suffix ? "/" : suffix;
    String absolutePath = suffix.startsWith(componentHome) ? suffix : componentHome + suffix;
    absolutePath = absolutePath.endsWith("/") ? absolutePath.substring(0, absolutePath.length() - 1) : absolutePath;
%>
<div class="foundation-content-path hidden" data-foundation-content-path="<%= xssAPI.encodeForHTMLAttr(absolutePath) %>" data-foundation-relative-path="<%= xssAPI.encodeForHTMLAttr(suffix) %>"></div>
<div class="formbuilder-wrapper"><%
    if(!resource.getPath().contains("metadataschemaeditor")) {
%><sling:call script="builditems.jsp" />
   <%
} 
%>
<sling:call script="view.jsp" />

</div>
