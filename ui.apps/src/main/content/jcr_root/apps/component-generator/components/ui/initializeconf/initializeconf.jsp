<%@include file="/libs/granite/ui/global.jsp" %><%
%><%@page session="false"
          import="java.util.Iterator,org.apache.sling.tenant.Tenant,org.apache.jackrabbit.util.Text,
                  com.adobe.granite.ui.components.AttrBuilder,
                  com.adobe.granite.ui.components.Config,com.adobe.granite.ui.components.ExpressionHelper"%><%

    Config cfg = new Config(resource);
    ExpressionHelper ex = cmp.getExpressionHelper();
    String  path = ex.get(cfg.get("path", ""),String.class);
    Tenant tenant = resourceResolver.adaptTo(Tenant.class);
    String overlayPathPrefix = getOverlayPathPrefix(tenant);
//if (resourceResolver.getResource(path)==null){
    %><input type="hidden" name="<%= xssAPI.encodeForHTMLAttr(path  + "/jcr:primaryType") %>" value="cq:Component">



