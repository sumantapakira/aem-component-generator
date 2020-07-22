package com.aem.component.generator.core.servlets;

import com.drew.lang.annotations.NotNull;
import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.request.RequestParameterMap;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.json.JSONObject;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.File;
import java.io.IOException;
import java.util.List;

@Component(service = Servlet.class, property = {"sling.servlet.methods=" + HttpConstants.METHOD_POST,
        "sling.servlet.paths=" + "/bin/servets/createcomponentdialog", "sling.servlet.extensions=json"})

public class CreateComponentDialogServlet extends SlingAllMethodsServlet {
    final static String component_directory ="/Users/zospakir/Projects/AEM/Code/acs-tool/component-generator/ui.apps/src/main/content/jcr_root/";
    private static final Logger LOG = LoggerFactory.getLogger(CreateComponentDialogServlet.class);

    @Override
    protected void doPost(final SlingHttpServletRequest req,
                         final SlingHttpServletResponse resp) throws ServletException, IOException {
        final Resource resource = req.getResource();
        String componentName = req.getParameter("componentName");
        String componentPath = req.getParameter("componentPath");
        String resourceSuperType = req.getParameter("resourceSuperType");
        RequestParameterMap requestParameterMap = req.getRequestParameterMap();

        try {
            for (String key : requestParameterMap.keySet()) {
                RequestParameter requestParameter = requestParameterMap.getValue(key);
                String propertyValue = requestParameter.getString();
                LOG.info("Key: "+key + " , value : "+propertyValue);
            }

            JSONObject json = new JSONObject();
            json.put("result", "ok");
            resp.getWriter().write(json.toString());
        } catch (Exception e) {
            e.printStackTrace();
            resp.setContentType("text/plain");
            resp.getWriter().write("Error");
        }

    }

    @Override
    protected void doGet(final SlingHttpServletRequest req,
                          final SlingHttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }

    private static void createComponentXml(@NotNull String componentName, String groupName, String resourceSuperType, String isContainer, @NotNull String filePath){
        try {
            Document document = DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument();
            Element rootElement = document.createElement("jcr:root");
            rootElement.setAttribute("xmlns:sling", "http://sling.apache.org/jcr/sling/1.0");
            rootElement.setAttribute("xmlns:cq", "http://www.day.com/jcr/cq/1.0");
            rootElement.setAttribute("xmlns:jcr", "http://www.jcp.org/jcr/1.0");
            rootElement.setAttribute("xmlns:nt", "http://www.jcp.org/jcr/nt/1.0");

            rootElement.setAttribute(JcrConstants.JCR_PRIMARYTYPE, "cq:Component");
            rootElement.setAttribute(com.day.cq.commons.jcr.JcrConstants.JCR_TITLE, componentName);
            if(StringUtils.isNotBlank(groupName)) {
                rootElement.setAttribute("componentGroup", groupName);
            }
            if(StringUtils.isNotBlank(resourceSuperType)) {
                rootElement.setAttribute("sling:resourceSuperType", resourceSuperType);
            }
            if(StringUtils.isNotBlank(isContainer) && Boolean.parseBoolean(isContainer)) {
                rootElement.setAttribute("cq:isContainer", "{Boolean}true");
            }
            document.appendChild(rootElement);
            transformDomToFile(document, filePath);

        } catch (ParserConfigurationException e) {
            e.printStackTrace();
        }
    }

    private static void transformDomToFile(Document document, String filePath) {
        try {
            TransformerFactory tf = TransformerFactory.newInstance();
            Transformer tr = tf.newTransformer();

            //config for beautify/prettify xml content.
            tr.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
            tr.setOutputProperty(OutputKeys.INDENT, "yes");
            tr.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");

            DOMSource source = new DOMSource(document);
            File file = new File(filePath + "/"+".content.xml");
            StreamResult result = new StreamResult(file);

            //transform your DOM source to the given file location.
            tr.transform(source, result);

        } catch (Exception e) {
            throw new IllegalArgumentException("Exception while DOM conversion to file : " + filePath);
        }
    }
}
