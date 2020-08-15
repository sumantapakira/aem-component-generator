package com.aem.component.generator.core.models;

import com.drew.lang.annotations.NotNull;
import com.google.common.collect.Multimap;

public class SlingModel extends AbstructModel{
    String modelName;
    public SlingModel(Multimap map, String fileType, String modulePath, String componentPath, String modelName) {
        super(map, fileType, modulePath, componentPath);
        this.modelName = modelName;
    }

    @NotNull
    public String getModelName(){ return this.modelName;}


}
