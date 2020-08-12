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
package com.aem.component.generator.core.handlerbar;

import com.github.jknack.handlebars.io.AbstractTemplateSource;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.Charset;
import java.util.Date;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SlingModelTemplateSource extends AbstractTemplateSource {
    private static final Logger LOG = LoggerFactory.getLogger(SlingModelTemplateSource.class);

    private final Resource resource;

    private final String location;

    private final long lastModified;

    /**
     *
     * @param resource
     * @param location
     */
    public SlingModelTemplateSource(Resource resource, String location) {
        this.resource = resource;
        this.location = location;
        Date date;
        ValueMap vm = (ValueMap)resource.adaptTo(ValueMap.class);
        if (vm.containsKey("jcr:content/jcr:lastModified")) {
            date = (Date)vm.get("jcr:content/jcr:lastModified", Date.class);
        } else {
            date = (Date)vm.get("jcr:content/jcr:created", Date.class);
        }
        if (date == null) {
            this.lastModified = 0L;
        } else {
            this.lastModified = date.getTime();
        }

    }



    public Reader reader() throws IOException {
        InputStream is = (InputStream)this.resource.adaptTo(InputStream.class);
        return new InputStreamReader(is, "UTF-8");
    }

    @Override
    public String content(Charset arg0) throws IOException {
        Reader reader = null;
        int bufferSize = 1024;
        try {
            reader = reader();
            char[] cbuf = new char[1024];
            StringBuilder sb = new StringBuilder();
            int len;
            while ((len = reader.read(cbuf, 0, 1024)) != -1)
                sb.append(cbuf, 0, len);
            return sb.toString();
        } finally {
            if (reader != null)
                reader.close();
        }

    }

    @Override
    public String filename() { return this.location; }

    @Override
    public long lastModified() { return this.lastModified; }
}
