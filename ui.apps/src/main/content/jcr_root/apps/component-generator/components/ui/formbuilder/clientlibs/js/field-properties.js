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
    var DIALOG_BASE_URI = "./cq:dialog/content/items/tabs/items/";
    $(document).on("change", ".field-label-descriptor", function(event) {

        var field = $(".form-fields").find(".ui-selected");
        var itemid = field.data("id");
        var value = this.value;
        var tabs = $("nav", "#tabs-navigation").find("a:not(#formbuilder-add-tab)");

        var mappedpropname = $(".propmap-"+itemid).val();
        if(mappedpropname.indexOf("./") === 0){
			mappedpropname = mappedpropname.substring(2);
        }
         $.each(tabs, function(tabindex, tab) {
        		if($(tab).attr('tabindex') === '0'){
        		  if($(".fieldlabel-"+itemid).length > 0){
        		    $(".fieldlabel-"+itemid).attr("value",value);
        		  }else{
                    $("#tabs-navigation").append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/fieldLabel", value, "fieldlabel-"+itemid));
                   }
                }
		});
   });

    $(document).on("change", ".field-required-checkbox", function(event) {
        var field = $(".form-fields").find(".ui-selected");
        var itemid = field.data("id");
        var value = $(event.target).attr("checked");
        value = value ? "true" : "false";
        var tabs = $("nav", "#tabs-navigation").find("a:not(#formbuilder-add-tab)");
        var mappedpropname = $(".propmap-"+itemid).val();
        if(mappedpropname.indexOf("./") === 0){
			mappedpropname = mappedpropname.substring(2);
        }
         $.each(tabs, function(tabindex, tab) {
        		if($(tab).attr('tabindex') === '0'){
        		  if($(".requiredchekbox-"+itemid).length > 0){
                      $(".requiredchekbox-"+itemid).attr("value",value);
                   }else{
                      $("#tabs-navigation").append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/required", value, "requiredchekbox-"+itemid));
                  }
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
        		var datasourceContainerId;

        		  if($('#datasourcevontainerid-'+itemid).length){
                       $('#datasourcevontainerid-'+itemid).remove();
                       datasourceContainerId= $('<div/>').attr("id", "datasourcevontainerid-"+itemid);
                       addDataSourceElement(datasourceContainerId, tabindex, mappedpropname, resourceType);
                  }else{
                   datasourceContainerId= $('<div/>').attr("id", "datasourcevontainerid-"+itemid);
                   addDataSourceElement(datasourceContainerId, tabindex, mappedpropname, resourceType);
                  }
                }
		});
     }
   });

   function addDataSourceElement(datasourceContainerId, tabindex, mappedpropname, resourceType){
                    $("#tabs-navigation").append(datasourceContainerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/datasource/")));
                    $("#tabs-navigation").append(datasourceContainerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/datasource/jcr:primaryType","nt:unstructured")));
                    $("#tabs-navigation").append(datasourceContainerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/datasource/sling:resourceType",resourceType)));

   }

     $(document).on("change", ".pathfield-content-root-descriptor", function(event) {
        var field = $(".form-fields").find(".ui-selected");
        var itemid = field.data("id");
        var value = this.value;
        var tabs = $("nav", "#tabs-navigation").find("a:not(#formbuilder-add-tab)");

        var mappedpropname = $(".rootfieldmap-"+itemid).val();
        if(mappedpropname.indexOf("./") !== 0){
			mappedpropname = mappedpropname.substring(2);
        }

         $.each(tabs, function(tabindex, tab) {
        		if($(tab).attr('tabindex') === '0'){
                   $("#tabs-navigation").append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/rootPath", value));
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

       var tabs = $("nav", "#tabs-navigation").find("a:not(#formbuilder-add-tab)");
         $.each(tabs, function(tabindex, tab) {
             if($(tab).attr('tabindex') === '0'){
              	var propertynodename = val.substring((val.lastIndexOf("/") + 1));
                 var containerId;
                 var elementType;

                 if(parseInt(field.children(".imagefield").length)>0 ){
                    elementType = "imagefield";
                 }else if(parseInt(field.children(".multifield").length)>0){
                    elementType = "multifield";
                 }else if(parseInt(field.children(".dropdownfield").length)>0 && $(".manual-radio-propmap-"+itemid).is(':checked')){
                    elementType = "dropdownfield";
                 }else if(parseInt(field.children(".richtextfield").length)>0){
                    elementType = "richtextfield";
                 }

                 if($('#container-'+itemid).length){
                    $('#container-'+itemid).remove();
                 	 containerId= $('<div/>').attr("id", "container-"+itemid);
                 	 appendMandaroryElements(containerId, tabindex, propertynodename, val, resourceType,elementType);
                 	 updateOtherElements(propertynodename,tabindex,itemid);
                 }else{
                    containerId= $('<div/>').attr("id", "container-"+itemid);
                    appendMandaroryElements(containerId, tabindex, propertynodename, val, resourceType,elementType);
                 }
             }else{
				console.log("not found active tab");
             }
         });
    });


   function appendMandaroryElements(containerId, tabindex, propertynodename, val, resourceType, elementType){
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/")));
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/jcr:primaryType", "nt:unstructured")));
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/name", val, "propnameclass")));

        if(elementType==="imagefield"){
            $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/name", val + "/file")));
        }
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/granite:data/")));
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/granite:data/jcr:primaryType", "nt:unstructured")));
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/sling:resourceType", resourceType)));
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/granite:data/cq-msm-lockable", propertynodename)));

        switch(elementType){
         case "imagefield": addImageElement(containerId, tabindex, propertynodename, val);
                            break;
         case "dropdownfield": addDropDownElement(containerId, tabindex, propertynodename);
                            break;
         case "multifield": addMultiFieldElement(containerId, tabindex, propertynodename, val);
                            break;
         case "richtextfield": addRichTextElement(containerId, tabindex, propertynodename);
                            break;
        }
        /*if(elementType==="imagefield"){
         addImageElement(containerId, tabindex, propertynodename, val);
        }
        if(elementType==="dropdownfield"){
         addDropDownElement(containerId, tabindex, propertynodename);
        }
        if(elementType==="multifield"){
         addMultiFieldElement(containerId, tabindex, propertynodename, val);
        }
        if(elementType==="richtextfield"){
         addRichTextElement(containerId, tabindex, propertynodename);
        }*/
    }

    function addRichTextElement(containerId, tabindex, propertynodename){
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/useFixedInlineToolbar", true)));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/jcr:primaryType", "nt:unstructured")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/format")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/format/jcr:primaryType","nt:unstructured")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/format/features","bold,italic")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/links")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/links/jcr:primaryType","nt:unstructured")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/links/features","modifylink,unlink")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/lists")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/lists/jcr:primaryType","nt:unstructured")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/lists/features","*")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/jcr:primaryType","nt:unstructured")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/features","*")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/jcr:primaryType","nt:unstructured")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_p")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_p/jcr:primaryType","nt:unstructured")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_p/description","Paragraph")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_p/tag","p")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h1")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h1/jcr:primaryType","nt:unstructured")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h1/description","Heading 1")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h1/tag","h1")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h2")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h2/jcr:primaryType","nt:unstructured")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h2/description","Heading 2")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h2/tag","h2")));

          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h3")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h3/jcr:primaryType","nt:unstructured")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h3/description","Heading 3")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h3/tag","h3")));

          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h4")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h4/jcr:primaryType","nt:unstructured")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h4/description","Heading 4")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h4/tag","h4")));

          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h5")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h5/jcr:primaryType","nt:unstructured")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h5/description","Heading 5")));
          $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/rtePlugins/paraformat/formats/default_h5/tag","h5")));
    }

    function addMultiFieldElement(containerId, tabindex, propertynodename, val){
         $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/composite", true)));
		 $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/")));
         $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/jcr:primaryType","nt:unstructured")));
         $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/sling:resourceType","granite/ui/components/coral/foundation/container")));
         $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/name",val)));
         $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/items/")));
         $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/items/jcr:primaryType","nt:unstructured")));
         $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/items/column/")));
         $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/items/column/jcr:primaryType","nt:unstructured")));
         $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/items/column/sling:resourceType","granite/ui/components/coral/foundation/container")));
         $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/items/column/items/")));
         $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/items/column/items/jcr:primaryType","nt:unstructured")));
    }

    function addDropDownElement(containerId, tabindex, propertynodename){
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/items/")));
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/items/jcr:primaryType","nt:unstructured")));
    }

    function addImageElement(containerId, tabindex, propertynodename, val){
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/allowUpload", true)));
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/autoStart", true)));
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/class", "cq-droptarget")));
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/mimeTypes", "image/gif")));
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/mimeTypes", "image/jpeg")));
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/mimeTypes", "image/png")));
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/mimeTypes", "image/webp")));
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/mimeTypes", "image/tiff")));
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/multiple", false)));
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/useHTML5", true)));
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/cropParameter", val +"/imageCrop")));
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/fileNameParameter", val +"/fileName")));
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/fileReferenceParameter", val +"/fileReference")));
        $("#tabs-navigation").append(containerId.append(_createHiddenTag(DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/sizeLimit", 100)));
    }

    function updateOtherElements(propertynodename,tabindex, itemid){
            updateFieldLabelElement(propertynodename, tabindex, itemid);
            updateRequiredChekboxElement(propertynodename, tabindex, itemid);
            updateDescriptionHintElement(propertynodename, tabindex, itemid);
    }

    function updateDescriptionHintElement(propertynodename, tabindex, itemid){
            if($(".fieldDescriptionHint-"+itemid).length > 0){
                 $(".fieldDescriptionHint-"+itemid).attr("name",DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/fieldDescription");
             }
        }

    function updateFieldLabelElement(propertynodename, tabindex, itemid){
        if($(".fieldlabel-"+itemid).length > 0){
             $(".fieldlabel-"+itemid).attr("name",DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/fieldLabel");
         }
    }

    function updateRequiredChekboxElement(propertynodename, tabindex, itemid){
        if($(".requiredchekbox-"+itemid).length > 0){
             $(".requiredchekbox-"+itemid).attr("name",DIALOG_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/required");
        }
    }

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
