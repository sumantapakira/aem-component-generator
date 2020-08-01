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
