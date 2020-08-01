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

import com.aem.component.generator.core.servlets.CreateComponentDialogServlet;
import com.drew.lang.annotations.NotNull;
import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.jcr.resource.api.JcrResourceConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Utils {
    private static final Logger LOG = LoggerFactory.getLogger(CreateComponentDialogServlet.class);

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
     * @param directory
     * @param fileName
     */
    public static void createSlingModelClass(@NotNull String directory, @NotNull String fileName) {
        String folderPath = getBaseDirectoryPath(directory, "model");
        if (StringUtils.isNotBlank(folderPath)) {
            fileName = fileName.replaceAll("-","");
            fileName = fileName.replaceAll("_","");
            String fileDirctory = folderPath + Constants.FORWARD_SLASH + fileName + Constants.JAVA_EXTENSION;
            Path file = Paths.get(fileDirctory);
            LOG.debug("File name {} , created at {}, package location {}", file.getFileName(), fileDirctory, getPackageName(folderPath));
            writeToFile(file, String.format(Constants.SLING_TEMPLATE,getPackageName(folderPath), fileName));
        }

    }

    private static String getPackageName(String folderPath){
        return StringUtils.substringAfter(folderPath,"main/java/").replaceAll(Constants.FORWARD_SLASH,Constants.DOT);
    }

    /**
     * @param directory
     * @param fileName
     */
    public static void createReactComponent(@NotNull String directory, @NotNull String fileName) {
        String folderPath = getBaseDirectoryPath(directory,"component");
        if (StringUtils.isNotBlank(folderPath)) {
            String fileDirctory = folderPath + Constants.FORWARD_SLASH + fileName + Constants.JS_EXTENSION;
            Path file = Paths.get(fileDirctory);
            LOG.debug("File name {} , created at {}", file.getFileName(), fileDirctory);
            writeToFile(file, Constants.REACT_TEMPLATE);
        }

    }

    /**
     * @param directory
     * @return
     */
    private static String getBaseDirectoryPath(String directory, String folderName) {
        try (Stream<Path> walk = Files.walk(Paths.get(directory))) {
            return walk.map(x -> x.toString())
                    .filter(f -> (f.endsWith(folderName) || f.endsWith(folderName +"s")) && !f.contains("node_modules") && !f.contains("test") && !f.contains("target")).collect(Collectors.joining());
        } catch (Exception e) {
            LOG.error("Error: ", e);
        }
        return StringUtils.EMPTY;
    }

}
