package com.aem.component.generator.core.models;

import com.drew.lang.annotations.NotNull;
import com.google.common.collect.Multimap;

public class ReactModel extends AbstructModel{
    String modelName;
    String uiAppsDirectory;
    public ReactModel(Multimap map, String fileType, String modulePath, String resourceType,String modelName, String uiAppsDirectory ) {
        super(map, fileType, modulePath, resourceType);
        this.modelName = modelName;
        this.uiAppsDirectory = uiAppsDirectory;
    }
    @NotNull
    public String getModelName(){ return this.modelName;}

    @NotNull
    public String getUiAppsDirectory(){ return this.uiAppsDirectory;}
}
