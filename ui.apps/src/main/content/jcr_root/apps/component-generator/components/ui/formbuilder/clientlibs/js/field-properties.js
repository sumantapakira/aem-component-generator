/*  Copyright 2020 Sumanta Pakira
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *.
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
(function(window, document, Granite, $, History) {
    "use strict";

    $(document).on("change", ".field-label-descriptor", function(event) {

        var field = $(".form-fields").find(".ui-selected");
        var itemid = field.data("id");
        var BASE = "items/tabs/items/";
        var TAB_BASE_URI = "./cq:dialog/content/" + BASE;
        var value = this.value;
        var tabs = $("nav", "#tabs-navigation").find("a:not(#formbuilder-add-tab)");

        var mappedpropname = $(".propmap-"+itemid).val();
        if(mappedpropname.indexOf("./") === 0){
			mappedpropname = mappedpropname.substring(2);
        }

         $.each(tabs, function(tabindex, tab) {
        		if($(tab).attr('tabindex') === '0'){
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/fieldLabel", value));

                }
		});

   });

    $(document).on("change", ".field-required-checkbox", function(event) {
        var field = $(".form-fields").find(".ui-selected");
        var itemid = field.data("id");
        var BASE = "items/tabs/items/";
        var TAB_BASE_URI = "./cq:dialog/content/" + BASE;
        var value = $(event.target).attr("checked");
        value = value ? "true" : "false";
        var tabs = $("nav", "#tabs-navigation").find("a:not(#formbuilder-add-tab)");

        var mappedpropname = $(".propmap-"+itemid).val();
        if(mappedpropname.indexOf("./") === 0){
			mappedpropname = mappedpropname.substring(2);
        }

         $.each(tabs, function(tabindex, tab) {
        		if($(tab).attr('tabindex') === '0'){
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/required", value));

                }
		});

   });

    $(document).on("change", ".radio-choice-json", function(event) {
		 var field = $(".form-fields").find(".ui-selected");
        var itemid = field.data("id");
        var datasourceField = $(".datasource-radio-propmap-"+itemid).is(':checked');
        if(datasourceField){
          $(".datasource-textinput-propmap-"+itemid).prop('disabled', false);
        }

    });
    $(document).on("change", ".radio-choice-manual", function(event) {
		 var field = $(".form-fields").find(".ui-selected");
        var itemid = field.data("id");
        var datasourceField = $(".datasource-radio-propmap-"+itemid).is(':checked');
        if(!datasourceField){
          $(".datasource-textinput-propmap-"+itemid).prop('disabled', true);
        }

    });

     $(document).on("change", ".add-from-json-field", function(event) {
        var field = $(".form-fields").find(".ui-selected");
        var itemid = field.data("id");
        var BASE = "items/tabs/items/";
        var TAB_BASE_URI = "./cq:dialog/content/" + BASE;
        var value = this.value;
        var tabs = $("nav", "#tabs-navigation").find("a:not(#formbuilder-add-tab)");

        var mappedpropname = $(".propmap-"+itemid).val();
        if(mappedpropname.indexOf("./") !== 0){
         	mappedpropname = mappedpropname.substring(2);
            }

        var datasourceField = $(".datasource-radio-propmap-"+itemid).is(':checked');
         var resourceType;
        if(datasourceField){
			resourceType = $(".datasource-textinput-propmap-"+itemid).val();
        }


         if(datasourceField){
         $.each(tabs, function(tabindex, tab) {
        		if($(tab).attr('tabindex') === '0'){
					$("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/datasource/"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/datasource/jcr:primaryType","nt:unstructured"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/datasource/sling:resourceType",resourceType));
                }
		});
     }

   });

     $(document).on("change", ".pathfield-content-root-descriptor", function(event) {

        var field = $(".form-fields").find(".ui-selected");
        var itemid = field.data("id");
        var BASE = "items/tabs/items/";
        var TAB_BASE_URI = "./cq:dialog/content/" + BASE;
        var value = this.value;
        var tabs = $("nav", "#tabs-navigation").find("a:not(#formbuilder-add-tab)");

        var mappedpropname = $(".rootfieldmap-"+itemid).val();
        if(mappedpropname.indexOf("./") !== 0){
			mappedpropname = mappedpropname.substring(2);
        }

         $.each(tabs, function(tabindex, tab) {
        		if($(tab).attr('tabindex') === '0'){
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/rootPath", value));
                }
		});

   });

    $(document).on("change", ".field-mvtext-descriptor", function() {
        var activeProperties = $("section.active", ".editor-right");
        var field = $(".form-fields").find(".ui-selected");
        var resourceType;

        var val = $(this).val();


        if(parseInt(field.children(".textfield").length)>0){
            resourceType = "granite/ui/components/coral/foundation/form/textfield";
        }else if( parseInt(field.children(".pathfield").length)>0 ){
      		resourceType = "granite/ui/components/coral/foundation/form/pathfield";
        }else if(parseInt(field.children(".dropdownfield").length)>0 ){
			resourceType = "granite/ui/components/coral/foundation/form/select";
        }else if(parseInt(field.children(".multifield").length)>0 ){
			resourceType = "granite/ui/components/coral/foundation/form/multifield";
        }else if(parseInt(field.children(".imagefield").length)>0 ){
			resourceType = "cq/gui/components/authoring/dialog/fileupload";
        }else if(parseInt(field.children(".richtextfield").length)>0 ){
			resourceType = "cq/gui/components/authoring/dialog/richtext";
        }

        var itemid = field.data("id");
        var name = "./items/" + itemid + "/name";
        var inputname = $("input[name=\"" + name + "\"]", activeProperties);
        if (val.indexOf("./") !== 0) {
            if (val.indexOf("/") !== 0) {
                $(this).val("./" + val);
            } else {
                $(this).val("." + val);
            }
            if (val.indexOf(".") === 0) {
                $(this).val("./" + val.substring(1));
            }
        }


       var tabs = $("nav", "#tabs-navigation").find("a:not(#formbuilder-add-tab)");
         $.each(tabs, function(tabindex, tab) {
              var BASE = "items/tabs/items/";
              var TAB_BASE_URI = "./cq:dialog/content/" + BASE;
             if($(tab).attr('tabindex') === '0'){
              	var propertynodename = val.substring((val.lastIndexOf("/") + 1));

                 $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/"));
                 $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/jcr:primaryType", "nt:unstructured"));
                 if(parseInt(field.children(".imagefield").length)>0 ){
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/name", val + "/file"));
                 }else{
					$("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/name", val, "propnameclass"));
                 }
                 $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/sling:resourceType", resourceType));

                 $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/granite:data/"));
				 $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/granite:data/jcr:primaryType", "nt:unstructured"));
                 $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/granite:data/cq-msm-lockable", propertynodename));

                 if(parseInt(field.children(".multifield").length)>0 ){
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/composite", true));
				   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/"));
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/jcr:primaryType","nt:unstructured"));
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/sling:resourceType","granite/ui/components/coral/foundation/container"));
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/name",val));
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/items/"));
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/items/jcr:primaryType","nt:unstructured"));
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/items/column/"));
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/items/column/jcr:primaryType","nt:unstructured"));
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/items/column/sling:resourceType","granite/ui/components/coral/foundation/container"));
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/items/column/items/"));
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/items/column/items/jcr:primaryType","nt:unstructured"));
                 }
                 if(parseInt(field.children(".imagefield").length)>0 ){
                     $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/allowUpload", true));
                     $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/autoStart", true));
                     $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/class", "cq-droptarget"));
                     $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/mimeTypes", "image/gif"));
                     $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/mimeTypes", "image/jpeg"));
                     $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/mimeTypes", "image/png"));
                     $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/mimeTypes", "image/webp"));
                     $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/mimeTypes", "image/tiff"));
                     $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/multiple", false));
                     $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/useHTML5", true));
                     $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/cropParameter", val +"/imageCrop"));
                     $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/fileNameParameter", val +"/fileName"));
                     $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/fileReferenceParameter", val +"/fileReference"));
					 $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/sizeLimit", 100));
                 }
                 if(parseInt(field.children(".dropdownfield").length)>0 && $(".manual-radio-propmap-"+itemid).is(':checked')){
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/items/"));
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/items/jcr:primaryType","nt:unstructured"));
				  }
                 if(parseInt(field.children(".richtextfield").length)>0 ){
					$("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/useFixedInlineToolbar", true));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/jcr:primaryType", "nt:unstructured"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/format"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/format/jcr:primaryType","nt:unstructured"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/format/features","bold,italic"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/links"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/links/jcr:primaryType","nt:unstructured"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/links/features","modifylink,unlink"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/lists"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/lists/jcr:primaryType","nt:unstructured"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/lists/features","*"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/jcr:primaryType","nt:unstructured"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/features","*"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/jcr:primaryType","nt:unstructured"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_p"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_p/jcr:primaryType","nt:unstructured"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_p/description","Paragraph"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_p/tag","p"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h1"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h1/jcr:primaryType","nt:unstructured"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h1/description","Heading 1"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h1/tag","h1"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h2"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h2/jcr:primaryType","nt:unstructured"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h2/description","Heading 2"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h2/tag","h2"));

                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h3"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h3/jcr:primaryType","nt:unstructured"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h3/description","Heading 3"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h3/tag","h3"));

                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h4"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h4/jcr:primaryType","nt:unstructured"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h4/description","Heading 4"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h4/tag","h4"));

                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h5"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h5/jcr:primaryType","nt:unstructured"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h5/description","Heading 5"));
                    $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h5/tag","h5"));
                }
             }else{
				console.log("not found active tab");
             }
         });

        if (inputname.length > 0) {
            console.log("Field value: 1111 ");
            inputname.attr("value", val);
        }
    });



     function _createHiddenTag(name, value, cssClass) {
         var input;
        if (value !== undefined) {
		    input = $("<input/>").attr({
                "type": "hidden",
                "name": name,
                "class": cssClass,
                "value": value
            });
        }else{

        input= $("<input/>").attr({
            "type": "hidden",
            "name": name
        });
        }
          return input;

    }



})(window, document, Granite, Granite.$, History);
