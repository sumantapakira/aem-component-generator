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
(function(window, document, Granite, $) {
var TAB_BASE_URI = "./cq:dialog/content/items/tabs/items/" ;

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
          var originalmappedpropname = $(".propmap-"+itemid).val();
         var mappedpropname = originalmappedpropname;
		 if(mappedpropname.indexOf("./") === 0){
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

         if(isValidInput){
             var tabs = $("nav", "#tabs-navigation").find("a:not(#formbuilder-add-tab)");
             $.each(tabs, function(tabindex, tab) {
        		if($(tab).attr('tabindex') === '0'){
                    for(var j=0;j<numberOfMultifieldItem;j++){
                        var name = $('#multifield-item-name-'+itemid+'-'+j).val();
                        var label = $('#multifield-item-label-'+itemid+'-'+j).val();
                        var multifieldItemResourcetype = $('#multifield-type-'+itemid+'-'+j).val();
                        var nodeName = name.replace(/\s+/g, '-').toLowerCase();
					  $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/field/items/column/items/"+nodeName, undefined, "multifield-hidden-element-"+itemid));
                      $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/field/items/column/items/"+nodeName+"/jcr:primaryType","nt:unstructured","multifield-hidden-element-"+itemid ));
                      $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/field/items/column/items/"+nodeName+"/name",name,"multifield-hidden-element-"+itemid ));
                      $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/field/items/column/items/"+nodeName+"/fieldLabel",label,"multifield-hidden-element-"+itemid ));
                      $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/field/items/column/items/"+nodeName+"/sling:resourceType",multifieldItemResourcetype,"multifield-hidden-element-"+itemid ));
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
            "name": name,
            "class": cssClass
        });
        }
         return input;
    }

})(window, document, Granite, Granite.$);    