<%@page session="false"%><%
%><%@page import=" java.util.Enumeration,
				 org.apache.sling.api.resource.Resource,
                 javax.jcr.Node,
                 com.adobe.granite.i18n.LocaleUtil,
                 com.adobe.granite.ui.components.Config,
                 org.apache.sling.api.request.RequestParameter,
                 com.adobe.granite.confmgr.Conf,
                 com.day.cq.dam.commons.util.DamConfigurationConstants,
                 com.day.cq.dam.commons.util.SchemaFormHelper,
                 org.apache.sling.tenant.Tenant,
                 com.aem.component.generator.core.servlets.ComponentListService,
                 org.apache.sling.api.resource.ResourceResolver,
                 com.day.cq.dam.api.DamConstants"%><%
%><%@include file="/libs/granite/ui/global.jsp"%><%
    Config cfg = new Config(resource);
    String vanity = cfg.get("vanity", String.class);

    String tenantAssetsRoot = DamConstants.MOUNTPOINT_ASSETS; //initialze with default
    Tenant tenant = resourceResolver.adaptTo(Tenant.class);
    //String schemaExtHome = DamConfigurationConstants.DEFAULT_METADATA_SCHEMA_HOME;

final ResourceResolver resolver = resourceResolver;
ComponentListService componentGeneratorService = sling.getService(ComponentListService.class);
//ComponentGeneratorService componentGeneratorService = sling.getService(ComponentGeneratorService.class);
String schemaExtHome = componentGeneratorService.getUserComponentPath(resolver) ;
//String schemaExtHome = "/apps/component-generator/components";

    Resource schemaExtHomeRes = resourceResolver.getResource(schemaExtHome);
    if (null != tenant) {
        String tenantSchemaHomeProperty = (String)tenant.getProperty(DamConfigurationConstants.METADATA_SCHEMA_HOME);
        if (tenantSchemaHomeProperty != null && !tenantSchemaHomeProperty.trim().isEmpty()) {
            Resource tenantSchemaHomeRes = resourceResolver.getResource(tenantSchemaHomeProperty);
            if (tenantSchemaHomeRes != null) {
                schemaExtHome = tenantSchemaHomeProperty;
                schemaExtHomeRes = tenantSchemaHomeRes;
            }
        }
        tenantAssetsRoot = (String)tenant.getProperty(DamConfigurationConstants.DAM_ASSETS_ROOT);
    }
    String schemaHome =  DamConfigurationConstants.OOTB_METADATA_SCHEMA_FORM_HOME;
    if(schemaExtHomeRes != null){
       Conf conf = resourceResolver.getResource(tenantAssetsRoot).adaptTo(Conf.class);
       schemaHome = conf.getItem(DamConfigurationConstants.ADMIN_UI_OOTB_CONF_RELPATH).get(DamConfigurationConstants.METADATA_SCHEMA_HOME, DamConfigurationConstants.OOTB_METADATA_SCHEMA_FORM_HOME);

    }

    String contextPath = request.getContextPath();
    String relativePath = slingRequest.getRequestPathInfo().getSuffix();
    relativePath = null == relativePath || relativePath.trim().isEmpty() ? "" : relativePath;
    boolean isRedirectRequired = true;
    // convert the schemaHome path to absolute path
    schemaHome = resourceResolver.getResource(schemaHome).getPath();

    if(relativePath.startsWith(schemaExtHome)){
        relativePath = relativePath.substring(schemaExtHome.length());
    }else if(relativePath.startsWith(schemaHome)){
        relativePath = relativePath.substring(schemaHome.length());
    }else{
        isRedirectRequired = false;
    }


    Resource res = resourceResolver.getResource(schemaExtHome + relativePath);
    if (null == res) {
        res = resourceResolver.getResource(schemaHome + relativePath);
    }
    if (res == null) {
        response.sendError(404);
        return;
    }


    RequestParameter formPath = slingRequest.getRequestParameter("formPath");
    String formPathStr = formPath != null ? formPath.getString() : "";

    if (!schemaExtHome.equals(formPathStr.trim())) {
        isRedirectRequired = true;
    }

    if (isRedirectRequired) {
		StringBuilder sb = new StringBuilder("");
		sb.append(contextPath + vanity + relativePath + "?formPath=" + schemaExtHome);

		//Append other request parameters as well if redirection is required so that those params are not lost.
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