# AEM Component Generator

 *  This is a project to help others developers like me who spends time to generate components and dialogs and creating Sling model or React components.
 *  This project also helps requirement analyst who does not have knowledge about AEM component development but still can create AEM Dialog by Drag and Drop for developers to start implementating on actual logic
 *  This project also helps Frontend developers who does not have knowledge about AEM backend component, now they can create Dialog and start implemting Frontend logic whithout waiting for Backend developers dependency.
 
Demo Part-1 : https://youtu.be/PecIIKGGLpQ 
Demo part-2 : https://youtu.be/26eIVbmyTWU
 

## Work in progress

* Design dialog creation

## Get Started

Please follow [settings](https://github.com/sumantapakira/aem-component-generator/blob/master/settings.md) and [How to configure](https://github.com/sumantapakira/aem-component-generator/blob/master/development.md) file to get started.



## How to build

To build all the modules run in the project root directory the following command with Maven 3:

    mvn clean install

If you have a running AEM instance you can build and package the whole project and deploy into AEM with

    mvn clean install -PautoInstallPackage

Or to deploy it to a publish instance, run

    mvn clean install -PautoInstallPackagePublish

Or alternatively

    mvn clean install -PautoInstallPackage -Daem.port=4503

Or to deploy only the bundle to the author, run

    mvn clean install -PautoInstallBundle



## Maven settings

The project comes with the auto-public repository configured. To setup the repository in your Maven settings, refer to:

    http://helpx.adobe.com/experience-manager/kb/SetUpTheAdobeMavenRepository.html
