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

    function _stacheFields() {
        var selected = $(".form-fields .ui-selected");

        // updating field-edit
        if ($(".tab-form-settings").html() !== undefined &&
            $(".tab-form-settings").html().trim() !== "" &&
            selected.length > 0) {
            $(".tab-form-settings input, #field-edit button").each(function() {
                this.setAttribute("value", this.value);
            });
            $(".tab-form-settings textarea").each(function() {
                $(this).text(this.value);
            });
            $(".tab-form-settings input:radio, .tab-form-settings input:checkbox").each(function() {
                if ($(this).is(":checked")) {
                    $(this).closest("coral-checkbox").attr({ checked: "checked", value: "true" });
                    $(this).attr("checked", "checked");
                } else {
                    this.removeAttribute("checked");
                    $(this).closest("coral-checkbox").attr({ value: "false" });
                }
            });
            $(".tab-form-settings option", this).each(function() {
                if (this.selected) {
                    this.setAttribute("selected", "selected");
                } else {
                    this.removeAttribute("selected");
                }
            });

            $(selected).find(".formbuilder-content-properties").html($(".tab-form-settings").html());
            if ($(".tab-form-settings coral-datepicker")[0]) {
                $(selected).find(".formbuilder-content-properties coral-datepicker")[0].value =
                    $(".tab-form-settings coral-datepicker")[0].value;
            }
            if ($(".tab-form-settings coral-numberinput").length) {
                $(selected).find(".formbuilder-content-properties coral-numberinput")
                    .val($(".tab-form-settings coral-numberinput").val());
            }
        }
        // updating field-rules
        if ($(".tab-form-rules").html() !== undefined &&
            $(".tab-form-rules").html().trim() !== "" &&
            selected.length > 0) {
            $(".tab-form-rules input, #field-rules button").each(function() {
                this.setAttribute("value", this.value);
            });
            $(".tab-form-rules textarea").each(function() {
                $(this).text(this.value);
            });
            $(".tab-form-rules input:radio, .tab-form-rules input:checkbox").each(function() {
                if ($(this).is(":checked")) {
                    $(this).closest("coral-checkbox").attr({ checked: "checked", value: "true" });
                    $(this).attr("checked", "checked");
                } else {
                    this.removeAttribute("checked");
                    $(this).closest("coral-checkbox").attr({ value: "false" });
                }
            });
            $(".tab-form-rules option", this).each(function() {
                if (this.selected) {
                    this.setAttribute("selected", "selected");
                } else {
                    this.removeAttribute("selected");
                }
            });

            $(selected).find(".formbuilder-content-properties-rules").html($(".tab-form-rules").html());
            if ($(".tab-form-rules coral-datepicker")[0]) {
                $(selected).find(".formbuilder-content-properties-rules coral-datepicker")[0].value =
                    $(".tab-form-rules coral-datepicker")[0].value;
            }
            if ($(".tab-form-rules coral-numberinput").length) {
                $(selected).find(".formbuilder-content-properties-rules coral-numberinput")
                    .val($(".tab-form-rules coral-numberinput").val());
            }
        }
        $(".form-fields > li").removeClass("ui-selected");
    }

    function _reloadToPrev(elem) {
        var next = elem.data("nextpage");
        if (!next) {
            next = $('[data-foundation-wizard-control-action="next"]').data("nextpage");
        }
        if (!next) {
            next = "/apps/cq/core/content/nav/tools/acs-commons/component-generator/schemalist.html";
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

    function _propagateTabColumnInfoToItems(tabnames) {
        var tabs = $("section.formbuilder-tab-section:not(.dummy-section)", "#tabs-navigation");

        $.each(tabs, function(tabindex, tab) {
            var cols = $(".column", tab);
            var BASE = tabnames[tabindex].taburi;
            $.each(cols, function(columnindex, column) {
                var coluri = BASE + "/items/col" + (columnindex + 1);
                var colItems = $("li", column);
                var inputs = $("input", colItems);
                var textarea = $("textarea", colItems);
                var anchors = $("a", colItems);

                // set the list order
                $.each(colItems, function(index, item) {
                    $(item).find(".hidden-order").val(index);
                });

                // take care of inputs
                $.each(inputs, function(inputindex, input) {
                    var inputname = $(input).attr("name");
                    if (inputname) {
                        var path = inputname.substring(2);
                        var relpath = coluri + "/" + path;
                        $(input).attr("name", relpath);
                    }
                });
                // take care of textareas
                $.each(textarea, function(inputindex, input) {
                    if ($(input).attr("name")) {
                        var path = $(input).attr("name").substring(2);
                        var relpath = coluri + "/" + path;
                        $(input).attr("name", relpath);
                    }
                });
                // take case of delete anchors
                $.each(anchors, function(inputindex, input) {
                    var target = $(input).data("target");
                    if (target === undefined) {
                        return;
                    }
                    var path = $(input).data("target").substring(2);
                    var relpath = coluri + "/" + path;
                    $(input).attr("data-target", relpath);
                    $(input).data("target", relpath);
                });
            });
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

        _stacheFields();

        removeIrrelevantDropdowns();

        removeFormFieldContentInputs(form);

        types.push(_createHiddenTag("_charset_", "UTF-8"));

        /*
         First delete the existing form
         */
        types.push(_createHiddenTag("./items@Delete", "true"));

        /*
         Handle node type for content structure nodes
         */
        //types.push(_createHiddenTag("./jcr:content"));granite/ui/components/coral/foundation/container
        //types.push(_createHiddenTag("./jcr:content/jcr:primaryType", "nt:unstructured"));
        types.push(_createHiddenTag("./cq:dialog"));
        types.push(_createHiddenTag("./cq:dialog/jcr:primaryType", "nt:unstructured"));
        types.push(_createHiddenTag("./cq:dialog/sling:resourcetype", "cq/gui/components/authoring/dialog"));
        types.push(_createHiddenTag("./cq:dialog/content"));
        types.push(_createHiddenTag("./cq:dialog/content/sling:resourcetype", "granite/ui/components/coral/foundation/container"));
        types.push(_createHiddenTag("./cq:dialog/content/items"));
        types.push(_createHiddenTag("./cq:dialog/content/items/jcr:primaryType", "nt:unstructured"));
        types.push(_createHiddenTag("./cq:dialog/content/items/tabs"));
        types.push(_createHiddenTag("./cq:dialog/content/items/tabs/jcr:primaryType", "nt:unstructured"));
        types.push(_createHiddenTag("./cq:dialog/content/items/tabs/sling:resourceType", "granite/ui/components/coral/foundation/tabs"));
        types.push(_createHiddenTag("./cq:dialog/content/items/tabs/size", "L"));
        types.push(_createHiddenTag("./cq:dialog/content/items/tabs/items"));
        types.push(_createHiddenTag("./cq:dialog/content/items/tabs/items/jcr:primaryType", "nt:unstructured"));

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
            types.push(_createHiddenTag(TAB_BASE_URI + "/listOrder", tabindex));
            types.push(_createHiddenTag(TAB_BASE_URI + "/granite:rel",
                "aem-assets-metadata-form-tab"));
            types.push(_createHiddenTag(TAB_BASE_URI+ "/granite:data"));
            types.push(_createHiddenTag(TAB_BASE_URI + "/granite:data/jcr:primaryType", "nt:unstructured"));
            types.push(_createHiddenTag(TAB_BASE_URI + "/granite:data/tabid", tab.uuid));
            if (tab.tabname.trim() !== "") {
                types.push(_createHiddenTag(TAB_BASE_URI + "/jcr:title",
                    tab.tabname));
            } else {
                types.push(_createHiddenTag(TAB_BASE_URI + "/jcr:title",
                    Granite.I18n.get("Unnamed") + "-" + _getUntitledTabCount()));
            }
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items"));
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/jcr:primaryType", "nt:unstructured"));
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/columns"));
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/columns/jcr:primaryType", "nt:unstructured"));
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/columns/sling:resourceType", "granite/ui/components/coral/foundation/fixedcolumns"));
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/columns/margin", "true"));
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/columns/items"));
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/columns/items/jcr:primaryType", "nt:unstructured"));
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/columns/items/column"));
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/columns/items/column/jcr:primaryType", "nt:unstructured"));
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/columns/items/column/sling:resourceType", "granite/ui/components/coral/foundation/container"));
				 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/columns/items/column/items"));
                 types.push(_createHiddenTag(TAB_BASE_URI +  "/items/columns/items/column/items/jcr:primaryType", "nt:unstructured"));
        });



        /*
         Propagate tab and column info to items
         */
        //_propagateTabColumnInfoToItems(tabs);
        tabsNavigation.prepend(types);

        // detach editor-right and after the serialization re-attach
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
            console.log(form[0])
            data = new FormData(form[0]);
        } else {
            data = form.serialize();
        }
        // re-attach
        editorRightParent.prepend(editorRightDetached);
        $.each(masterFieldsObj, function(index, el) {
            el["parent"].prepend(el["el"]);
        });

        console.log(formdata);
        console.log(data);

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

        if (formdata) {
            $.ajax({
                url: url,
                type: "POST",
                data: data,
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
                success: function() {
                    _reloadToPrev($this);
                },
                error: function() {
                    _showErrorAndRedirect();
                }
            });
        }
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

    /**
     * Since only one options of 'Add Manually' and 'Add through JSON path' can be set,
     * potential inputs to the inactive mode are cleared.
     */
    function removeIrrelevantDropdowns() {
        $("li[data-fieldtype='dropdown']").each(function(index, dropdown) {
            var $dropdown = $(dropdown);
            var $jsonOption = $dropdown.find(".radio-choice-json");

            $jsonOption.each(function() {
                var isJsonOptionChecked = $(this).attr("checked") === "checked";

                if (isJsonOptionChecked) {
                    // remove all manual added options
                    $dropdown.find(".dropdown-option").remove();
                    // remove all rules
                    $dropdown.find(".manual-options-only").remove();
                } else {
                    // remove JSON path
                    $dropdown.find(".json-path-descriptor").val("");
                }
            });
        });
    }

    // disable all input field which are unnecessary and doesn't map to an item property
    function removeFormFieldContentInputs($form) {
        var $contentFields = $(".formbuilder-content-form", $form);
        $("input", $contentFields).attr("disabled", "");
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
