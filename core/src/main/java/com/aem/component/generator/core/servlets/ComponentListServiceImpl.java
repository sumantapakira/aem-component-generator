package com.aem.component.generator.core.servlets;

import com.aem.component.generator.core.servlets.ComponentListService;
import com.drew.lang.annotations.NotNull;
import com.drew.lang.annotations.Nullable;
import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.scripting.SlingScriptHelper;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.propertytypes.ServiceDescription;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.*;
import javax.jcr.query.Query;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Component(
        immediate = true,
        service = ComponentListService.class,
        configurationPid = "com.aem.component.generator.core.servlets.ComponentListServiceImpl")
@ServiceDescription("Get list of all available components")
public class ComponentListServiceImpl implements ComponentListService{
    private static final Logger LOG = LoggerFactory.getLogger(ComponentListServiceImpl.class);
    private static final String DEFAULT_PATH= "/apps/component-generator/components";

    @Override
    public List<Resource> getListOfComponents(ResourceResolver resourceResolver, String path) {
        LOG.info("getListOfComponents path : "+path);
        String QUERY="select * from [cq:Component]";
        List<Resource> components= new ArrayList<Resource>();

        final Iterator<Resource> inpageSectionResources = getResourceIterator(resourceResolver, path, QUERY);
        while(inpageSectionResources.hasNext()){
            Resource sectionResource = inpageSectionResources.next();
            components.add(sectionResource);
        }
        return components;
    }

    @Override
    public List<String> getListOfComponentsGroup(ResourceResolver resourceResolver) {
        final String path = "/apps/";
        String QUERY="select * from [cq:Component]";
        List<String> components= new ArrayList<String>();

        final Iterator<Resource> resourcesItr = getResourceIterator(resourceResolver, path, QUERY);
        while(resourcesItr.hasNext()){
            Resource resource = resourcesItr.next();
            String groupName;
            if(!components.contains(groupName = resource.getValueMap().get("componentGroup", String.class))) {
                components.add(groupName);
            }
         }
        return components;
    }


    public Iterator<Resource> getResourceIterator(ResourceResolver resourceResolver , String path,String QUERY){
        if(StringUtils.isNotEmpty(path) && !QUERY.contains("ISDESCENDANTNODE")) {
          QUERY = QUERY + " where ISDESCENDANTNODE([" + path + "])";
        }
        LOG.info("QUERY {} : ", QUERY);
        return resourceResolver.findResources(QUERY, Query.JCR_SQL2);
    }

    @Override
    public Iterator<Resource> getCustomizedComponentList(ResourceResolver resolver, SlingScriptHelper sling, SlingHttpServletRequest request){
        LOG.info("getCustomizedComponentList");
        LOG.info("frompath: "+request.getParameter("formPath"));
        String QUERY="select * from [cq:Component]";
        return getResourceIterator(resolver, request.getParameter("formPath"), QUERY);

    }

    @Override
    public String getUserComponentPath(ResourceResolver resourceResolver, String pathType) throws RepositoryException {
        Session session = resourceResolver.adaptTo(Session.class);
        if(session.nodeExists("/var/component-generator/settings")){
            String userSettings;
            Node settingNode = session.getNode("/var/component-generator/settings");
            UserSettings settings = getDirectoryType(pathType);
            switch (settings){
                case COMPONENT_PATH : userSettings = fetchUserSettings(settingNode, settings.value);
                    break;
                 case UI_DIR_PATH : userSettings =  fetchUserSettings(settingNode, settings.value);
                    break;
                case CORE_MODULE_PATH : userSettings = fetchUserSettings(settingNode, settings.value);
                    break;
                case REACT_DIR_PATH : userSettings = fetchUserSettings(settingNode, settings.value);
                    break;
                default: userSettings = DEFAULT_PATH;
                   break;
            }
            return userSettings;

        }
        return DEFAULT_PATH;
    }

    private String fetchUserSettings(Node settingNode,String type) throws RepositoryException {
        LOG.debug("type : "+ type);
        String s = settingNode.hasProperty(type) ? settingNode.getProperty(type).getString() : StringUtils.EMPTY;
        LOG.debug("type 22 : "+ s);
       return settingNode.hasProperty(type) ? settingNode.getProperty(type).getString() : StringUtils.EMPTY;
    }

    protected enum UserSettings {
        COMPONENT_PATH("component_path"),
        UI_DIR_PATH("ui_apps_directory_path"),
        CORE_MODULE_PATH("core_bundle_directory_path"),
        REACT_DIR_PATH("react_module_directory_path"),
        EMPTY(StringUtils.EMPTY);

        private final String value;

        UserSettings(String value) {
            this.value = value;
        }

        /**
         * Get the source from the string value.
         *
         * @param value The value.
         * @return The source if it exists, or null if no source has a matching value.
         */
        @Nullable
        public static UserSettings fromString(String value) {
            for (UserSettings s : values()) {
                if (StringUtils.equals(value, s.value)) {
                    return s;
                }
            }
            return null;
        }
    }

    @NotNull
    private UserSettings getDirectoryType(String type) {
        return UserSettings.fromString(type);
    }
}
