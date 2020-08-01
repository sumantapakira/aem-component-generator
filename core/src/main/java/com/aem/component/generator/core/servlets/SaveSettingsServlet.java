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

import com.aem.component.generator.core.commons.Constants;
import com.day.cq.commons.jcr.JcrConstants;
import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.json.JSONException;
import org.json.JSONObject;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.ValueFactory;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;

@Component(service = Servlet.class, property = {"sling.servlet.methods=" + HttpConstants.METHOD_POST,
        "sling.servlet.paths=" + "/bin/servets/savesettings", "sling.servlet.extensions=json"})

public class SaveSettingsServlet extends SlingAllMethodsServlet {
    private static final Logger LOG = LoggerFactory.getLogger(SaveSettingsServlet.class);
    @Override
    protected void doPost(final SlingHttpServletRequest req,
                         final SlingHttpServletResponse resp) throws ServletException, IOException {
        final Resource resource = req.getResource();
        if(StringUtils.isBlank(req.getParameter("projectpath"))){
            return;
        }

        try {
            resp.setContentType("application/json");
            Session session = req.getResourceResolver().adaptTo(Session.class);
            if(session.nodeExists(Constants.VAR_SETTING_NODE)){
                Node settingNode = session.getNode(Constants.VAR_SETTING_NODE);
                setSettingsProperty(settingNode, req);
            }else{
                Node varNode= session.getNode("/var");
                Node generatorNode = varNode.addNode("component-generator");
                Node settingNode = generatorNode.addNode("settings",JcrConstants.NT_UNSTRUCTURED);
                setSettingsProperty(settingNode, req);
            }

            session.save();
            JSONObject json = new JSONObject();
            json.put("result", "ok");
            resp.getWriter().write(json.toString());
        } catch (RepositoryException | JSONException e) {
            LOG.error("Error: ",e);
            resp.setContentType("text/plain");
            resp.getWriter().write("Error");
        }

    }

    /**
     *
     * @param node
     * @param request
     * @throws RepositoryException
     */
    private void setSettingsProperty(Node node, SlingHttpServletRequest request) throws RepositoryException {
        String projectPath;
        String uiPath;
        String corePath;
        String reactPath;

        if( StringUtils.isNotEmpty(projectPath = request.getParameter("projectpath"))){
            node.setProperty("component_path",projectPath);
        }
        if( StringUtils.isNotEmpty(uiPath = request.getParameter("uipath"))){
            node.setProperty("ui_apps_directory_path",uiPath);
        }
        if( StringUtils.isNotEmpty(corePath = request.getParameter("corepath"))){
            node.setProperty("core_bundle_directory_path",corePath);
        }
        if( StringUtils.isNotEmpty(reactPath = request.getParameter("reactpath"))){
            node.setProperty("react_module_directory_path",reactPath);
        }
    }

    @Override
    protected void doGet(final SlingHttpServletRequest req,
                          final SlingHttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }
}
