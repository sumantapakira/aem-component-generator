(function(window, document, Granite, $) {

 $(document).on("change", ".multifield-select-item", function(event) {
		 var field = $(".form-fields").find(".ui-selected");
        var itemid = field.data("id");

     $(".multifield-table-"+itemid).empty();

     var table = new Coral.Table().set({
                  selectable: true
     });
var numberOfMultifieldItem = parseInt(this.value);

 for(i=0; i< parseInt(this.value);i++){
      var row = table.items.add({});

         var select = new Coral.Select().set({name: "multifield-type-"+itemid + "-"+i,
                                              id:"multifield-type-"+itemid + "-"+i,
        placeholder: "Choose field type" });

        select.items.add({
            value:"granite/ui/components/coral/foundation/form/textfield",

          content: {
            innerHTML: "Text field"
          },
          disabled: false
        });
        select.items.add({
            value:"granite/ui/components/coral/foundation/form/pathfield",  
          content: {
            innerHTML: "Path field"
          },
          disabled: false
        });

     var selectfieldCell = new Coral.Table.Cell();
     selectfieldCell.appendChild(select);
     row.appendChild(selectfieldCell);


     var textfieldname = new Coral.Textfield().set({ placeholder: "Enter Name",
       name: "multifield-item-name-" + itemid + "-"+i,
       required: true,
       id:"multifield-item-name-" + itemid + "-"+i,   
       value: ""
     });
     var textfieldCell = new Coral.Table.Cell();
     textfieldCell.appendChild(textfieldname);
     row.appendChild(textfieldCell);

     var textfieldlable = new Coral.Textfield().set({ placeholder: "Enter Label",
       name: "multifield-item-label-" + itemid + "-"+i,
       required: true,
       id:"multifield-item-label-" + itemid + "-"+i,
       value: ""
     });
     var textfieldlabelCell = new Coral.Table.Cell();
     textfieldlabelCell.appendChild(textfieldlable);
     row.appendChild(textfieldlabelCell);
     }

     $(".multifield-table-"+itemid).append(table);



     $(".multifield-table-"+itemid).on("change", function(event) {
          console.log(event.target);
          console.log(event.target.value);
         var TAB_BASE_URI = "./cq:dialog/content/items/tabs/items/";
         var originalmappedpropname = $(".propmap-"+itemid).val();
         var mappedpropname = originalmappedpropname;
		 if(mappedpropname.indexOf("./") !== 0){
         	mappedpropname = mappedpropname.substring(2);
            } 

         var isValidInput = true;

		var mandatoryElements = document.querySelectorAll("[required='']");
		if (mandatoryElements.length > 0) {
			mandatoryElements.forEach(function (element) {
               	var api = $(element).adaptTo("foundation-validation");
                if (api && $(element).is(':visible')) {
					api.checkValidity();
					api.updateUI();
					if (!api.state.isValid()) {
						isValidInput = false;
					}
				}
			});
		}
     console.log(isValidInput);

         if(isValidInput){
             var tabs = $("nav", "#tabs-navigation").find("a:not(#formbuilder-add-tab)");
             var TAB_BASE_URI = "./cq:dialog/content/items/tabs/items/" ;
             $.each(tabs, function(tabindex, tab) {
        		if($(tab).attr('tabindex') === '0'){
                    for(var j=0;j<numberOfMultifieldItem;j++){
                        console.log($('#multifield-item-name-'+itemid+'-'+j).val());
                        var name = $('#multifield-item-name-'+itemid+'-'+j).val();
                        var label = $('#multifield-item-label-'+itemid+'-'+j).val();
                        var multifieldItemResourcetype = $('#multifield-type-'+itemid+'-'+j).val();
					  $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/field/items/column/items/"+name)); 
                      $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/field/items/column/items/"+name+"/jcr:primaryType","nt:unstructured" )); 
                      $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/field/items/column/items/"+name+"/name",name )); 
                      $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/field/items/column/items/"+name+"/fieldLabel",label )); 
                      $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/field/items/column/items/"+name+"/sling:resourceType",multifieldItemResourcetype ));   
                    }
                }
		   });
         }

    });


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
         console.log("input: "+input);
         return input;

    }

})(window, document, Granite, Granite.$);    