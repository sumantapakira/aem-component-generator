Please make sure you have added the below dependencies in your own project pom.xml file:-

1. This is required for checking null annotation


           <dependency>
              <groupId>org.jetbrains</groupId>
              <artifactId>annotations</artifactId>
              <version>16.0.1</version>
              <scope>provided</scope>
           </dependency> 

2. Add this repository to your build file m2/settings.xml

         <repository>
              <id>jitpack.io</id>
              <url>https://jitpack.io</url>
         </repository>

3. This is required for reading multifield value without hardcoding the name of each multifield item name. Add this to your pom.xml file

            <dependency>
                <groupId>com.github.sumantapakira.aem-multifield</groupId>
                <artifactId>multifield.core</artifactId>
                <version>master-dbc43663b0-1</version>
            </dependency>

4. Add it as embed dependency in your core module pom.xml file.

If you are usinf maven-build-plugin then add it as follows:

         <Embed-Dependency>
           multifield.core
         </Embed-Dependency>
 
If you are using bnd-maven-plugin then add it as follows:

         <configuration>
         <bnd><![CDATA[
            Import-Package: javax.annotation;version=0.0.0,*
                                ]]>
            -includeresource: tui-multifield.jar=multifield.core-master-dbc43663b0-1.jar;lib:=true
         </bnd>
         </configuration>
         
         
 5. Add this below dependency:
 
           <dependency>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>1.18.2</version>
                <scope>compile</scope>
            </dependency>
            
 6. Add this project as embed package in your own project for additional feature like place holder text and Multifield implementation
 
 In your pom.xml file first add this
 
                      <embedded>
                            <groupId>com.github.sumantapakira.aem-component-generator</groupId>
                            <artifactId>component-generator.ui.apps</artifactId>
                            <type>zip</type>
                            <target>/apps/<your-project>/install</target>
                        </embedded>
                        <embedded>
                            <groupId>com.github.sumantapakira.aem-component-generator</groupId>
                            <artifactId>component-generator.ui.content</artifactId>
                            <type>zip</type>
                            <target>/apps/<your-project>/install</target>
                        </embedded>
                        
 And then add the dependencies:
 
         <dependency>
            <groupId>com.github.sumantapakira.aem-component-generator</groupId>
            <artifactId>component-generator.ui.apps</artifactId>
            <version>master-3670265f2a-1</version>
            <type>zip</type>
        </dependency>
        <dependency>
            <groupId>com.github.sumantapakira.aem-component-generator</groupId>
            <artifactId>component-generator.ui.content</artifactId>
            <version>master-3670265f2a-1</version>
            <type>zip</type>
        </dependency>
        
7. This is a temporary solution, please install this [JAR](https://repo1.maven.org/maven2/com/github/jknack/handlebars/4.2.0/handlebars-4.2.0.jar) from maven repo directly in System console. https://mvnrepository.com/artifact/com.github.jknack/handlebars/4.2.0        
I will make it as part of build process soon. 


Note: Restart AEM server if you see this error in log file: 
*ERROR* [0:0:0:0:0:0:0:1 [1597653713267] GET /apps/cq/core/content/nav/tools/component-generator/component-generator/componentlist.html HTTP/1.1] org.apache.sling.engine.impl.SlingRequestProcessorImpl service: Uncaught SlingException
org.apache.sling.scripting.jsp.jasper.JasperException: Unable to compile class for JSP: 
        
