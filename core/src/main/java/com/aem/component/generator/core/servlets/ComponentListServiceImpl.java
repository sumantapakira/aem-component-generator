package com.aem.component.generator.core.servlets;

import com.aem.component.generator.core.servlets.ComponentListService;
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

import javax.jcr.RepositoryException;
import javax.jcr.Value;
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

        final Iterator<Resource> inpageSectionResources = getResourceIterator(resourceResolver, path, QUERY);
        while(inpageSectionResources.hasNext()){
            Resource sectionResource = inpageSectionResources.next();
            components.add(sectionResource.getValueMap().get("componentGroup", String.class));
         }
        return components;
    }


    public Iterator<Resource> getResourceIterator(ResourceResolver resourceResolver , String path,String QUERY){
        LOG.info("QUERY 1 : "+QUERY);
        if(StringUtils.isNotEmpty(path) && !QUERY.contains("ISDESCENDANTNODE")) {
          QUERY = QUERY + " where ISDESCENDANTNODE([" + path + "])";
        }
        LOG.info("QUERY 2 : "+QUERY);
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
    public String getUserComponentPath(ResourceResolver resourceResolver) throws RepositoryException {
        UserManager usMgr = resourceResolver.adaptTo(UserManager.class);
        Authorizable authorizable = usMgr.getAuthorizable(resourceResolver.getUserID());
        User user = (User) authorizable;
        Value[] value = user.getProperty("component_path");
        String componentPath = StringUtils.defaultIfEmpty(value[0].getString(),"/apps/");
        return componentPath;
    }
}
