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
--%> <%@page session="false"%><%
%><%@page import=" java.util.Enumeration,
				 org.apache.sling.api.resource.Resource,
                 javax.jcr.Node,
                 com.adobe.granite.ui.components.Config,
                 org.apache.sling.api.request.RequestParameter,
                  com.aem.component.generator.core.servlets.ComponentListService,
                 org.apache.sling.api.resource.ResourceResolver"%><%
%><%@include file="/libs/granite/ui/global.jsp"%><%
    Config cfg = new Config(resource);
    String vanity = cfg.get("vanity", String.class);

final ResourceResolver resolver = resourceResolver;
ComponentListService componentGeneratorService = sling.getService(ComponentListService.class);
String componentHome = componentGeneratorService.getUserComponentPath(resolver,"component_path") ;

    String contextPath = request.getContextPath();
    String relativePath = slingRequest.getRequestPathInfo().getSuffix();
    relativePath = null == relativePath || relativePath.trim().isEmpty() ? "" : relativePath;
    boolean isRedirectRequired = true;

    if(relativePath.startsWith(componentHome)){
        relativePath = relativePath.substring(componentHome.length());
    }else{
        isRedirectRequired = false;
    }
    Resource res = resourceResolver.getResource(componentHome + relativePath);
    if (res == null) {
        response.sendError(404);
        return;
    }


    RequestParameter formPath = slingRequest.getRequestParameter("formPath");
    String formPathStr = formPath != null ? formPath.getString() : "";

    if (!componentHome.equals(formPathStr.trim())) {
        isRedirectRequired = true;
    }

 if (isRedirectRequired) {
		StringBuilder sb = new StringBuilder("");
		sb.append(contextPath + vanity + relativePath + "?formPath=" + componentHome);

		Enumeration requestParamNames = slingRequest.getParameterNames();
		while (requestParamNames.hasMoreElements()) {
			String parameterName = (String) requestParamNames.nextElement();
			if (!parameterName.equalsIgnoreCase("formPath")) {
				String[] parameterValues = slingRequest.getParameterValues(parameterName);
				for (String parameterValue : parameterValues) {
					sb.append("&" + parameterName + "=" + parameterValue);
				}
			}
		}
		response.sendRedirect(sb.toString());
	}
%>