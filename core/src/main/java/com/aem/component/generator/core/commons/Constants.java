package com.aem.component.generator.core.commons;

public class Constants {
    public static final String DEFAULT_LOCAL_ADMIN_USER_NAME = "admin";
    public static final String DEFAULT_LOCAL_ADMIN_USER_PASSWORD = "admin";
    public static final String FORWARD_SLASH = "/";
    public static final String VAR_SETTING_NODE = "/var/component-generator/settings";
    public static final String DOT = ".";
    public static final String COLON = ":";
    public static final String HTML_EXTENSION = ".html";
    public static final String JAVA_EXTENSION = ".java";
    public static final String JS_EXTENSION = ".js";
    public static final String CONTENT_XML_NAME = ".content.xml";
    public static final String DASH_REGEX= "-(?![\\[\\{\\(])";
    public static final String HTL_TEMPLATE= "<div data-sly-test=\"${wcmmode.edit}\">Configure ${component.properties.jcr:title}</div>";
    public static final String SLING_TEMPLATE= "package %s ; \n\n public class %s { \n\n " +
            "String var=\" Hello World, Coming Soon\";\n\n}";
    public static final String REACT_TEMPLATE= "Coming soon...";
}
