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
    var optionsIds = [];
    var itemid;

    $(document).on("click", ".append-dropdown-option", function(e) {

        var field = $(".form-fields").find(".ui-selected");
         itemid = field.data("id");
        var optionId = $.now();
        optionsIds.push(optionId);


		var table = new Coral.Table().set({
                  selectable: false
        });

        var row = table.items.add({});
        var optionText = new Coral.Textfield().set({ placeholder: "Option Text",
       		name: "dropdown-option-text-" + itemid +"-"+optionId,
       		id:"dropdown-option-text-" + itemid + "-" +optionId,
            required:true,                                        
       		value: ""
     	});
     var optionTextCell = new Coral.Table.Cell();
     optionTextCell.appendChild(optionText);
     row.appendChild(optionTextCell);

        var optionValue = new Coral.Textfield().set({ placeholder: "Option Value",
       		name: "dropdown-option-value-" + itemid +"-"+optionId,
       		id:"dropdown-option-value-" + itemid + "-" +optionId,
            required:true,
       		value: ""
     	});
     var optionValueCell = new Coral.Table.Cell();
     optionValueCell.appendChild(optionValue);
     row.appendChild(optionValueCell);

        $(".dropdown-manual-table-"+itemid).append(table);


        $(".dropdown-manual-table-"+itemid).on("change", function(event) {

				 var TAB_BASE_URI = "./cq:dialog/content/items/tabs/items/";
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
             var TAB_BASE_URI = "./cq:dialog/content/items/tabs/items/" ;
             $.each(tabs, function(tabindex, tab) {
        		if($(tab).attr('tabindex') === '0'){

                    for(var j=0;j<optionsIds.length;j++){
                        var name = $('#dropdown-option-text-'+itemid+'-'+optionsIds[j]).val();
                        var value = $('#dropdown-option-value-'+itemid+'-'+optionsIds[j]).val();
                        var nodeName = name.replace(/\s+/g, '-').toLowerCase();
                      $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/items/"+nodeName)); 
                      $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/items/"+nodeName+"/jcr:primaryType","nt:unstructured")); 
                      $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/items/"+nodeName+"/text",name));
                      $("#tabs-navigation").append(_createHiddenTag(TAB_BASE_URI + "tab" + (tabindex + 1) + "/items/columns/items/column/items/"+mappedpropname+"/items/"+nodeName+"/value",value));

                    }
                    optionsIds = [];
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
         return input;
    }

})(window, document, Granite, Granite.$);     