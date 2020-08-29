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
package com.aem.component.generator.core.commons;

import com.aem.component.generator.core.handlerbar.SlingModelTemplateSource;
import com.aem.component.generator.core.models.HTLModel;
import com.aem.component.generator.core.models.ReactModel;
import com.aem.component.generator.core.models.SlingModel;
import com.drew.lang.annotations.NotNull;
import com.github.jknack.handlebars.Handlebars;
import com.github.jknack.handlebars.Template;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Multimap;
import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.jcr.resource.api.JcrResourceConstants;
import org.osgi.framework.BundleContext;
import org.osgi.framework.FrameworkUtil;
import org.osgi.framework.ServiceReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

public class Utils {
    private static final Logger LOG = LoggerFactory.getLogger(Utils.class);

    private static final String SUBSERVICE_NAME = "component-generator";

    private static final Map<String, Object> AUTH_INFO = ImmutableMap.<String, Object>of(ResourceResolverFactory.SUBSERVICE,
            SUBSERVICE_NAME);
    private static final List<String> RT_PROPERTY = ImmutableList.<String>of(
            Constants.RT_TEXTFIELD,
            Constants.RT_RICHTEXT,
            Constants.RT_PATHFIELD,
            Constants.RT_SELECTFIELD
    );

    /**
     * @param document
     * @return
     */
    public static Element createRootElement(Document document) {
        Element rootElement = document.createElement("jcr:root");
        rootElement.setAttribute("xmlns:sling", "http://sling.apache.org/jcr/sling/1.0");
        rootElement.setAttribute("xmlns:cq", "http://www.day.com/jcr/cq/1.0");
        rootElement.setAttribute("xmlns:jcr", "http://www.jcp.org/jcr/1.0");
        rootElement.setAttribute("xmlns:nt", "http://www.jcp.org/jcr/nt/1.0");
        rootElement.setAttribute("xmlns:granite", "http://www.adobe.com/jcr/granite/1.0");

        return rootElement;
    }

    /**
     * @param document
     * @param filePath
     */
    public static void transformDomToFile(Document document, String filePath) {
        try {
            TransformerFactory factory = TransformerFactory.newInstance();
            Transformer transformer = factory.newTransformer();

            transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");

            DOMSource domSource = new DOMSource(document);
            File file = new File(filePath + "/" + Constants.CONTENT_XML_NAME);
            StreamResult result = new StreamResult(file);

            transformer.transform(domSource, result);

        } catch (Exception e) {
            LOG.error("Error: ", e);
        }
    }

    /**
     * @param folderPath
     * @return
     * @throws Exception
     */
    public static Path createFolder(String folderPath) throws Exception {
        Path path = Paths.get(folderPath);
        if (Files.notExists(path)) {
            return Files.createDirectories(path);
        }
        return path;
    }

    /**
     * @param document
     * @param nodeName
     * @param resourceType
     * @return
     */
    public static Element createNode(Document document, String nodeName, String resourceType) {
        Element containerElement = document.createElement(nodeName);
        containerElement.setAttribute(JcrConstants.JCR_PRIMARYTYPE, JcrConstants.NT_UNSTRUCTURED);
        if (StringUtils.isNotBlank(resourceType)) {
            containerElement.setAttribute(JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY, resourceType);
        }
        return containerElement;
    }

    public static void createAndWriteHTL(String componentDirectoryPath, String fileName) {
        Path file = Paths.get(componentDirectoryPath + Constants.FORWARD_SLASH + fileName + Constants.HTML_EXTENSION);
        writeToFile(file, Constants.HTL_TEMPLATE);
    }

    /**
     * @param file
     * @param template
     */
    private static void writeToFile(Path file, String template) {
        try (BufferedWriter writer = Files.newBufferedWriter(file, StandardCharsets.UTF_8)) {
            writer.write(template, 0, template.length());
        } catch (IOException e) {
            LOG.error("Error: ", e);
        }
    }

    /**
     * @param folderPath
     * @return
     */
    private static String getPackageName(String folderPath) {
        String osName= whichOS();
        if((osName.indexOf("win") >= 0)){
            return StringUtils.substringAfter(folderPath, "\\main\\java\\").replace(Constants.BACK_SLASH, Constants.DOT);
        }else if((osName.indexOf("mac") >= 0)){
            return StringUtils.substringAfter(folderPath, "main/java/").replaceAll(Constants.FORWARD_SLASH, Constants.DOT);
        }else{
            return StringUtils.EMPTY;
        }
    }

    /**
     * @param bundleContext
     * @param clazz
     * @param <T>
     * @return
     */
    private static <T> T getService(BundleContext bundleContext, Class<T> clazz) {
        final ServiceReference<T> serviceReference = bundleContext.getServiceReference(clazz);
        return bundleContext.getService(serviceReference);
    }

    /**
     *
     * @param componentContentXml
     * @return
     */
    private static boolean isContainerComponent(String componentContentXml) {
        DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder documentBuilder = null;
        try {
            File fXmlFile = new File(componentContentXml);
            documentBuilder = documentBuilderFactory.newDocumentBuilder();
            Document document = documentBuilder.parse(fXmlFile);
            NodeList nList = document.getElementsByTagName("jcr:root");

            for (int temp = 0; temp < nList.getLength(); temp++) {
                Node nNode = nList.item(temp);
                if (nNode.getNodeType() == Node.ELEMENT_NODE) {
                    Element eElement = (Element) nNode;
                    String isContainer = eElement.getAttribute("cq:isContainer");
                    if (isContainer.contains("{Boolean}")) {
                        isContainer = StringUtils.substringAfter(isContainer, "{Boolean}");
                    }
                    if (StringUtils.isNotBlank(isContainer) && Boolean.parseBoolean(isContainer)) {
                        return Boolean.TRUE;
                    }
                }
            }
        } catch (ParserConfigurationException | SAXException | IOException e) {
            LOG.error("Error: ", e);
        }
        return Boolean.FALSE;
    }

    public static Node getNode(Node node) {
        NodeList nList = node.getChildNodes();
        for(int temp = 0; temp < nList.getLength(); temp++) {
            Node nNode = nList.item(temp);
            if(nNode.getNodeType() == Node.ELEMENT_NODE){
                Element eElement = (Element) nNode;
                String container = eElement.getAttribute("name");
                if(StringUtils.isNotBlank(container)) {
                    return nNode;
                }
            }
            Node found = getNode(nNode);
            if (null != found) {
                return found;
            }
        }
        return null;
    }

    /**
     *
     * @param slingModelInfo
     */
    public void createSlingModelClass(SlingModel slingModelInfo) {
        String folderPath = getCoreModelPath(slingModelInfo.getModulePath());
        if (StringUtils.isNotBlank(folderPath)) {
            try {
                String fileName = slingModelInfo.getModelName().replaceAll("-", "");
                fileName = fileName.replaceAll("_", "");
                String modelDirctoryPath = folderPath + Constants.FORWARD_SLASH + fileName;
                Path file1 = Files.createDirectories(Paths.get(modelDirctoryPath.toLowerCase()));
                String classfileDirctory = folderPath + Constants.FORWARD_SLASH + fileName + Constants.FORWARD_SLASH + fileName + "Impl" + Constants.JAVA_EXTENSION;
                String classTemplate = getHandlebarTemplate(getPackageName(modelDirctoryPath), fileName, slingModelInfo.getResourceType(), slingModelInfo.getMultimap());
                Path file = Paths.get(classfileDirctory);
                LOG.debug("Class File name {} , created at {}, package location {}", file.getFileName(), classfileDirctory, getPackageName(modelDirctoryPath));
                writeToFile(file, classTemplate);

                String interfacefileDirctory = folderPath + Constants.FORWARD_SLASH + fileName + Constants.FORWARD_SLASH + fileName + Constants.JAVA_EXTENSION;
                String interfaceTemplate = getInterfaceHandlebarTemplate(getPackageName(modelDirctoryPath), fileName, slingModelInfo.getMultimap());
                Path interfacefile = Paths.get(interfacefileDirctory);
                LOG.debug("Interface File name {} , created at {}, package location {}", interfacefile.getFileName(), classfileDirctory, getPackageName(modelDirctoryPath));
                writeToFile(interfacefile, interfaceTemplate);

                String packageInfoDirctory = folderPath + Constants.FORWARD_SLASH + fileName + Constants.FORWARD_SLASH + "package-info" + Constants.JAVA_EXTENSION;
                String packageInfoTemplate = getPackageInfoHandlebarTemplate(getPackageName(modelDirctoryPath), fileName, slingModelInfo.getMultimap());
                Path packageInfofile = Paths.get(packageInfoDirctory);
                LOG.debug("Package-info File name {} , created at {}, package location {}", packageInfofile.getFileName(), packageInfoDirctory, getPackageName(modelDirctoryPath));

                writeToFile(packageInfofile, packageInfoTemplate);


            } catch (Exception e) {
                LOG.error("Error: ", e);
            }
        }

    }

    /**
     * @param packageName
     * @param slingModelFileName
     * @param propertyMap
     * @return
     */
    private String getInterfaceHandlebarTemplate(String packageName, String slingModelFileName, Multimap propertyMap) {
        try (ResourceResolver resourceResolver = getServiceResourceResolver()) {

            Resource slingModelresource = resourceResolver.getResource(Constants.SLING_MODEL_INTERFACE_HANDLEBAR_TEMPLATE_LOCATION);
            SlingModelTemplateSource interfaceTemplate = new SlingModelTemplateSource(slingModelresource, Constants.SLING_MODEL_INTERFACE_HANDLEBAR_TEMPLATE_LOCATION);
            HashMap<String, Object> scopes = new HashMap<String, Object>();
            return getSlingModelTemplateContent(scopes, propertyMap, interfaceTemplate, packageName, slingModelFileName, true);

        } catch (Exception e) {
            LOG.error("Error: ", e);
        }
        return StringUtils.EMPTY;
    }

    /**
     * @param packageName
     * @param slingModelFileName
     * @param propertyMap
     * @return
     */
    private String getPackageInfoHandlebarTemplate(String packageName, String slingModelFileName, Multimap propertyMap) {
        try (ResourceResolver resourceResolver = getServiceResourceResolver()) {

            Resource slingModelresource = resourceResolver.getResource(Constants.PACKAGE_INFO_HANDLEBAR_TEMPLATE_LOCATION);
            SlingModelTemplateSource interfaceTemplate = new SlingModelTemplateSource(slingModelresource, Constants.PACKAGE_INFO_HANDLEBAR_TEMPLATE_LOCATION);
            HashMap<String, Object> scopes = new HashMap<String, Object>();
            return getSlingModelTemplateContent(scopes, propertyMap, interfaceTemplate, packageName, slingModelFileName, true);

        } catch (Exception e) {
            LOG.error("Error: ", e);
        }
        return StringUtils.EMPTY;
    }

    private String getSlingModelTemplateContent(HashMap<String, Object> scopes, Multimap propertyMap, SlingModelTemplateSource slingModelTemplateSource, String packageName, String slingModelFileName, boolean isInterfaceModel) throws IOException {
        scopes.put("packagename", packageName.toLowerCase());
        scopes.put("interfaceName", slingModelFileName);
        return getTemplateContent(scopes, propertyMap, slingModelTemplateSource, isInterfaceModel);
    }

    /**
     * @param scopes
     * @param propertyMap
     * @param slingModelTemplateSource
     * @param isInterfaceModel
     * @return
     * @throws IOException
     */
    private String getTemplateContent(HashMap<String, Object> scopes, Multimap propertyMap, SlingModelTemplateSource slingModelTemplateSource, boolean isInterfaceModel) throws IOException {
        Handlebars handlebars = new Handlebars();
        Template template = handlebars.compile(slingModelTemplateSource);

        Set<String> keys = propertyMap.keySet();
        List<String> propertyLists = new ArrayList<String>();
        List<String> checkboxLists = new ArrayList<String>();
        List<String> multiValueLists = new ArrayList<String>();
        List<String> multiFieldItemLists = new ArrayList<String>();
        for (String key : keys) {
            Collection<String> values = propertyMap.get(key);
            for (String value : values) {
                if (RT_PROPERTY.contains(value)) {
                    addPropertiesToList(key, propertyLists, isInterfaceModel, false);
                    scopes.put("isReturnTypeString", true);
                    scopes.put("propertyLists", propertyLists);
                } else if (value.equals(Constants.RT_MULTIFIELD)) {
                    addPropertiesToList(key, multiValueLists, isInterfaceModel, true);
                    scopes.put("isMultiFieldMap", true);
                    scopes.put("multiValueLists", multiValueLists);
                 } else if (value.equals(Constants.RT_CHECKBOX)) {
                    addPropertiesToList(key, checkboxLists, isInterfaceModel, false);
                    scopes.put("isReturnTypeBoolean", true);
                    scopes.put("checkboxLists", checkboxLists);
                }
            }
        }
        return template.apply(scopes);
    }

    private void addPropertiesToList(String key, List<String> lists, boolean isInterfaceModel, boolean isMultifield) {
        if (isInterfaceModel && !isMultifield) {
            String propName = key.indexOf("./") == 0 ? key.substring(2) : key;
            propName = propName.substring(0, 1).toUpperCase() + propName.substring(1);
            lists.add(propName);
        } else {
            lists.add(key.indexOf("./") == 0 ? key.substring(2) : key);
        }
    }

    /**
     * @param packageName
     * @param slingModelFileName
     * @param resourceType
     * @param propertyMap
     * @return
     */
    private String getHandlebarTemplate(String packageName, String slingModelFileName, String resourceType, Multimap propertyMap) {
        try (ResourceResolver resourceResolver = getServiceResourceResolver()) {

            Resource slingModelresource = resourceResolver.getResource(Constants.SLING_MODEL_HANDLEBAR_TEMPLATE_LOCATION);
            SlingModelTemplateSource javaTemplate = new SlingModelTemplateSource(slingModelresource, Constants.SLING_MODEL_HANDLEBAR_TEMPLATE_LOCATION);
            HashMap<String, Object> scopes = new HashMap<String, Object>();
            resourceType = resourceType.startsWith("/apps") ? StringUtils.substringAfter(resourceType, "/apps/") : resourceType;
            scopes.put("resourceType", resourceType);
            scopes.put("className", slingModelFileName + "Impl");

            return getSlingModelTemplateContent(scopes, propertyMap, javaTemplate, packageName, slingModelFileName, false);
        } catch (Exception e) {
            LOG.error("Error: ", e);
        }
        return StringUtils.EMPTY;
    }

    private ResourceResolver getServiceResourceResolver() {
        BundleContext bundleContext = FrameworkUtil.getBundle(Utils.class).getBundleContext();
        ResourceResolverFactory resourceResolverFactory = getService(bundleContext, ResourceResolverFactory.class);
        try {
            return resourceResolverFactory.getServiceResourceResolver(AUTH_INFO);
        } catch (LoginException ex) {
            LOG.error("Failed to get resource resolver" + ex.getMessage());
        }
        return null;
    }

    /**
     *
     * @param reactModelInfo
     */
    public void createReactComponent(ReactModel reactModelInfo) {
        String componentContentXml = reactModelInfo.getUiAppsDirectory() + Constants.FORWARD_SLASH + Constants.CONTENT_XML_NAME;
        boolean isContainerComponent = isContainerComponent(componentContentXml);

        File rootDir = new File(reactModelInfo.getModulePath());
        String folderPath = findDirectoriesWithSameName("component", rootDir);
        if (StringUtils.isNotBlank(folderPath)) {
            String fileDirctory = folderPath + Constants.FORWARD_SLASH + reactModelInfo.getModelName() + Constants.JS_EXTENSION;
            Path file = Paths.get(fileDirctory);
            LOG.debug("File name {} , created at {}", file.getFileName(), fileDirctory);
            writeToFile(file, getReactHandlebarTemplate(reactModelInfo.getModelName(),reactModelInfo.getMultimap(),isContainerComponent, reactModelInfo.getResourceType()));
        }

    }

    /**
     * @param slingModelFileName
     * @param propertyMap
     * @return
     */
    private String getReactHandlebarTemplate( String slingModelFileName, Multimap propertyMap, boolean isContainerComponent, String resourceType) {
        try (ResourceResolver resourceResolver = getServiceResourceResolver()) {
            HashMap<String, Object> scopes = new HashMap<String, Object>();
            String reactHandleBarTemplatePath = StringUtils.EMPTY;
            if(isContainerComponent){
                reactHandleBarTemplatePath = Constants.REACT_CONTAINER_HANDLEBAR_TEMPLATE_LOCATION;
                scopes.put("isContainer",true);
                scopes.put("inheritedComponent","ResponsiveGrid");
            }else{
                scopes.put("isNonContainer",true);
                scopes.put("inheritedComponent","Component");
                reactHandleBarTemplatePath = Constants.REACT_SIMPLE_HANDLEBAR_TEMPLATE_LOCATION;
            }
            scopes.put("resourceType",resourceType.startsWith("/apps/")? StringUtils.substringAfter(resourceType, "/apps/") : resourceType);
            scopes.put("className",slingModelFileName);

            Resource slingModelresource = resourceResolver.getResource(reactHandleBarTemplatePath);
            LOG.debug("slingModelresource : "+slingModelresource.getPath());

            SlingModelTemplateSource reactTemplateResource = new SlingModelTemplateSource(slingModelresource, reactHandleBarTemplatePath);

            return getTemplateContent(scopes, propertyMap, reactTemplateResource, false);

        } catch (Exception e) {
            LOG.error("Error: ", e);
        }
        return StringUtils.EMPTY;
    }

    /**
     * @param name
     * @param rootDir
     * @return
     */
    private String findDirectoriesWithSameName(String name, File rootDir) {
        for (File file : rootDir.listFiles()) {
            if (file.isDirectory() && !file.getPath().contains("node_modules") && !file.getPath().contains("test") && !file.getPath().contains("target")) {
                if (file.getName().equals(name) || file.getName().equals(name + "s")) {
                    return file.getPath();
                }
                String found = findDirectoriesWithSameName(name, file);
                if (StringUtils.isNotEmpty(found)) {
                    return found;
                }
            }
        }
        return StringUtils.EMPTY;
    }


    public void updateHtl(HTLModel htlModelInfo) {
        String componentContentXml = htlModelInfo.getModulePath() + Constants.FORWARD_SLASH + Constants.CONTENT_XML_NAME;
        boolean isContainerComponent = isContainerComponent(componentContentXml);

        String folderPath = getCoreModelPath(htlModelInfo.getCoreModulePath());
        String modelDirctoryPath = folderPath + Constants.FORWARD_SLASH + htlModelInfo.getModelName();
        String modelLocaltion = getPackageName(modelDirctoryPath).toLowerCase() + Constants.DOT + htlModelInfo.getModelName();
        String htlTemplate = getHTLHandlerBarTemplate(modelLocaltion, isContainerComponent, htlModelInfo.getMultimap(), htlModelInfo.getmultifieldItemList());
        String slightlyScriptName = StringUtils.substringAfterLast(htlModelInfo.getModulePath(), Constants.FORWARD_SLASH);
        Path htlfile = Paths.get(htlModelInfo.getModulePath() + Constants.FORWARD_SLASH + slightlyScriptName + Constants.HTML_EXTENSION);
        LOG.debug("HTL File name {} , Updated at {}, package location {}", htlfile.getFileName(), modelDirctoryPath, modelLocaltion);
        writeToFile(htlfile, htlTemplate);
    }

    /**
     *
     * @param modelLocation
     * @param isContainerComponent
     * @param propertyMap
     * @return
     */
    private String getHTLHandlerBarTemplate(String modelLocation, boolean isContainerComponent, Multimap propertyMap, List<String> multifieldItemList) {
        try (ResourceResolver resourceResolver = getServiceResourceResolver()) {

            Resource slingModelresource = resourceResolver.getResource(Constants.HTL_HANDLEBAR_TEMPLATE_LOCATION);
            SlingModelTemplateSource htlTemplate = new SlingModelTemplateSource(slingModelresource, Constants.HTL_HANDLEBAR_TEMPLATE_LOCATION);
            HashMap<String, Object> scopes = new HashMap<String, Object>();
            scopes.put("modelLocation", modelLocation);
            scopes.put("isContainer", isContainerComponent);
            scopes.put("multiFieldItemLists", multifieldItemList);

            return getTemplateContent(scopes, propertyMap, htlTemplate, false);
        } catch (Exception e) {
            LOG.error("Error: ", e);
        }
        return StringUtils.EMPTY;
    }

    /**
     *
     * @param coreModelDirPath
     * @return
     */
    private String getCoreModelPath(String coreModelDirPath) {
        File rootDir = new File(coreModelDirPath);
        String folderPath = findDirectoriesWithSameName("model", rootDir);
        return StringUtils.isEmpty(folderPath) ? rootDir.getPath() : folderPath;

    }

    private static String whichOS(){
        return System.getProperty("os.name").toLowerCase();
    }

}
