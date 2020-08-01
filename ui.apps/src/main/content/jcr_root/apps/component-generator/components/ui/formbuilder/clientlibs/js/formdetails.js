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

    /**
     * block all the enter keys, so that form doesn't get submitted
     * */
    $(document).on("keypress", function(e) {
        if (e.keyCode === 13) {
            return false;
        }
    });
    // block default submission of the form by Submit button - required for FF and IE
    $("form").submit(function() {
        return false;
    });



    function _reloadToPrev(elem) {
        var next = elem.data("nextpage");
        if (!next) {
            next = $('[data-foundation-wizard-control-action="next"]').data("nextpage");
        }
        if (!next) {
            next = "/apps/cq/core/content/nav/tools/component-generator/component-generator/componentlist.html";
        }
        var relativePath = $(".foundation-content-path").data("foundation-relative-path");
        var pathname = next + relativePath.slice(0, relativePath.lastIndexOf("/"));
        window.location.replace(Granite.HTTP.externalize(pathname));
    }

    function _getUntitledTabCount() {
        var tabTitles = $("span", "a.formbuilder-tab-anchor");
        var untitled = "Unnamed".toLowerCase();
        var counter = 1;
        $.each(tabTitles, function(index, title) {
            if ($(title).text().slice(0, 7).toLowerCase() === untitled) {
                counter++;
            }
        });

        return counter;
    }

    function _createHiddenTag(name, value) {
        if (value !== undefined) {
            return $("<input/>").attr({
                "type": "hidden",
                "name": name,
                "value": value
            });
        }

        return $("<input/>").attr({
            "type": "hidden",
            "name": name
        });
    }

    function _getTabInfo() {
        var tabs = $("nav", "#tabs-navigation").find("a:not(#formbuilder-add-tab)");
        var BASE = "items/tabs/items/";
        var TAB_BASE_URI = "./cq:dialog/content/" + BASE;
        return $.map(tabs, function(tab, tabindex) {
            return {
                taburi: TAB_BASE_URI + "tab" + (tabindex + 1),
                tabname: $("span", $(tab)).text(),
                uuid: $(tab).data("tabid")
            };
        });
    }



    function submitSchemaForm(e) {
        var $this = $(this);
        var tabsNavigation = $("#tabs-navigation");

        var url = $(".foundation-content-path").data("foundation-content-path");
        var form = $(".foundation-wizard").closest("form");
        var tabs = _getTabInfo();
        var types = [];
        var formBuilderTabsSection = $("section.formbuilder-tab-section");

        $(this).attr("disabled", "disabled");


        types.push(_createHiddenTag("_charset_", "UTF-8"));

        /*
         First delete the existing form
         */
        types.push(_createHiddenTag("./cq:dialog@Delete", "true"));

         types.push(_createHiddenTag("./cq:dialog"));
         var n = url.lastIndexOf('/');
         var title = url.substring(n + 1);
        types.push(_createHiddenTag("./cq:dialog/jcr:title", title));
        types.push(_createHiddenTag("./"+title+".html"));
        types.push(_createHiddenTag("./"+title+".html/jcr:primaryType","nt:file"));
        types.push(_createHiddenTag("./"+title+".html/jcr:content"));
        types.push(_createHiddenTag("./"+title+".html/jcr:content/jcr:primaryType","nt:resource"));
        types.push(_createHiddenTag("./"+title+".html/jcr:content/jcr:mimeType","text/html"));


        types.push(_createHiddenTag("./"+title+".html/jcr:content/jcr:data","<div data-sly-test='${wcmmode.edit}'>Configure ${component.properties.jcr:title}</div>"));

        types.push(_createHiddenTag("./cq:dialog/jcr:primaryType", "nt:unstructured"));
        types.push(_createHiddenTag("./cq:dialog/sling:resourceType", "cq/gui/components/authoring/dialog"));
        types.push(_createHiddenTag("./cq:dialog/content"));
        types.push(_createHiddenTag("./cq:dialog/content/sling:resourceType", "granite/ui/components/coral/foundation/container"));
        types.push(_createHiddenTag("./cq:dialog/content/items/"));
        types.push(_createHiddenTag("./cq:dialog/content/items/jcr:primaryType", "nt:unstructured"));
        types.push(_createHiddenTag("./cq:dialog/content/items/tabs/"));
        types.push(_createHiddenTag("./cq:dialog/content/items/tabs/jcr:primaryType", "nt:unstructured"));
        types.push(_createHiddenTag("./cq:dialog/content/items/tabs/sling:resourceType", "granite/ui/components/coral/foundation/tabs"));
        types.push(_createHiddenTag("./cq:dialog/content/items/tabs/size", "L"));
        types.push(_createHiddenTag("./cq:dialog/content/items/tabs/items/"));
        types.push(_createHiddenTag("./cq:dialog/content/items/tabs/items/jcr:primaryType", "nt:unstructured"));
        types.push(_createHiddenTag("componentPath", url));


        /*
         Handle node type for tabs
         */
        $.each(tabs, function(tabindex, tab) {
             var TAB_BASE_URI =  tab.taburi;
            types.push(_createHiddenTag(TAB_BASE_URI));
            types.push(_createHiddenTag(TAB_BASE_URI + "/jcr:primaryType",
                "nt:unstructured"));
            types.push(_createHiddenTag(TAB_BASE_URI + "/sling:resourceType",
                "granite/ui/components/coral/foundation/container"));
            types.push(_createHiddenTag(TAB_BASE_URI + "/granite:rel",
                "aem-assets-metadata-form-tab"));
             if (tab.tabname.trim() !== "") {
                types.push(_createHiddenTag(TAB_BASE_URI + "/jcr:title",
                    tab.tabname));
            } else {
                types.push(_createHiddenTag(TAB_BASE_URI + "/jcr:title",
                    Granite.I18n.get("Unnamed") + "-" + _getUntitledTabCount()));
            }
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/"));
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/jcr:primaryType", "nt:unstructured"));
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/columns/"));
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/columns/jcr:primaryType", "nt:unstructured"));
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/columns/sling:resourceType", "granite/ui/components/coral/foundation/fixedcolumns"));
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/columns/margin", "true"));
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/columns/items/"));
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/columns/items/jcr:primaryType", "nt:unstructured"));
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/columns/items/column/"));
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/columns/items/column/jcr:primaryType", "nt:unstructured"));
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/columns/items/column/sling:resourceType", "granite/ui/components/coral/foundation/container"));
				 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/columns/items/column/items/"));
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/columns/items/column/items/jcr:primaryType", "nt:unstructured"));
        });



        tabsNavigation.prepend(types);

        var editorRight = $(".editor-right", form);
        var editorRightParent = editorRight.parent();

        // detach all master fields from form submission
        var masterFields = $(".master-fields");
        var masterFieldsObj = $.map(masterFields, function(masterField) {
            var mf = $(masterField);
            return {
                "el": mf,
                "parent": mf.parent()
            };
        });

        // detach
        masterFields.detach();
        var editorRightDetached = editorRight.detach();

        // remove the edit fields
        $(".foundation-field-edit").find("input:text").remove();
        $(".field-mvtext-descriptor").remove();

        // serialize form
        var data;
        var formdata = window.FormData || undefined;
        if (formdata) {
            data = new FormData(form[0]);
        } else {
            data = form.serialize();
        }
        // re-attach
        editorRightParent.prepend(editorRightDetached);
        $.each(masterFieldsObj, function(index, el) {
            el["parent"].prepend(el["el"]);
        });

       

        if (formdata) {
            $.ajax({
                url: url,
                type: "POST",
                data: data,
                async:false,
                contentType: false,
                processData: false,
                success: function() {


                    _reloadToPrev($this);
                },
                error: function() {
                    _showErrorAndRedirect();
                }
            });
        } else {
            $.ajax({
                url: url,
                type: "POST",
                data: data,
                async:false,
                success: function() {
                    _reloadToPrev($this);
                },
                error: function() {
                    _showErrorAndRedirect();
                }
            });
        }

        $.ajax({
                url: "/bin/servets/createcomponentdialog.json",
                type: "POST",
                data: form.serialize(),
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
    }

    function _showErrorAndRedirect() {
        var ui = $(window).adaptTo("foundation-ui");
        // show the error modal
        var message = Granite.I18n.get("Internal error occurred while saving the form");
        ui.prompt(Granite.I18n.get("Failed"), message, "error", [{
            text: "Cancel"
        }, {
            text: Granite.I18n.get("Ok"),
            primary: true,
            handler: function() {
                _reloadToPrev($(this));
            }
        }]);
    }


    $(document).on("click", "[data-foundation-wizard-control-action=\"next\"]", submitSchemaForm);

    $(document).on("flexwizard-stepchange", function(e) {
        $(".foundation-wizard-control").off(".foundation-wizard-control");
        $(document).off("click", "[data-foundation-wizard-control-action=\"next\"]")
            .on("click", "[data-foundation-wizard-control-action=\"next\"]", submitSchemaForm);
    });

    $(document).on("click", "[data-foundation-wizard-control-action=\"cancel\"]", function() {
        _reloadToPrev($(this));
    });
})(document, Granite.$);
