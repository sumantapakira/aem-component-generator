package com.aem.component.generator.core.tools;

import com.day.cq.commons.jcr.JcrUtil;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import org.apache.commons.lang.StringUtils;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.util.Text;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.*;



@Component(service = Servlet.class, property = {"sling.servlet.methods=" + HttpConstants.METHOD_GET,
        "sling.servlet.paths=" + "/bin/zeiss/servlets/createpage", "sling.servlet.extensions=html" })
public class CreatePages extends SlingAllMethodsServlet {

    private static final Logger LOG = LoggerFactory.getLogger(CreatePages.class);

    public static final String COPY_FROM = "copyfrom";

    public static final String NODE_COUNT = "nodecount";

    public static final String ROOT_PATH = "rootpath";

    public static final String TEMPLATE_TYPE = "templatetype";

    @Reference
    private ResourceResolverFactory resolverFactory;

    /**
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void doGet(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws ServletException, IOException {
        try {
            final Session session = request.getResourceResolver().adaptTo(Session.class);
            final Resource fromPage = request.getResourceResolver().getResource(request.getParameter(COPY_FROM));

            PageManager pgMgr = request.getResourceResolver().adaptTo(PageManager.class);
            Page page = pgMgr.getPage(request.getParameter(COPY_FROM));

            int depthCount = Integer.parseInt(request.getParameter(NODE_COUNT));
            String copyFromPath = request.getParameter(COPY_FROM) + "/" + JcrConstants.JCR_CONTENT;

            BlockingQueue<List<String>> blockingQueue = new LinkedBlockingDeque<>(4);
            ExecutorService executor = Executors.newFixedThreadPool(5);

            Runnable producerTask = () -> {
                try {
                    int value = 0;
                    List<String> createdPagePath = createPage(request.getParameter(ROOT_PATH), depthCount, request.getParameter(TEMPLATE_TYPE));
                    blockingQueue.put(createdPagePath);
                    LOG.info("Produced " + createdPagePath);
                    value++;
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    LOG.error("Error: ", e);
                }
            };

            Runnable consumerTask = () -> {
                ResourceResolver resourceResolver = null;
                try {
                    while (true) {
                        List<String> pagesCreated = blockingQueue.take();

                        resourceResolver = resolverFactory.getServiceResourceResolver(null);
                        Thread.sleep(1000);
                        Session sessionProtected = resourceResolver.adaptTo(Session.class);
                        sessionProtected.refresh(true);
                        for (String pagePath : pagesCreated) {
                            LOG.info("Consume " + pagePath);
                            copyContent(sessionProtected, pagePath, copyFromPath);

                        }
                    }
                } catch (Exception e) {
                    LOG.error("Error: ", e);
                } finally {
                    if (resourceResolver != null && resourceResolver.isLive()) {
                        resourceResolver.close();
                    }
                }
            };
            executor.execute(producerTask);
            executor.execute(consumerTask);
            executor.shutdown();

            response.setContentType("text/html");
            PrintWriter writer = response.getWriter();
            writer.println("Pages are created successfully....");

            writer.close();

        } catch (Exception repEx) {
            LOG.error("Error copying preset", repEx);
        }
    }

    /**
     * @param name
     * @return
     */
    private String createUniqueNodeName(final String name) {
        return Text.escapeIllegalJcrChars(name + "_" + UUID.randomUUID().toString());
    }

    /**
     * @param rootPath
     * @param depthCount
     * @param templateType
     * @return
     */
    private List<String> createPage(String rootPath, int depthCount, String templateType) {
        int initialLevel = rootPath.split("/").length;
        ArrayList<String> list = new ArrayList<String>();
        return callProcessCommand(initialLevel + depthCount, rootPath, depthCount, list, templateType);
    }

    /**
     * @param allowedPageLevel
     * @param path
     * @param depthCount
     * @param list
     * @param templateType
     * @return
     */
    private List<String> callProcessCommand(int allowedPageLevel, String path, int depthCount, ArrayList<String> list, String templateType) {
        LOG.info("callProcessCommand : " + path + " , allowedPageLevel : " + allowedPageLevel);

        String currentPagePath = StringUtils.EMPTY;

        for (int count = 0; count <= depthCount; count++) {
            currentPagePath = processCommand(path, templateType);
            list.add(currentPagePath);
        }


        LOG.info("currentPagePath : " + currentPagePath);
        int currentPageLevel = currentPagePath.split("/").length;
        LOG.info("currentPageLevel : " + currentPageLevel);
        if (currentPageLevel <= allowedPageLevel) {
            callProcessCommand(allowedPageLevel, currentPagePath, depthCount, list, templateType);
        }
        return list;
    }

    /**
     * @param path
     * @param templateType
     * @return
     */
    private String processCommand(String path, String templateType) {
        String pageTitle = createUniqueNodeName("test");
        FormEntityBuilder feb = FormEntityBuilder.create().addParameter("cmd", "createPage")
                .addParameter("parentPath", path)
                .addParameter("title", pageTitle)
                .addParameter("template", templateType);
        try {
            CloseableHttpClient client = HttpClients.createDefault();

            HttpPost httpPost = new HttpPost("http://localhost:4202/bin/wcmcommand");
            httpPost.setEntity(feb.build());
            httpPost.addHeader("Authorization", "Basic YWRtaW46YWRtaW4=");

            CloseableHttpResponse responsepost = client.execute(httpPost);
            LOG.info("responsepost : " + responsepost.getStatusLine().getStatusCode());
            client.close();
        } catch (Throwable e) {
            LOG.error("Error copying preset", e);
        }
        return path + "/" + pageTitle;
    }

    /**
     * @param session
     * @param toNodePath
     * @param copyFromPath
     * @throws RepositoryException
     * @throws LoginException
     */
    private void copyContent(Session session, String toNodePath, String copyFromPath) throws RepositoryException, LoginException {
        Node fromNode = session.getNode(copyFromPath);

        Node toNode = session.getNode(toNodePath + "/" + JcrConstants.JCR_CONTENT);
        removeDefaultContent(toNode, session);
        NodeIterator itr = fromNode.getNodes();

        while (itr.hasNext()) {
            Node childNode = itr.nextNode();
            Node newNode = JcrUtil.copy(childNode, toNode, childNode.getName(), true);
        }
        session.save();
    }

    /**
     * @param aNode
     * @param session
     * @throws RepositoryException
     */
    private void removeDefaultContent(Node aNode, Session session) throws RepositoryException {
        LOG.info("aNode item: " + aNode.getPath());
        NodeIterator itr = aNode.getNodes();
        while (itr.hasNext()) {
            Node nodeTobeRemoved = itr.nextNode();
            LOG.info("nodeTobeRemoved item: " + nodeTobeRemoved.getPath());
            session.removeItem(nodeTobeRemoved.getPath());
        }
    }
}
