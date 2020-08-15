package com.aem.component.generator.core.models;

import com.drew.lang.annotations.NotNull;
import com.google.common.collect.Multimap;

public abstract class AbstructModel {
    Multimap map;
    String fileType;
    String modulePath;
    String resourceType;

    public AbstructModel(Multimap map, String fileType, String modulePath, String resourceType ) {
        this.map = map;
        this.fileType = fileType;
        this.modulePath = modulePath;
        this.resourceType = resourceType;
    }

    @NotNull
    public  Multimap getMultimap(){return this.map;};
    @NotNull
    public  String getFileType(){return this.fileType;}
    @NotNull
    public  String getModulePath(){return this.modulePath;}
    @NotNull
    public  String getResourceType(){return this.resourceType;}
}
