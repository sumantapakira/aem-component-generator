<%--

  ADOBE CONFIDENTIAL
  __________________

   Copyright 2012 Adobe Systems Incorporated
   All Rights Reserved.

  NOTICE:  All information contained herein is, and remains
  the property of Adobe Systems Incorporated and its suppliers,
  if any.  The intellectual and technical concepts contained
  herein are proprietary to Adobe Systems Incorporated and its
  suppliers and are protected by trade secret or copyright law.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe Systems Incorporated.

--%><% 
%><%@include file="/libs/granite/ui/global.jsp" %><%
%><%@ page session="false" contentType="text/html" pageEncoding="utf-8"
         import="com.adobe.granite.ui.components.formbuilder.FormResourceManager,
         		 org.apache.sling.api.resource.ValueMap" %><% 

    ValueMap itemProperties = resource.adaptTo(ValueMap.class);
    String key = resource.getName();

    String parentKey;
    if (resource.getParent() == null){
        FormResourceManager formResourceManager = sling.getService(FormResourceManager.class);
        parentKey = formResourceManager.getFieldTemplateID();
    } else {
        parentKey = resource.getParent().getParent().getName();
    }
    String identifier = "list-" + parentKey + "-option-" + key;
    boolean selected = false;
    if (itemProperties.containsKey("selected")) {
        selected = itemProperties.get("selected", Boolean.class);
    }
    String defaultTagClass = selected ? "" : "display:none";

%>
<tr id="<%= xssAPI.encodeForHTMLAttr(identifier) %>" class="coral-Table-row dropdown-option" >
    <td class="coral-Table-cell conjusted"><%
        if (selected) {
    %><input type="radio" class="default-choice-radio selected" checked
             name="<%= xssAPI.encodeForHTMLAttr(parentKey) %>-DefaultValue" value="1"><span></span><%
    } else {
    %><input type="radio" class="default-choice-radio" name="<%= xssAPI.encodeForHTMLAttr(parentKey) %>-DefaultValue"
             value="1"><span></span><%
        }
    %>
    </td>
    <td class="coral-Table-cell option-attributes" id="<%= xssAPI.encodeForHTMLAttr(identifier) %>">
        <input type="hidden"  name="<%= xssAPI.encodeForHTMLAttr("./items/" + parentKey + "/items/" + key) %>">
        <input type="hidden"  name="<%= xssAPI.encodeForHTMLAttr("./items/" + parentKey + "/items/" + key + "/jcr:primaryType") %>" value="nt:unstructured">
        <%
        if (itemProperties.containsKey("selected")) {
            %>
            <input type="hidden"  name="<%= xssAPI.encodeForHTMLAttr("./items/" + parentKey + "/items/" + key + "/selected") %>" value="<%= itemProperties.get("selected", Boolean.class) %>">
        	<input type="hidden"  name="<%= xssAPI.encodeForHTMLAttr("./items/" + parentKey + "/items/" + key + "/selected@TypeHint") %>" value="Boolean">
            <%
        }
        %>
        <% if (key.equals("none")) {%>
        <input is="coral-textfield" class="dropdown-option-text" type="text" placeholder="<%= i18n.get("Option text") %>" name="<%= xssAPI.encodeForHTMLAttr("./items/" + parentKey + "/items/" + key + "/text") %>"
               value="">
        <%} else {%>
        <input is="coral-textfield" class="dropdown-option-text" type="text" placeholder="<%= i18n.get("Option text") %>" name="<%= xssAPI.encodeForHTMLAttr("./items/" + parentKey + "/items/" + key + "/text") %>"
               value="<%= xssAPI.encodeForHTMLAttr(itemProperties.get("text", "")) %>">
        <%}%>
        <input is="coral-textfield" class="dropdown-option-value" type="text" placeholder="<%= i18n.get("Option value") %>" name="<%= xssAPI.encodeForHTMLAttr("./items/" + parentKey + "/items/" + key + "/value") %>"
               value="<%= xssAPI.encodeForHTMLAttr(itemProperties.get("value", "")) %>">
    </td>
    <td class="coral-Table-cell conjusted">
        <a is="coral-anchorbutton" variant="minimal" icon="delete" class="remove-dropdown-option" data-value="<%= xssAPI.encodeForHTMLAttr("template-option-" + key) %>" data-target="<%= xssAPI.encodeForHTMLAttr("#" + identifier) %>" data-target-parent="<%= xssAPI.encodeForHTMLAttr("#list-" + parentKey) %>" data-name="<%= xssAPI.encodeForHTMLAttr("./items/" + parentKey + "/items/" + key + "/@Delete") %>"></a>
    </td>
    <td class="coral-Table-cell">
        <div id="default-option-tag" style="<%= defaultTagClass %>">
            <coral-tag class="default-option-tag" size="S">
                <coral-icon icon="close" size="XS"></coral-icon><%= xssAPI.encodeForHTML(i18n.get("default")) %>
            </coral-tag>
        </div>
    </td>
</tr>
