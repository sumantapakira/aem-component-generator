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
