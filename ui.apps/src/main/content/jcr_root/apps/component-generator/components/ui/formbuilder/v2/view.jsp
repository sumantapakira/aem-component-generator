
<%@ page session="false"
         contentType="text/html"
         pageEncoding="utf-8"
         import="com.day.cq.commons.LabeledResource,
                 com.adobe.granite.ui.components.Config,
                 com.day.cq.dam.commons.util.SchemaFormHelper,
                 com.adobe.granite.confmgr.Conf,
                 com.adobe.granite.confmgr.ConfMgr,
                 com.day.cq.dam.api.DamConstants,
                 com.day.cq.dam.commons.util.DamConfigurationConstants,
                 com.day.cq.dam.commons.util.DamUtil,
                 com.day.cq.i18n.I18n,
                 org.apache.sling.api.resource.Resource,
                 org.apache.sling.api.resource.ValueMap,
                 org.apache.sling.tenant.Tenant,
                 java.util.ArrayList,
                 java.util.Iterator,
                 java.util.List,
                 javax.jcr.Node"
%><%
%><%@taglib prefix="cq" uri="http://www.day.com/taglibs/cq/1.0" %><%
%><%@taglib prefix="sling" uri="http://sling.apache.org/taglibs/sling/1.0" %><%
%><cq:defineObjects /><%

    Config cfg = new Config(resource);
    final I18n i18n = new I18n(slingRequest);

    String formPath = slingRequest.getParameter("formPath");
    if(formPath == null || formPath.trim().isEmpty()){
        formPath = slingRequest.getRequestPathInfo().getSuffix();
    }
    Resource formPathRes = resourceResolver.getResource(formPath);
    String formPathOOTB =  DamConfigurationConstants.OOTB_METADATA_SCHEMA_FORM_HOME;
    if(formPathRes != null){
        Conf conf = resourceResolver.getResource(DamUtil.getTenantAssetsRoot(resourceResolver)).adaptTo(Conf.class);
        formPathOOTB = conf.getItem(DamConfigurationConstants.ADMIN_UI_OOTB_CONF_RELPATH).get(DamConfigurationConstants.METADATA_SCHEMA_HOME, DamConfigurationConstants.OOTB_METADATA_SCHEMA_FORM_HOME);

    }
    String formFieldsPath = cfg.get("formfields", "/libs/dam/gui/coral/components/admin/schemaforms/formbuilder/formfields");

    // v2 is meant for only metadataschemaeditor
    if(resource.getPath().contains("metadataschemaeditor")) {
        formFieldsPath = formFieldsPath + "/v2";
    }

/*
    Geting the resource from suffix of the url.
    The resource can be either from apps or libs whichever is applicable with a priority to apps folder
*/
    String suffix = slingRequest.getRequestPathInfo().getSuffix();
    suffix = null == suffix ? "/" : suffix;
    String relativePath;
    // convert the schemaHome path to absolute path
    formPathOOTB = resourceResolver.getResource(formPathOOTB).getPath();

    if (suffix.startsWith(formPath)) {
        relativePath = suffix.substring(formPath.length());
    } else if (suffix.startsWith(formPathOOTB)){
        relativePath = suffix.substring(formPathOOTB.length());
    }else{
        relativePath = suffix;
    }
    Resource rsc = resourceResolver.getResource(formPath + relativePath);

    if (rsc == null) {
        rsc = resourceResolver.getResource(formPathOOTB + relativePath);
    }

/*
    List of all the forms in the hiererchy is required to apply inheritance mechanism
*/
    List<Resource> masterTabList = SchemaFormHelper.getMasterForms(rsc);

    Resource rootTabRes = null;

// Get inherited items from ancestor resources
    if (!masterTabList.isEmpty()) {
        Resource root = masterTabList.get(0);
        rootTabRes = root.getChild("items/tabs");
        for (int i = 1; i < masterTabList.size(); i++) {
            Resource formRes = masterTabList.get(i);
            Resource formTabRes = formRes.getChild("items/tabs");
            rootTabRes = SchemaFormHelper.mergeFormTabResource(rootTabRes, formTabRes);
        }
    }

//get form for current Resource
    Resource currentFormResource = rsc;
    String currentFormPath = rsc.getPath();
    Resource currentTabListRes = currentFormResource.getChild("items/tabs");

    if (currentTabListRes == null) {
        Resource currentLibsRes = resourceResolver.getResource(formPathOOTB + relativePath);
        if (currentLibsRes != null && currentLibsRes.getChild("items/tabs") != null) {
            currentTabListRes = currentLibsRes.getChild("items/tabs");
        }
    }

// Add current tab resource to root resource
    if (rootTabRes != null) {
        rootTabRes = SchemaFormHelper.mergeFormTabResource(rootTabRes, currentTabListRes);
    } else {
        rootTabRes = currentTabListRes;
    }
    Tenant tenant = resourceResolver.adaptTo(Tenant.class);

%>
<div class="form-left" style="width:60%">
    <sling:include path="initializeconf" resourceType="dam/gui/coral/components/commons/initializeconf" /><%
    if (rootTabRes == null) {
%><div id="tabs-navigation" class="coral-TabPanel" data-init="tabs">
    <nav role="tablist" class="coral-TabPanel-navigation dam-schemeditor-panel-navigation">
        <a id="formbuilder-add-tab" href="#" data-target="#field-add" data-toggle="tab" class="coral-TabPanel-tab is-active">
            <i class="coral-Icon coral-Icon--add coral-Icon--sizeXS"></i>
        </a>
    </nav>
    <div class="coral-TabPanel-content dam-schemaeditor-panel-content">

        <section class="dummy-section coral-TabPanel-pane" style="display:none">
        </section>
    </div>
</div><%
} else {

%><div id="tabs-navigation" class="coral-TabPanel" data-init="tabs">
    <nav role="tablist" class="coral-TabPanel-navigation dam-schemeditor-panel-navigation">
        <%
            //master fields first
            Resource items = rootTabRes.getChild("items");

            if (items != null) {
                Iterator<Resource> it = items.listChildren();
                while (it.hasNext()) {
                    Resource tabRes = it.next();
                    Node tabnode = tabRes.adaptTo(Node.class);
                    String tabid = "";
                    if(tabnode.hasProperty("granite:data/tabid")) {
                        tabid = tabnode.getProperty("granite:data/tabid").getString();
                    }else if(tabnode.hasProperty("tabid")){
                        tabid = tabnode.getProperty("tabid").getString();
                    }
                    String tabName = getTabName(tabRes);
                    //if res does not starts with current path, then is master
                    boolean master = !(tabRes.getPath().startsWith(formPathOOTB + relativePath) || tabRes.getPath().startsWith(formPath + relativePath));
        %>
        <a href="#" data-toggle="tab" class="formbuilder-tab-anchor coral-TabPanel-tab" data-tabid="<%= xssAPI.encodeForHTMLAttr(tabid) %>" ><span><%= xssAPI.encodeForHTML(i18n.getVar(tabName)) %></span><%
            if (master) {
        %><i class="close-tab-button coral-Icon coral-Icon--close coral-Icon--sizeXS" disabled="disabled"></i><%
        } else {
        %><i class="close-tab-button coral-Icon coral-Icon--close coral-Icon--sizeXS"></i><%
            }
        %></a><%
        }
    %><a id="formbuilder-add-tab" href="#" data-target="#field-add" data-toggle="tab" class="coral-TabPanel-tab">
        <i class="coral-Icon coral-Icon--add coral-Icon--sizeXS"></i>
    </a>
    </nav><%
    it = items.listChildren();
%><div class="coral-TabPanel-content dam-schemaeditor-panel-content"><%
    while (it.hasNext()) {
        Resource mergedTab = it.next();
%><section class="formbuilder-tab-section coral-TabPanel-pane" role="tabpanel">
    <div class="panel"><%
        Resource items1 = mergedTab.getChild("items");
        if (items1 != null) {
            Iterator<Resource> colsIt = items1.listChildren();
            while (colsIt.hasNext()) {
                Resource colRes = colsIt.next();
                Resource colItems = colRes.getChild("items");
                if (colItems != null) {
                    Iterator<Resource> columnFields = colItems.listChildren();
                    List<Resource> masterItems = new ArrayList<Resource>();
                    List<Resource> currentItems = new ArrayList<Resource>();
                    while (columnFields.hasNext()) {
                        Resource columnField = columnFields.next();
                        if (!(columnField.getPath().startsWith(currentFormPath) || columnField.getPath().startsWith(formPathOOTB + relativePath))) {
                            masterItems.add(columnField);
                        } else {
                            currentItems.add(columnField);
                        }
                    }
    %><div class="column" role="grid"><%
        if (!masterItems.isEmpty()) {
    %><fieldset>
        <legend class="coral-Icon coral-Icon--lockOn coral-Icon--sizeM"></legend>
        <ol class="master-fields" role="presentation"><%
            for (Resource col1Item : masterItems) {
                ValueMap field = col1Item.adaptTo(ValueMap.class);
                String type = field.get("granite:data/metaType", "");
                if(type.trim().isEmpty()){
                    type = field.get("metaType", "");
                }
        %><li data-id="<%= xssAPI.encodeForHTMLAttr(col1Item.getName()) %>" class="field" role="row" tabindex="-1" data-fieldtype="<%= xssAPI.encodeForHTMLAttr(type) %>"><%
            if (type.trim().isEmpty()) {
            %><sling:include resource="<%= col1Item %>" /><%
            } else {
            %><sling:include resource="<%= col1Item %>"
                           resourceType="<%= formFieldsPath + "/" + type + "field" %>" /><%
            }
        %></li><%
            }
        %></ol>
    </fieldset><%
        }
    %><ol class="form-fields" role="presentation"><%
        for (Resource col1Item : currentItems) {
            ValueMap field = col1Item.adaptTo(ValueMap.class);
            String type = field.get("granite:data/metaType", "");
            if(type.trim().isEmpty()){
                type = field.get("metaType", "");
            }
    %><li data-id="<%= xssAPI.encodeForHTMLAttr(col1Item.getName()) %>" class="field" role="row" tabindex="-1" data-fieldtype="<%= xssAPI.encodeForHTMLAttr(type) %>">
        <% if (type.equals("youtubeurllist")) { %>
        <sling:include resource="<%= col1Item %>"
                       resourceType="dam/gui/coral/components/admin/schemaforms/formbuilder/formfields/v2/youtubeurllist" />
        <% } else if (type.trim().isEmpty()) {
        %><sling:include resource="<%= col1Item %>" /><%
        } else {
        %><sling:include resource="<%= col1Item %>"
                       resourceType="<%= formFieldsPath + "/" + type + "field" %>" /><%
        } %>
    </li><%
        }
    %></ol>
    </div><%
    } else {
    %><div class="column">
        <ol class="form-fields"></ol>
    </div><%
                } //end if colItems != null
            }//end while colsIts.hasNext()
        }//end if tab items != null
    %></div>
</section><%
            }//end while tablist
        }

    }
%><section class="dummy-section coral-TabPanel-pane" style="display:none">
</section>
</div>
</div>
</div>
<%!
    String getTabName(Resource res) {
        LabeledResource label = res.adaptTo(LabeledResource.class);
        return label.getTitle();
    }
    private String getFacetOverlayPathPrefix(Tenant tenant){
        String overlayPrefix = "/conf/global/settings";
        if(null != tenant){
            overlayPrefix = "/conf/tenants/" + tenant.getId() + "/settings";
        }
        return overlayPrefix;
    }

%>
