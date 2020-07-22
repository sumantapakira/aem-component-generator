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

(function(document, Dam, _g, $) {
    "use strict";

    var submitButton;

    $(document).on("input", "#componenteditor-component-title", function(e) {
        var $name = $(this);
        var title = $name.val();
        Dam.Util.NameValidation.handleFileNameValidation($name);

        _updateComponentGeneratorSubmitBtn(title);
    });



    $(document).on("submit", "#component-generator-form", function(e) {
        e.preventDefault();
        var formpath = $(".foundation-content-path").data("foundation-content-path");
        var formname = $("#componenteditor-component-title").val().trim();
        var uri = formpath + "/" + formname.toLowerCase();
        var nodeType = formpath + "/jcr:primaryType=sling:Folder";

        if (!submitButton.disabled) {
            $.ajax({
                url: uri,
                type: "POST",
                data: "type=text&" + nodeType + "&" + $("#component-generator-form").serialize()
            }).always(function() {
                window.location.reload();
                 }).fail(function() {
                var contentMessage = Granite.I18n.get("Failed to create component.");
                var ui = $(window).adaptTo("foundation-ui");
                ui.prompt(Granite.I18n.get("Error"), contentMessage, "error", [{
                    text: Granite.I18n.get("Close"),
                    variant: "primary",
                    error: true
                }]);
            });
        }
    });



    var generateComponentHandler = function(e) {
        $( "#component-generator-form" ).submit(function( e ) {
          var componentPath = getRequestParameter('formPath');  
          e.preventDefault();
          var componentName = $("#componenteditor-component-title").val();
          var resourceSuperType = $("input[name='./sling:resourceSuperType']").val() ;
          var groupName = $("input[name='./componentGroup']").val();
          var isContainer = $("#component-generator-iscontainer").prop("checked"); 

            $.ajax({
                url: "/bin/servets/createcomponent.json",
                type: "POST",
                data: {
                    componentName : componentName,
                    componentPath: componentPath,
                    resourceSuperType: resourceSuperType,
                    groupName: groupName,
                    isContainer : isContainer
                },
                success: function(result) {
                    console.log(result.result);
				},
                error: function() {
                var contentMessage = Granite.I18n.get("Failed to create component.");
                var ui = $(window).adaptTo("foundation-ui");
                ui.prompt(Granite.I18n.get("Error"), contentMessage, "error", [{
                    text: Granite.I18n.get("Close"),
                    variant: "primary",
                    error: true
                }]);
                }
            });

        });
    };

    $(document).on("keyup", "#componenteditor-component-title", function(e) {
        var addformInputField = $(this);
        var titleValue = "";

        if (addformInputField.length) {
            titleValue = addformInputField[0].value;
        }
        _updateComponentGeneratorSubmitBtn(titleValue);
    });

    function _updateComponentGeneratorSubmitBtn(title) {
        submitButton = document.getElementById("component-generator-form-submit");
        submitButton.onclick = generateComponentHandler;
        if (0 === title.trim().length) {
            submitButton.disabled = true;
        } else {
            submitButton.disabled = false;
        }
    }

    function getRequestParameter(paramName){
        if(paramName=(new RegExp('[?&]'+encodeURIComponent(paramName)+'=([^&]*)')).exec(location.search)){
              return decodeURIComponent(paramName[1]);
        }
    }


})(document, Dam, _g, Granite.$);
