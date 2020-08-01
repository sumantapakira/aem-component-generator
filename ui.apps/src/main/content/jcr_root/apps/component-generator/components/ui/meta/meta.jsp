
<%@include file="/libs/granite/ui/global.jsp"%><%
%><%@page session="false"
          import="org.apache.jackrabbit.util.Text"%><%

    String schemaExtHome = slingRequest.getParameter("formPath");
    if(schemaExtHome == null || schemaExtHome.trim().isEmpty()){
        return;
    }
    String relativePath = slingRequest.getRequestPathInfo().getSuffix();
    String title;
    if(null == relativePath || relativePath.trim().isEmpty()) {
        relativePath = "";
        title = "AEM Components";
    }else {
        relativePath = relativePath.endsWith("/") ? relativePath.substring(0, relativePath.length() - 1) : relativePath;
        title = relativePath.substring(relativePath.lastIndexOf("/") + 1);
    }

    String absolutePath = relativePath.startsWith(schemaExtHome) ? relativePath : schemaExtHome + relativePath;
    absolutePath = absolutePath.endsWith("/") ? absolutePath.substring(0, absolutePath.length() - 1) : absolutePath;
%>

<div class="foundation-collection-meta foundation-content-path hidden" data-foundation-collection-meta-title="<%= xssAPI.encodeForHTMLAttr(title) %>" data-foundation-relative-path="<%= xssAPI.encodeForHTMLAttr(relativePath) %>"  data-foundation-content-path="<%= xssAPI.encodeForHTMLAttr(absolutePath)%>" />
