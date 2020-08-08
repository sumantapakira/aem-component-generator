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

$(document).on("click", ".delete-field", function(e) {

        e.preventDefault();
        showDeleteDialog($(this));
    });

    $(document).on("keypress", ".delete-field", function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            showDeleteDialog($(this));
        }
    });

        function showDeleteDialog(element) {
            var targetId = element.data("target-id");
            var target = element.data("target");
            var ui = $(window).adaptTo("foundation-ui");
            var message = Granite.I18n.get("Are you sure to delete the field?");
            ui.prompt(Granite.I18n.get("Delete Field"), message, "warning", [{
                text: Granite.I18n.get("Cancel")
            }, {
                text: Granite.I18n.get("Delete"),
                primary: true,
                handler: function() {
                    deleteField(targetId, target);
                }
            }]);
        }

        function deleteField(targetId, target) {
           $('*[data-id="'+targetId+'"]').remove();
            $('#container-'+targetId).remove();
            $(".pathfield-rootcontent-"+targetId).remove();
            $("#datasourcevontainerid-"+targetId).remove();
            $(".requiredchekbox-"+targetId).remove();
            $("#datasourcevontainerid-"+targetId).remove();
            $(".fieldDescriptionHint-"+targetId).remove();
            $(".field-label-descriptor-"+targetId).remove();
        }

})(window, document, Granite, Granite.$);