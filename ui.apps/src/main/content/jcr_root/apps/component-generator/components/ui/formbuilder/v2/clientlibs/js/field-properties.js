

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
        if(mappedpropname.indexOf("./") !== 0){
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
        console.log(value);
        var tabs = $("nav", "#tabs-navigation").find("a:not(#formbuilder-add-tab)");

        var mappedpropname = $(".propmap-"+itemid).val();
        if(mappedpropname.indexOf("./") !== 0){
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
					$("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/datasource"));
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

    // ////////// Handle MapsTo field //////////////
    $(document).on("change", ".field-mvtext-descriptor", function() {
        var activeProperties = $("section.active", ".editor-right");
        var field = $(".form-fields").find(".ui-selected");
        var resourceType;

       
        if(parseInt(field.children(".textfield").length)>0){
            resourceType = "granite/ui/components/coral/foundation/form/textfield";
        }else if( parseInt(field.children(".pathfield").length)>0 ){
      		resourceType = "granite/ui/components/coral/foundation/form/pathfield";	
        }else if(parseInt(field.children(".dropdownfield").length)>0 ){
			resourceType = "granite/ui/components/coral/foundation/form/select";	
        }else if(parseInt(field.children(".multifield").length)>0 ){
			resourceType = "granite/ui/components/coral/foundation/form/multifield";	
        }

        var itemid = field.data("id");
        var name = "./items/" + itemid + "/name";
        var inputname = $("input[name=\"" + name + "\"]", activeProperties);
        var val = $(this).val();
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

        var $propertyLockField = $(this).closest(".editor-right").find(".tab-form-settings .msm-property-lock-field");
        var isValidLockablePath = function(path) {
            var isValid = true;
            path = path.replace(/^.\//g, "");
            var segments = path.split("/");
            if (segments.length === 0 ||
                segments.length > 2 ||
                (segments.length === 1 && segments[0] === "metadata") ||
                (segments.length === 2 && segments[0] !== "metadata")) {
                isValid = false;
            }
            return isValid;
        };
        var propertyLockPath = $(this).val() || "";
        propertyLockPath = propertyLockPath.replace("/jcr:content", "");
        if (isValidLockablePath(propertyLockPath)) {
            $propertyLockField.removeAttr("disabled", "");
            $propertyLockField.val(propertyLockPath);
        } else {
            $propertyLockField.val("");
            $propertyLockField.attr("disabled", "");
        }

       var tabs = $("nav", "#tabs-navigation").find("a:not(#formbuilder-add-tab)");
         $.each(tabs, function(tabindex, tab) {
              var BASE = "items/tabs/items/";
              var TAB_BASE_URI = "./cq:dialog/content/" + BASE;
             if($(tab).attr('tabindex') === '0'){
              	var propertynodename = val.substring((val.lastIndexOf("/") + 1));
                  $(".propmap-"+itemid).attr('name',TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename);
                  $(".propmap-"+itemid).attr('value',val);


                 $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename));
                 $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/jcr:primaryType", "nt:unstructured"));
                 $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/name", val, "propnameclass"));
                 $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/sling:resourceType", resourceType));

                 $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/granite:data"));
				 $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/granite:data/jcr:primaryType", "nt:unstructured"));
                 $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/granite:data/cq-msm-lockable", propertynodename));

                 if(parseInt(field.children(".multifield").length)>0 ){
                       $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/composite", true));
				   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field"));
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/jcr:primaryType","nt:unstructured"));
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/sling:resourceType","granite/ui/components/coral/foundation/container"));
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/name",val));
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/items"));
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/items/jcr:primaryType","nt:unstructured")); 
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/items/column"));
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/items/column/jcr:primaryType","nt:unstructured")); 
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/items/column/sling:resourceType","granite/ui/components/coral/foundation/container")); 
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/items/column/items"));
                   $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+propertynodename+"/field/items/column/items/jcr:primaryType","nt:unstructured")); 


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


    // ////////// Handle disable edit checkbox to enable/disable property lock input //////////////
    $(document).on("change", ".checkbox-field-edit-disabled", function() {
        var $checkboxFieldDisabled = $(this);
        var $propertyLockField = $checkboxFieldDisabled
            .closest(".editor-right")
            .find(".tab-form-settings .msm-property-lock-field");

        if ($checkboxFieldDisabled.prop("checked")) {
            $propertyLockField.attr("disabled", "");
        } else {
            $propertyLockField.removeAttr("disabled");
        }
    });

    // ////////// Handle label for DatePicker field //////////////
    $(document).on("propertychange input paste", ".field-label-descriptor", function() {
        var field = $(".form-fields").find(".ui-selected")[0];
        var type = $(field).data("fieldtype");

        if (type === "datepicker") {
            var f = $(field).find(".formbuilder-content-form .foundation-field-hide-in-default");
            if (f.length) {
                f.find("span:first-child").text(this.value);
            } else {
                $($(field).find(".formbuilder-content-form span")[0]).text(this.value);
            }
        }
    });
})(window, document, Granite, Granite.$, History);
