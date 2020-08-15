/*
 * Copyright Sumanta Pakira
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
package com.aem.component.generator.core.commons;

import com.aem.component.generator.core.models.AbstructModel;
import com.aem.component.generator.core.models.HTLModel;
import com.aem.component.generator.core.models.ReactModel;
import com.aem.component.generator.core.models.SlingModel;
import com.google.common.collect.Multimap;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;


public class WorkerThread implements Runnable{
    private static final Logger LOG = LoggerFactory.getLogger(WorkerThread.class);
    SlingModel slingModelInfo;
    HTLModel htlModelInfo;
    ReactModel reactModelInfo;

    public WorkerThread(SlingModel slingModelInfo) {
        this.slingModelInfo = slingModelInfo;
    }

    public WorkerThread(HTLModel htlModelInfo) {
        this.htlModelInfo = htlModelInfo;
    }

    public WorkerThread(ReactModel reactModelInfo) {
        this.reactModelInfo = reactModelInfo;
    }

    @Override
    public void run() {
        LOG.debug("Thread staring...");
        Utils createModel = new Utils();
        if(slingModelInfo !=null && slingModelInfo.getFileType().endsWith("java")) {
            createModel.createSlingModelClass(slingModelInfo);
        }else if(reactModelInfo !=null && reactModelInfo.getFileType().endsWith("js")){
            createModel.createReactComponent(reactModelInfo);
        }else if(htlModelInfo !=null && htlModelInfo.getFileType().endsWith("html")){
            createModel.updateHtl(htlModelInfo);
        }
    }
}
