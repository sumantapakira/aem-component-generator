/*
 * Copyright Sumanta Pakira
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
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
