package com.aem.component.generator.core.servlets;

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

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.ValueFactory;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;

@Component(service = Servlet.class, property = {"sling.servlet.methods=" + HttpConstants.METHOD_POST,
        "sling.servlet.paths=" + "/bin/servets/savesettings", "sling.servlet.extensions=json"})

public class SaveSettingsServlet extends SlingAllMethodsServlet {
    @Override
    protected void doPost(final SlingHttpServletRequest req,
                         final SlingHttpServletResponse resp) throws ServletException, IOException {
        final Resource resource = req.getResource();
        if(StringUtils.isBlank(req.getParameter("projectpath"))){
            return;
        }

        UserManager usMgr = req.getResourceResolver().adaptTo(UserManager.class);
        try {
            resp.setContentType("application/json");
            Authorizable authorizable = usMgr.getAuthorizable(req.getResourceResolver().getUserID());
            User user = (User) authorizable;
            Session session = req.getResourceResolver().adaptTo(Session.class);
            ValueFactory valueFactory = session.getValueFactory();
            user.setProperty("component_path",valueFactory.createValue(req.getParameter("projectpath")));
            session.save();
            JSONObject json = new JSONObject();
            json.put("result", "ok");
            resp.getWriter().write(json.toString());
        } catch (RepositoryException | JSONException e) {
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
}
