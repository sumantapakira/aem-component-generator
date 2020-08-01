<%@include file="/libs/granite/ui/global.jsp" %><%
%><%@page session="false"
          import="java.util.Iterator,
                  com.adobe.granite.ui.components.AttrBuilder,
                  com.adobe.granite.ui.components.Config,
                  com.adobe.granite.ui.components.ExpressionHelper"%><%

    Config cfg = new Config(resource);
    ExpressionHelper ex = cmp.getExpressionHelper();
    String  path = ex.get(cfg.get("path", ""),String.class);
    %><input type="hidden" name="<%= xssAPI.encodeForHTMLAttr(path  + "/jcr:primaryType") %>" value="cq:Component">



