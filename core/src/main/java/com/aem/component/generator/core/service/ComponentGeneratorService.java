package com.aem.component.generator.core.service;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.scripting.SlingScriptHelper;

import javax.jcr.RepositoryException;
import java.util.Iterator;
import java.util.List;

public interface ComponentGeneratorService {
    List<Resource> getListOfComponents(ResourceResolver resourceResolver, String path);
    Iterator<Resource> getCustomizedComponentList(ResourceResolver resourceResolver, SlingScriptHelper sling, SlingHttpServletRequest request);
    String getUserComponentPath(ResourceResolver resourceResolver) throws RepositoryException;
}
