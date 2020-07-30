package com.aem.component.generator.core.commons;

import com.google.common.collect.Multimap;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class WorkerThread implements Runnable{
    private static final Logger LOG = LoggerFactory.getLogger(WorkerThread.class);
    Multimap<String, String> propertyMap;
    String directoryPath = StringUtils.EMPTY;
    String componentName = StringUtils.EMPTY;
    String fileType = StringUtils.EMPTY;

    /**
     *
     * @param propertyMap
     * @param directoryPath
     * @param componentName
     * @param fileType
     */
    public WorkerThread(Multimap propertyMap, String directoryPath, String componentName, String fileType) {
        this.propertyMap = propertyMap;
        this.componentName = componentName;
        this.fileType = fileType;
        this.directoryPath = directoryPath;
    }

    /**
     * When an object implementing interface <code>Runnable</code> is used
     * to create a thread, starting the thread causes the object's
     * <code>run</code> method to be called in that separately executing
     * thread.
     * <p>
     * The general contract of the method <code>run</code> is that it may
     * take any action whatsoever.
     *
     * @see Thread#run()
     */
    @Override
    public void run() {
        LOG.debug("Thread staring...");
        if(StringUtils.isNotBlank(fileType) && fileType.endsWith("java")) {
            Utils.createSlingModelClass(directoryPath, componentName);
        }else if(StringUtils.isNotBlank(fileType) && fileType.endsWith("js")){
            Utils.createReactComponent(directoryPath, componentName);
        }
    }
}
