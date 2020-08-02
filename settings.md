Please follow the below steps to configure your local code base location. This is required so that this tool can create all the files related to your component in your local code base directory:

* UI Module: This is the directory in your local code base where you would like this tool to generate component HTL and .content.xml file. Please give the path upto /jcr_root. Example "C://<AEM-Project>/name-of-your-aem-project/your-ui-apps-directory/src/main/content/jcr_root" (Windows) or "/Users/<your-name>/<AEM-Project>/name-of-your-aem-project/your-ui-apps-directory/src/main/content/jcr_root" (Mac)
  
* Core Module: This is the directory in your local code base where you would like this tool to generate Java Sling model file. Please give the path upto the place before the start of 'src' folder. The same level where your pom.xml exists. As this tool follows Adobe Archtype structure, and as per this Archtype all the Sling model class goes under a package called "models" or "model", so please make sure you have this folder created anywhere under the "<your-code-base>/src/main/java/". The possibilities to configuration your own deginated directory will be given in next release. 
  
* React module: This is the directory in your local code base where you would like this tool to generate component React componet file. It should be the place same as your pom.xml file of UI frontend module. Example: "<your-code-base>/your-front-end-module" ideally "C://AEM-Project/name-of-your-aem-project/your-front-end-module" (Windows) or "/Users/<your-name>/AEM-Project/name-of-your-aem-project/your-front-end-module" (Mac)
  
* If you have installed this on your local AEM server which does not use default password then change this here: https://github.com/sumantapakira/aem-component-generator/blob/master/core/src/main/java/com/aem/component/generator/core/commons/Constants.java#L20-L21   

