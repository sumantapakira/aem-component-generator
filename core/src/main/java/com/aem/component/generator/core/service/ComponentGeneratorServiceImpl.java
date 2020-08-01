package com.aem.component.generator.core.service;

import com.aem.component.generator.core.servlets.ComponentListServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.scripting.SlingScriptHelper;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;
import org.osgi.service.component.propertytypes.ServiceDescription;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;
import javax.jcr.query.Query;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * This is not used
 */
@Component(service = ComponentGeneratorService.class,configurationPolicy= ConfigurationPolicy.OPTIONAL,  immediate = true, enabled = true)

@ServiceDescription("My simple service")
public class ComponentGeneratorServiceImpl implements ComponentGeneratorService{

    private static final Logger LOG = LoggerFactory.getLogger(ComponentGeneratorServiceImpl.class);
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
        Session session = resourceResolver.adaptTo(Session.class);
        if(session.nodeExists("/var/component-generator/settings")){
            Node settingNode = session.getNode("/var/component-generator/settings");
            String componentProp = settingNode.hasProperty("component_path") ? settingNode.getProperty("component_path").getString() : StringUtils.EMPTY;
            String componentPath = StringUtils.defaultIfEmpty(componentProp,DEFAULT_PATH);
        }
        return DEFAULT_PATH;
    }
}


