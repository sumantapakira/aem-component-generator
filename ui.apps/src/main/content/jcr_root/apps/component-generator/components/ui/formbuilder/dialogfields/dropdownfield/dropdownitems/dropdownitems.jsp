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

--%>
<%@include file="/libs/granite/ui/global.jsp" %><%
%><%@ page session="false" contentType="text/html" pageEncoding="utf-8"
           import="com.adobe.granite.ui.components.ds.ValueMapResource,
                   com.adobe.granite.ui.components.formbuilder.FormResourceManager,
                   java.io.InputStream,
                   java.io.IOException,
                   java.util.ArrayList,
                   java.util.List,
                   java.util.HashMap,
                   java.util.HashSet,
                   java.util.Iterator,
                   java.util.Set,
                   org.apache.commons.io.IOUtils,
                   org.apache.jackrabbit.util.Text,
                   org.apache.sling.api.resource.Resource,
                   org.apache.sling.api.resource.ResourceMetadata,
                   org.apache.sling.api.resource.ResourceResolver,
                   org.apache.sling.api.resource.ValueMap,
                   org.apache.sling.api.wrappers.ValueMapDecorator,
                   org.apache.sling.commons.json.JSONArray,
                   org.apache.sling.commons.json.JSONException,
                   org.apache.sling.commons.json.JSONObject,
                   org.slf4j.Logger"%><%

    String key = resource.getName();
    String resourcePathBase = "dam/gui/coral/components/admin/schemaforms/formbuilder/formfieldproperties/";
    String jsonPath = request.getParameter("jsonPath");

    try {
        List<Resource> options = getManualOptionsIterator(jsonPath, resource, resourceResolver, log);

        if (options != null) { 
            Iterator<Resource> formfields = options.iterator();

            while (formfields.hasNext()) {
                Resource itemResource = formfields.next();
                %><sling:include resource="<%= itemResource %>"
                        resourceType="dam/gui/coral/components/admin/schemaforms/formbuilder/formfields/v2/dropdownfield/dropdownitem"/><%
            }
        } else {
            response.sendError(404);
        }
    } catch (JSONException e) {
        response.sendError(500);
    }
%>

<%!
    private List<Resource> getManualOptionsIterator(String jsonPath, Resource resource, ResourceResolver resourceResolver, Logger log) throws JSONException, IOException {
        Resource jsonResource;

        if (jsonPath != null) {
            jsonResource = resourceResolver.getResource(jsonPath);

            if (jsonResource != null) {
                return handleJsonImport(resource, jsonResource, resourceResolver, log);
            }
        }
        
        return null;
    }

    private List<Resource> handleJsonImport(Resource resource, Resource jsonImportResource, ResourceResolver resourceResolver, Logger log) throws JSONException, IOException {
        InputStream is = jsonImportResource.adaptTo(InputStream.class);
        String jsonText = IOUtils.toString(is, "UTF-8");
        JSONObject obj = new JSONObject(jsonText);
        JSONArray options = obj.getJSONArray("options");
        HashMap<String, Object> map = new HashMap<String, Object>();
        Set<String> optionValues = new HashSet<String>();
        List<Resource> optionResources = new ArrayList<Resource>();

        map.put("text", "none");
        map.put("value", "");
        optionValues.add("");
        ValueMapResource syntheticResource = new ValueMapResource(resourceResolver, resource.getPath() + "/items/" + "none", "", new ValueMapDecorator(map));

        for (int i = 0; i < options.length(); i++) {
            map = new HashMap<String, Object>();
            obj = options.getJSONObject(i);
            String value = obj.getString("value");
            if (value != null && optionValues.contains(value)) {
                log.debug("Option with value:{} and text:{} ignored due to duplicate value", value, obj.getString("text"));
                continue;
            }
            optionValues.add(value);
            map.put("text", obj.getString("text"));
            map.put("value", obj.getString("value"));
            syntheticResource = new ValueMapResource(resourceResolver, resource.getPath() + "/items/" + Text.escape(value), "", new ValueMapDecorator(map));
            optionResources.add(syntheticResource);
        }

        return optionResources;
    }
%>