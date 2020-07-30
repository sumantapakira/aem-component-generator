package com.aem.component.generator.core.servlets;

import com.aem.component.generator.core.commons.Constants;
import com.aem.component.generator.core.commons.Utils;
import com.drew.lang.annotations.NotNull;
import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.json.JSONObject;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.File;
import java.io.IOException;

@Component(service = Servlet.class, property = {"sling.servlet.methods=" + HttpConstants.METHOD_POST,
        "sling.servlet.paths=" + "/bin/servets/createcomponent", "sling.servlet.extensions=json"})

public class CreateComponentFolderServlet extends SlingAllMethodsServlet {
    private static final Logger LOG = LoggerFactory.getLogger(CreateComponentFolderServlet.class);

    @Reference
    ComponentListService componentListService;

    @Override
    protected void doPost(final SlingHttpServletRequest req,
                          final SlingHttpServletResponse resp) throws ServletException, IOException {
        final Resource resource = req.getResource();
        String componentName = req.getParameter("componentName");
        String componentPath = req.getParameter("componentPath");
        String resourceSuperType = req.getParameter("resourceSuperType");
        String groupName = req.getParameter("groupName");
        String isContainer = req.getParameter("isContainer");
        if (StringUtils.isBlank(componentName) && StringUtils.isBlank(componentPath)) {
            return;
        }
        try {
            String userUIAppsDirectory = componentListService.getUserComponentPath(req.getResourceResolver(), "ui_apps_directory_path");
            userUIAppsDirectory = userUIAppsDirectory.endsWith("/") ? userUIAppsDirectory : userUIAppsDirectory + Constants.FORWARD_SLASH;
            String aemProjectPath = componentListService.getUserComponentPath(req.getResourceResolver(), "component_path");
            aemProjectPath = aemProjectPath.endsWith("/") ? aemProjectPath : aemProjectPath + Constants.FORWARD_SLASH;
            String componentDirectoryPath = userUIAppsDirectory + aemProjectPath + componentName.toLowerCase();
            LOG.debug("componentDirectoryPath : " + componentDirectoryPath);

            File file = new File(componentDirectoryPath);
            if (!file.exists()) {
                if (file.mkdir()) {
                    createComponentXml(componentName, groupName, resourceSuperType, isContainer, componentDirectoryPath);
                    Utils.createAndWriteHTL(componentDirectoryPath, componentName.toLowerCase());
                }
            }
            JSONObject json = new JSONObject();
            json.put("result", "ok");
            resp.getWriter().write(json.toString());
        } catch (Exception e) {
            LOG.error("Error:", e);
            resp.setContentType("text/plain");
            resp.getWriter().write("Error");
        }

    }

    @Override
    protected void doGet(final SlingHttpServletRequest req,
                         final SlingHttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }

    private void createComponentXml(@NotNull String componentName, String groupName, String resourceSuperType, String isContainer, @NotNull String filePath) {
        try {
            Document document = DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument();
            Element rootElement = Utils.createRootElement(document);

            rootElement.setAttribute(JcrConstants.JCR_PRIMARYTYPE, "cq:Component");
            rootElement.setAttribute(com.day.cq.commons.jcr.JcrConstants.JCR_TITLE, componentName);
            if (StringUtils.isNotBlank(groupName)) {
                rootElement.setAttribute("componentGroup", groupName);
            }
            if (StringUtils.isNotBlank(resourceSuperType)) {
                rootElement.setAttribute("sling:resourceSuperType", resourceSuperType);
            }
            if (StringUtils.isNotBlank(isContainer) && Boolean.parseBoolean(isContainer)) {
                rootElement.setAttribute("cq:isContainer", "{Boolean}true");
            }
            document.appendChild(rootElement);
            Utils.transformDomToFile(document, filePath);

        } catch (ParserConfigurationException e) {
            LOG.error("Error: ", e);
        }
    }


}
