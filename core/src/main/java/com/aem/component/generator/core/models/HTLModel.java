package com.aem.component.generator.core.models;

import com.drew.lang.annotations.NotNull;
import com.google.common.collect.Multimap;

import java.util.List;

public class HTLModel extends AbstructModel{
    String modelName;
    String coreModulePath;
    List<String> multifieldItemList;

    public HTLModel(Multimap map, String fileType, String modulePath, String componentPath, String modelName, List<String> multifieldItemList, String coreModulePath) {
        super(map, fileType, modulePath, componentPath);
        this.modelName = modelName;
        this.multifieldItemList = multifieldItemList;
        this.coreModulePath = coreModulePath;
    }

    @NotNull
    public String getModelName(){ return this.modelName;}

    @NotNull
    public List<String> getmultifieldItemList(){ return this.multifieldItemList;}

    @NotNull
    public String getCoreModulePath(){ return this.coreModulePath;}

}
