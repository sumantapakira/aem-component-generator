Please make sure you have added the below dependencies in your own project pom.xml file:-

1. This is required for checking null annotation


           <dependency>
              <groupId>org.jetbrains</groupId>
              <artifactId>annotations</artifactId>
              <version>Latest-version</version>
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
