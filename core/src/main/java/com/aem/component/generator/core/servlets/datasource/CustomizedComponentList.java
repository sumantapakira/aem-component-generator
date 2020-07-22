package com.aem.component.generator.core.servlets.datasource;

import com.aem.component.generator.core.servlets.ComponentListService;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.scripting.SlingScriptHelper;
import org.osgi.framework.BundleContext;
import org.osgi.framework.ServiceReference;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.util.Iterator;

@Component
public class CustomizedComponentList {

   /* public static Iterator<Resource> getCustomizedComponentList(ResourceResolver resolver, SlingScriptHelper sling){
        ComponentListService componentListService = sling.getService(ComponentListService.class);
        return componentListService.getResourceIterator(resolver, "/apps/");

    }*/


}
