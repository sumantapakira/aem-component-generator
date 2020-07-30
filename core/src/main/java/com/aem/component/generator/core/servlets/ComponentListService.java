package com.aem.component.generator.core.servlets;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.scripting.SlingScriptHelper;

import javax.jcr.RepositoryException;
import javax.servlet.http.HttpServletRequest;
import java.util.Iterator;
import java.util.List;

public interface ComponentListService {
     List<Resource> getListOfComponents(ResourceResolver resourceResolver, String path);
     List<String> getListOfComponentsGroup(ResourceResolver resourceResolver);
     Iterator<Resource> getCustomizedComponentList(ResourceResolver resourceResolver, SlingScriptHelper sling, SlingHttpServletRequest request);
     String getUserComponentPath(ResourceResolver resourceResolver, String pathType) throws RepositoryException;
}
