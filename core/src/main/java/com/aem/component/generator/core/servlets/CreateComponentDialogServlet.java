package com.aem.component.generator.core.servlets;

import com.aem.component.generator.core.commons.Utils;
import com.drew.lang.annotations.NotNull;
import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.oak.jcr.Jcr;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.request.RequestParameterMap;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.jcr.resource.api.JcrResourceConstants;
import org.json.JSONObject;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

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
import java.util.*;
import java.util.stream.Collectors;

import static java.util.Comparator.*;

@Component(service = Servlet.class, property = {"sling.servlet.methods=" + HttpConstants.METHOD_POST,
        "sling.servlet.paths=" + "/bin/servets/createcomponentdialog", "sling.servlet.extensions=json"})

public class CreateComponentDialogServlet extends SlingAllMethodsServlet {
    final static String component_directory ="/Users/zospakir/Projects/AEM/Code/acs-tool/component-generator/ui.apps/src/main/content/jcr_root";
    private static final Logger LOG = LoggerFactory.getLogger(CreateComponentDialogServlet.class);

    @Override
    protected void doPost(final SlingHttpServletRequest req,
                         final SlingHttpServletResponse resp) throws ServletException, IOException {
        LOG.info("doPost called..: ");
        final Resource resource = req.getResource();
         RequestParameterMap requestParameterMap = req.getRequestParameterMap();
        Map<String, String> unsrotedMap =
                new HashMap<String, String>();
        String componentPath = StringUtils.EMPTY;
        try {
            for (String key : requestParameterMap.keySet()) {
                RequestParameter requestParameter = requestParameterMap.getValue(key);
                String propertyValue = requestParameter.getString();
                if(key.equals("componentPath")){
                    componentPath = propertyValue;
                }
                unsrotedMap.put(key, propertyValue);
            }

            final NavigableMap<String, String> sortedMap = new TreeMap<>((a, b) -> {
                final long slashes1 = a.chars().filter(c -> c == '/').count();
                final long slashes2 = b.chars().filter(c -> c == '/').count();
                return slashes1 != slashes2 ? Long.compare(slashes1, slashes2) : a.compareTo(b);
            });
            sortedMap.putAll(unsrotedMap);

            //LOG.info("SortedMap: "+sm);

            Utils.createFolder(component_directory + componentPath + "/"+"_cq_dialog");

            Document document = DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument();
            Element rootElement = Utils.createRootElement(document);
            rootElement.setAttribute(JcrConstants.JCR_PRIMARYTYPE, JcrConstants.NT_UNSTRUCTURED);
            rootElement.setAttribute(JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY, "cq/gui/components/authoring/dialog");

            Element layoutElement = null;
            ArrayList<Element> elementList = new ArrayList<Element>();
            Node node = null;
            Element el = null;

            for (Map.Entry<String, String> entry : sortedMap.entrySet()) {
                LOG.info("Key: "+entry.getKey());
                LOG.info("Value: "+entry.getValue());
                if(entry.getKey().startsWith("./cq:dialog/content")) {
                    if(StringUtils.isBlank(entry.getValue())) {
                         int len = entry.getKey().split("/").length -1 ;
                         String nodeName = entry.getKey().split("/")[len];
                        LOG.info("nodeName key: "+nodeName);

                        el  = Utils.createNode(document, nodeName, StringUtils.EMPTY);
                        node = node == null ? rootElement.appendChild(el) : node.appendChild(el);
                    }else{
                        String value = entry.getValue().startsWith("./") ? StringUtils.substringAfterLast(entry.getValue(), "/") : entry.getValue();
                        String key = StringUtils.substringAfterLast(entry.getKey(), "/");
                        LOG.info("****************value****** "+value);
                        LOG.info("****************key****** "+key);
                        if(key.equals(value)){
                            LOG.info("****************same****** ");
                            el = Utils.createNode(document,key,StringUtils.EMPTY);
                            node.appendChild(el);
                        }
                        el.setAttribute(key, entry.getValue());
                    }
                }

               /* if(entry.getKey().startsWith("./cq:dialog/content")){
                    LOG.info("Key111111 : "+layoutElement);
                    if(StringUtils.isBlank(entry.getValue())){
                        LOG.info("22222 : "+StringUtils.substringAfterLast(entry.getKey(), "/"));
                        String nodeName = StringUtils.substringAfterLast(entry.getKey(), "/");
                         layoutElement = Utils.createNode(document,nodeName,StringUtils.EMPTY);
                    }else if(layoutElement != null){
                        String value = entry.getValue().startsWith("./") ? StringUtils.substringAfterLast(entry.getValue(), "/") : entry.getValue();
                        String key = StringUtils.substringAfterLast(entry.getKey(), "/");
                        LOG.info("33333 key: "+key);
                        LOG.info("33333 value: "+value);
                        if(key.equals(value)){
                            LOG.info("****************same****** ");
                            layoutElement = Utils.createNode(document,key,StringUtils.EMPTY);
                        }
                        layoutElement.setAttribute(key, entry.getValue());
                    }

                    LOG.info("layoutElement : "+layoutElement);
                   // elementList.add(layoutElement);
                    rootElement.appendChild(layoutElement);
                  }*/
            }

           /* ArrayList<String> list = new ArrayList<String>();
            list.add("ab");
            list.add("cd");
            list.add("ef");
            list.add("gh");
            list.add("ij");

            Node node = null;
            for(String s : list){
                Element el = Utils.createNode(document,s,StringUtils.EMPTY);
                node = node == null ? rootElement.appendChild(el): node.appendChild(el);
            }*/



           // rootElement.appendChild(layoutElement);

            document.appendChild(rootElement);
            Utils.transformDomToFile(document, component_directory + componentPath + "/"+"_cq_dialog");

            JSONObject json = new JSONObject();
            json.put("result", "ok");
            resp.getWriter().write(json.toString());
        } catch (Exception e) {
            LOG.error("Error: ",e);
            resp.setContentType("text/plain");
            resp.getWriter().write("Error");
        }

    }

    @Override
    protected void doGet(final SlingHttpServletRequest req,
                          final SlingHttpServletResponse resp) throws ServletException, IOException {
        LOG.info("doGet called..: ");
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
            LOG.error("Error: ",e);
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
