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
(function(document, $) {
    "use strict";

    $(document).on("click", "#dialogeditor-setting-submit",  function(e) {
         var projectpath = $("#dialogeditor-settings-projectpath").val();
         var coremodule = $("#dialogeditor-settings-core").val();
         var uimodule = $("#dialogeditor-settings-uicomponent").val();
         var reactmodule = $("#dialogeditor-settings-reactmodule").val();
        
        if(projectpath){
			$.ajax({
                url: "/bin/servets/savesettings.json",
                type: "POST",
                data: {
                    projectpath : projectpath,
                    coremodule: coremodule,
                    uimodule: uimodule,
                    reactmodule: reactmodule},
                success: function(result) {
                    window.location.reload();
                },
                error: function() {

                }
            });
        }
        });


})(document, Granite.$);
