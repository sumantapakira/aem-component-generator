<%
%><%@include file="/libs/granite/ui/global.jsp" %><%
%><%@ page session="false" contentType="text/html" pageEncoding="utf-8"
           import="com.adobe.granite.ui.components.formbuilder.FormResourceManager,
                   com.adobe.granite.ui.components.ds.ValueMapResource,
                   org.apache.sling.api.resource.Resource,
                   org.apache.sling.api.wrappers.ValueMapDecorator,
                   org.apache.commons.io.IOUtils,
                   org.apache.sling.api.resource.ResourceMetadata,
                   org.apache.jackrabbit.util.Text,
                   java.util.Set,
                   java.util.HashSet,
                   java.util.Iterator" %><%

    String key = resource.getName();
    String resourcePathBase = "component-generator/components/ui/formbuilder/formproperties/";
%>
<div class="formbuilder-content-form" role="gridcell">
    <label class="fieldtype">
        <coral-icon alt="" icon="dropdown" size="XS"></coral-icon><%= xssAPI.encodeForHTML(i18n.get("Dropdown Field")) %>
    </label>
    <sling:include resource="<%=resource%>" resourceType="granite/ui/components/coral/foundation/form/textfield"/>
</div>

<div class="formbuilder-content-properties dropdownfield">
    <%
        String[] settingsList = {"metadatamappertextfield","labelfields","descriptionfield","requiredfields" };
        for(String settingComponent : settingsList){
            %>
                <sling:include resource="<%= resource %>" resourceType="<%= resourcePathBase + settingComponent %>"/>
            <%
        }
    %>

    <%
    ValueMap properties = resource.adaptTo(ValueMap.class);
    String jsonPath = properties.get("jsonPath", String.class);
    boolean hasJsonPath = jsonPath != null && !jsonPath.isEmpty();
    %>

    <div class="dropdown">
    <span><%= xssAPI.encodeForHTML(i18n.get("Choices")) %></span>
    <div class="choice-radio-div">
        <table class="coral-Table">
            <tr class="coral-Table-row">
                <td class="coral-Table-cell">
                    <label>
                        <input type="radio" name="choice-options" disabled="true" class="radio-choice-manual manual-radio-propmap-<%= xssAPI.encodeForHTMLAttr(key) %>" >
                        <span style="margin-left: 0.5rem;"><%= xssAPI.encodeForHTML(i18n.get("Add Manually")) %></span>
                    </label>
                </td>
                <td class="coral-Table-cell" data-foobar="<%= hasJsonPath %>">
                    <label>
                        <input type="radio" name="choice-options" disabled="true" class="radio-choice-json datasource-radio-propmap-<%= xssAPI.encodeForHTMLAttr(key) %>" key="<%= xssAPI.encodeForHTMLAttr(key) %>" <%= hasJsonPath ? "checked" : "" %>>
                        <span style="margin-left: 0.5rem;"><%= xssAPI.encodeForHTML(i18n.get("Add through data-source")) %></span>
                    </label>
                </td>
            </tr>
        </table>
    </div>
    <div class="choice-values-manual" key=<%= xssAPI.encodeForHTMLAttr(key) %> <%= hasJsonPath ? "hidden" : "" %>>
        <div class="add-from-json-wrapper"> 
            <input is="coral-textfield" type="text" placeholder="<%= xssAPI.encodeForHTML(i18n.get("Data source resource type")) %>" disabled class="add-from-json-field datasource-textinput-propmap-<%= xssAPI.encodeForHTMLAttr(key) %>"/>
           </div>
            <table class="coral-Table members-table dropdown-options"
                   id="<%= xssAPI.encodeForHTMLAttr("list-" + key) %>"
                   data-list-id="<%= xssAPI.encodeForHTMLAttr(key) %>" selectable>
                <tbody class="coral-Table-body">
               
                <tr class="coral-Table-row">
                    <%--Empty column to align the width with radio buttons--%>
                    <td class="coral-Table-cell" style="border: none !important;background: none !important;"></td>
                    <td class="coral-Table-cell append-dropdown-td">
                        <button is="coral-button" class="append-dropdown-option add-choice-<%= xssAPI.encodeForHTMLAttr(key) %>" disabled="true" icon="addCircle" iconsize="S"
                                data-value="<%= xssAPI.encodeForHTMLAttr("template-option-" + key) %>"
                                data-target="<%= xssAPI.encodeForHTMLAttr("list-" + key) %>"
                                data-target-parent="<%= xssAPI.encodeForHTMLAttr(key) %>"><%= xssAPI.encodeForHTML(i18n.get("Add Choice")) %>
                        </button>
                    </td>
                </tr>
                </tbody> 
            </table>
			<div class="dropdown-manual-table-<%= xssAPI.encodeForHTMLAttr(key) %>"> </div>
        </div>
    </div>

<coral-icon class="delete-field" icon="delete" size="L" tabindex="0" role="button" alt="<%= xssAPI.encodeForHTMLAttr(i18n.get("Delete")) %>" data-target-id="<%= xssAPI.encodeForHTMLAttr(key) %>"></coral-icon>
</div>
