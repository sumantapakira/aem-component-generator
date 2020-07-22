/**
 * ADOBE CONFIDENTIAL
 * __________________
 *
 *  Copyright 2017 Adobe Systems Incorporated
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 */

(function(window, document, Granite, $, Handlebars) {
    "use strict";

    var newItem;

    function _generateUUID() {
        var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0;
            var v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return uuid;
    }

    function _getUntitledTabCount() {
        var tabTitles = $("span", "a.formbuilder-tab-anchor");
        var untitled = Granite.I18n.get("Unnamed");
        var untitledLen = untitled.length;
        var counter = 1;
        $.each(tabTitles, function(index, title) {
            if ($(title).text().slice(0, untitledLen) === untitled) {
                var suffix = $(title).text().slice(untitledLen + 1);
                var last = parseInt(suffix);
                counter = last + 1;
            }
        });

        return counter;
    }

    // add new tab functionality
    $(document).on("click", "#formbuilder-add-tab", function() {
        var $tabNav = $("#tabs-navigation");
        var clonedLinkTabMarkUp = "<span>" + Granite.I18n.get("Unnamed") +
            "-" + _getUntitledTabCount() +
            "</span><coral-icon class=\"close-tab-button\" icon=\"close\" size=\"XS\">" +
            "</coral-icon>";

        var clonedLink = $(clonedLinkTabMarkUp);
        var clonedSection = $(
            "<div class=\"panel\">" +
            "<div class=\"column\">" +
            "<ol class=\"form-fields\"></ol>" +
            "</div>"+
            "</div>");

        var tabs = $tabNav.data("tabs");
        var tabIndex = $(".formbuilder-tab-anchor").length;
        var panelId = tabs.addItem({ tabContent: clonedLink, panelContent: clonedSection, index: tabIndex });

        $("section#" + panelId + "").addClass("formbuilder-tab-section");
        $("a[aria-controls=" + panelId + "]").addClass("formbuilder-tab-anchor");
        $("a[aria-controls=" + panelId + "]").attr("data-tabid", _generateUUID());

        // Make the form fields sortable
        $(".form-fields", clonedSection).sortable({
            beforeStop: function(event, ui) {
                newItem = ui.item;
            },
            connectWith: ".form-fields",
            dropOnEmpty: true,
            receive: function(event, ui) {
                var uid = $.now();
                var content = $(newItem).find("script.field-properties").html();
                var contentAdjusted = content.replace(/&#x7b;/g, "{").replace(/&#x7d;/g, "}");
                var uniqueFieldProperties = Handlebars.compile(contentAdjusted);
                var context = new Object();

                context["field_id"] = uid;
                context["option_id"] = uid;
                $(newItem).attr("data-id", context.field_id).html(uniqueFieldProperties(context));
                $('input[name="./items/formbuilder/value"]').remove();
            }
        });
    });

    $(window).on("resize", function() {
        resize();
    });

    function resize() {
        var formBuilder = $(".formbuilder-wrapper");
        formBuilder.removeClass("column-1-layout");
        formBuilder.removeClass("column-2-layout");
        formBuilder.removeClass("column-3-layout");
        var width = formBuilder.width();
        if (width > 1500) {
            formBuilder.addClass("column-3-layout");
        } else {
            if (width > 1000) {
                formBuilder.addClass("column-2-layout");
            } else {
                formBuilder.addClass("column-1-layout");
            }
        }
    }

    $(document).on("foundation-contentloaded", function() {
        resize();
        $("#formbuilder-field-templates .field")
            .draggable({
                scroll: true,
                connectToSortable: ".form-fields",
                helper: "clone",
                revert: "invalid",
                appendTo: "body"
            });

        $(".form-fields").sortable({
            beforeStop: function(event, ui) {
                newItem = ui.item;
            },
            connectWith: ".form-fields",
            dropOnEmpty: true,
            receive: function(event, ui) {
                var uid = $.now();
                var $stashedChoicesSetting = $(".tab-form-settings input[name='choice-options'][checked]");
                var content = $(newItem).find("script.field-properties").html();
                var contentAdjusted = content.replace(/&#x7b;/g, "{").replace(/&#x7d;/g, "}");
                var uniqueFieldProperties = Handlebars.compile(contentAdjusted);
                var context = new Object();

                context["field_id"] = uid;
                context["option_id"] = uid;
                $(newItem).attr("data-id", context.field_id).html(uniqueFieldProperties(context));
                $('input[name="./items/formbuilder/value"]').remove();

                if ($stashedChoicesSetting.length) {
                    $stashedChoicesSetting.prop("checked", true);
                }
            }
        });

        // FIXME: ugly hack to hide readonly spans
        // if property renderReadOnly is set
        $(".foundation-field-readonly").hide();

        // post processing
        $("input:text", "coral-datepicker").removeClass("is-invalid");

        // trigger a click on the active tab, so that settings gets propgated with the active tab name
        // $(".form-left nav[role=tablist] .is-active").trigger("click");


        // propogate the the tags information
        $("coral-autocomplete").each(function() {
            var $this = $(this);
            var taglist = $this.find(".coral-taglist").data("tagList");
            var selectlist = $this.find("coral-selectlist").find(".coral-SelectList-item");
            var defaults = $this.data("default").split(",");

            $.each(defaults, function(index, el) {
                var name = selectlist.filter(function() {
                    return $(this).data("value") === el;
                });
                name = name.text();

                taglist.addItem({
                    display: name,
                    value: el
                });
            });
        });
        $(".form-left [data-metatype=tags]").removeAttr("value");
    });

    // close tab
    $(document).on("click", ".close-tab-button", function(e) {
        var currentTab = $(e.currentTarget).closest("a");
        var ui = $(window).adaptTo("foundation-ui");
        // show the warning modal

        var message =
            Granite.I18n.get("Are you sure to delete the {0} tab?", "<b>" + currentTab.find("span").html() + "</b>");
        ui.prompt(Granite.I18n.get("Delete Tab"), message, "warning", [{
            text: Granite.I18n.get("Cancel")
        }, {
            text: Granite.I18n.get("Delete"),
            primary: true,
            handler: function() {
                deleteTab(currentTab);
            }
        }]);
    });

    function deleteTab(currentTab) {
        var currentSection = currentTab.parent().parent().find("section.is-active");
        var previousTab = currentTab.prev();
        var nextTab = currentTab.next();

        if (previousTab[0] !== undefined) {
            previousTab.trigger("click");
        } else if (nextTab.is(":not(#formbuilder-add-tab)")) {
            nextTab.trigger("click");
        }

        currentSection.remove();
        currentTab.remove();
    }

    // pop the settings tab when a tab is activated
    $(document).on("click", ".formbuilder-tab-anchor", function(e) {
        // first clear the currently active formitem
        stacheFields();
        clearFields();
        hideFormFields();

        // activate the settings tab
        $("#tab-edit").trigger("click");
    });

    // when focus is moved between tabs we need to keep track of tabindex of form fields.
    $(document).on("focusout", ".formbuilder-tab-anchor", function(e) {
        // first clear the currently active formitem
        stacheFields();
        clearFields();
        hideFormFields();

        // add tabindex=0 to the first field of the newly active tab and clear tabindex on other fields
        var existingList = $(".dam-schemaeditor-panel-content section.is-active .form-fields");
        if (existingList.length > 0) {
            $(".form-fields > li").attr("tabindex", "-1");
            var firstChild = existingList.children().first();
            firstChild.attr("tabindex", "0");
        }
    });

    $(document).on("click", ".form-fields > li", function(e) {
        e.stopPropagation();
        e.preventDefault();
        selectField(this);
        toggleSelection(this);
    });

    $(document).on("keypress", ".form-fields > li", function(e) {
        if (e.keyCode === 13) {
            e.stopPropagation();
            e.preventDefault();
            selectField(this);
            toggleSelection(this);
        }
    });

    function toggleSelection(elem) {
        // on click or enter, the focus should move to the current element and rest all fields should have tabindex=-1
        $(".form-fields > li").attr("tabindex", "-1");
        $(elem).attr("tabindex", "0");

        // on click or enter, keyboard drag-drop action should be terminated and any selected field should be deselected
        $(".form-fields > li").removeClass("is-selected");
    }

    function hideFormFields() {
        if ($(".formbuilder-tab-anchor:first-child").hasClass("is-active")) {
            $("#contextual-metadata-schema-form-field").show();
        } else {
            $("#contextual-metadata-schema-form-field").hide();
        }
    }

    function clearFields() {
        var activeTab = $(".formbuilder-tab-anchor.is-active");
        var tabname = $("#tab-name").clone();
        var settingsPlaceholder = $('<div class="placeholder">').html($("<i>")
            .html(Granite.I18n.get("Select a metadata schema editor field to edit settings")));
        var rulesPlaceholder = $('<div class="placeholder">').html($("<i>")
            .html(Granite.I18n.get("Select a metadata schema editor field to edit rules")));
        $(".tab-form-settings")
            .empty()
            .append(tabname)
            .append(settingsPlaceholder);
        $(".tab-form-rules")
            .empty()
            .append(rulesPlaceholder);
        $("input[type=\"text\"]", tabname).val(activeTab.text());

        // set tabindex = 0 for first list item in first column
        var existingList = $(".dam-schemaeditor-panel-content section.is-active .form-fields");
        if (existingList.length > 0) {
            var firstChild = existingList.children().first();
            firstChild.attr("tabindex", "0");
        }
        tabname.show();
    }

    function stacheFields() {
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

    function selectField(field) {
        stacheFields();
        $(field).addClass("ui-selected");

        // if you wish to modify the tab name
        $("#tab-name").appendTo("body").hide();

        $(".tab-form-settings").html($(field).find(".formbuilder-content-properties").html());
        $(".tab-form-rules").html($(field).find(".formbuilder-content-properties-rules").html());
        if ($(field).find(".formbuilder-content-form coral-datepicker")[0]) {
            if ($(".tab-form-settings coral-datepicker")[0] !== undefined) {
                $(".tab-form-settings coral-datepicker")[0].value =
                    $(field).find(".formbuilder-content-form coral-datepicker")[0].value;
            }
            if ($(".tab-form-rules coral-datepicker")[0] !== undefined) {
                $(".tab-form-rules coral-datepicker")[0].value =
                    $(field).find(".formbuilder-content-form coral-datepicker")[0].value;
            }
        }

        if ($(field).find('.formbuilder-content-form input[type="text"]')[0]) {
            if ($(".tab-form-settings coral-numberinput")[0] !== undefined) {
                $(".tab-form-settings coral-numberinput")
                    .val($(field).find('.formbuilder-content-form input[type="text"]').val());
            }
            if ($(".tab-form-rules coral-numberinput")[0] !== undefined) {
                $(".tab-form-rules coral-numberinput")
                    .val($(field).find('.formbuilder-content-form input[type="text"]').val());
            }
        }

        $("button", ".default-datepicker").css({
            top: 0,
            right: 0
        });
        var ruleContextOptions = [ "required", "choice", "visibility" ];
        var len = ruleContextOptions.length;
        for (var i = 0; i < len; i++) {
            var ruleAppliedInfoSel = '.tab-form-rules .rule-applied-info[data-context="' +
                ruleContextOptions[i] + '"]';
            var ruleAppliedInfoElem = $(ruleAppliedInfoSel);
            if (ruleAppliedInfoElem.length && (typeof (ruleAppliedInfoElem.attr("hidden")) === "undefined")) {
                var dfFieldName = $(field).find(".cf-" + ruleContextOptions[i] + "-field").attr("value");
                if ($(".form-fields li coral-select[name=\"" + dfFieldName + "\"]").length) {
                    var ruleAppliedInfoTxt = 'New rule is dependent from "' +
                        $(".form-fields li coral-select[name=\"" + dfFieldName + "\"]").parent()
                            .children("label").text() +
                        '" field';
                    ruleAppliedInfoElem.children("span").text(Granite.I18n.getVar(ruleAppliedInfoTxt));
                }
            }
        }
        // For CQ-31375 - autocomplete plugin from jquery-ui get clashed with CoralUI plugin with same name, so calling
        // it with full namespace $(".coral-Autocomplete", ".tab-form-settings").autocomplete();
        new CUI.Autocomplete({
            element: ("coral-autocomplete", ".tab-form-settings"),
            multiple: true
        });
        $("#tab-edit").trigger("click");
    }

    $(document).on("propertychange keyup input paste", "#tab-name input[type=\"text\"]", function(e) {
        var activeTab = $(".formbuilder-tab-anchor.is-active");

        if (activeTab.find("button[disabled]").length) {
            $(this).val(activeTab.text());
            return;
        }

        activeTab.find("span").text($(this).val());
    });

    $(document).on("focusout", "#tab-name input[type=\"text\"]", function(e) {
        var activeTab = $(".formbuilder-tab-anchor.is-active");
        var $this = $(this);
        var val = $this.val();
        var tabCountVal = 0;

        if (val.trim() === "") {
            val = Granite.I18n.get("Unnamed") + "-" + _getUntitledTabCount();
            $this.val(val);
            activeTab.text(val);
            activeTab.append("<button class=\"close-tab-button icon-close xsmall\"></button>");
        } else {
            var otherTabs = $(".formbuilder-tab-anchor").not(".is-active");
            var duplicateCounter = 0;
            var currentTabName = val.trim();
            $.each(otherTabs, function(index, el) {
                var tabName = $(el).text().trim();
                var tabNameSplitIndex = tabName.lastIndexOf("-");
                var tabNamePrefix = tabNameSplitIndex > -1 ? tabName.substring(0, tabNameSplitIndex) : tabName;
                var tabNameSuffix = tabNameSplitIndex > -1 ? tabName.substring(tabNameSplitIndex + 1) : 0;
                if (tabNamePrefix === currentTabName) {
                    duplicateCounter++;
                    tabCountVal = parseInt(tabNameSuffix) + 1;
                }
            });

            if (duplicateCounter === 0) {
                activeTab.val(val);
                $("span", activeTab).text(val);
                $this.val(val);
            } else {
                activeTab.val(val + "-" + tabCountVal);
                $("span", activeTab).text(val + "-" + tabCountVal);
                $this.val(val + "-" + tabCountVal);
            }
        }
    });

    $(document).on("propertychange input paste", ".field-label-descriptor", function() {
        var field = $(".form-fields").find(".ui-selected")[0];
        var type = $(field).data("fieldtype");
        var f;

        if (type === "text" || type === "mvtext" ||
            type === "number" || type === "dropdown" ||
            type === "hidden" || type === "datepicker") {
            f = $(field).find(".formbuilder-content-form .coral-Form-fieldlabel");
            if (f.length) {
                f.text(this.value);
            } else if ($(field).find(".formbuilder-content-form span").length) {
            console.log("3333");
                $(field).find(".formbuilder-content-form span").text(this.value);
            } else {
            console.log("4444");
                $(field).find(".formbuilder-content-form .fieldlabel").text(this.value);
            }
        } else if (type === "section" || type === "reference" ||
            type === "referencing" || type === "pim") {
            $(field).find(".formbuilder-content-form h3").text(this.value);
        } else if (type === "checkbox") {
            f = $(field).find(".formbuilder-content-form label");
            if (f.length) {
                f.text(this.value);
            }
        }
    });

    $(document).on("propertychange input paste", ".field-placeholder-descriptor", function() {
        var field = $(".form-fields").find(".ui-selected")[0];
        var type = $(field).data("fieldtype");

        if (type === "text" || type === "number") {
            $(field).find(".formbuilder-content-form input").attr("placeholder", this.value);
        }
    });

    $(document).on("propertychange keyup input paste", ".field-default-descriptor", function() {
        var field = $(".form-fields").find(".ui-selected")[0];
        var type = $(field).data("fieldtype");

        if (type === "text" || type === "number" || type === "mvtext") {
            $(field).find('.formbuilder-content-form input[type="text"]').val(this.value);
        }
    });

    $(document).on("propertychange keyup input paste change",
        ".field-default-descriptor.default-datepicker", function() {
            var field = $(".form-fields").find(".ui-selected")[0];
            var type = $(field).data("fieldtype");

            if (type === "datepicker") {
                $(field).find(".formbuilder-content-form coral-datepicker")[0].value =
                    $(this).closest(".default-datepicker")[0].value;
                $(field).find(".formbuilder-content-properties coral-datepicker")
                    .find("input[type=\"hidden\"]")[0].value = $(this).closest(".default-datepicker")[0].value;
                $(field).find(".formbuilder-content-properties-rules coral-datepicker")
                    .find("input[type=\"hidden\"]")[0].value = $(this).closest(".default-datepicker")[0].value;
            }
        });

    $(document).on("propertychange keyup input paste", ".field-text-descriptor", function() {
        var field = $(".form-fields").find(".ui-selected")[0];
        var type = $(field).data("fieldtype");

        if (type === "checkbox") {
            var f = $(field).find(".formbuilder-content-form");
            if (!f.find(".foundation-field-edit").length) {
                f.find("coral-checkbox")[0].label.textContent = this.value;
            } else {
                f.find(".foundation-field-edit span").text(this.value);
            }
        }
    });

    $(document).on("propertychange keyup input paste", "input", function() {
        // FIXME: form gets unvalidated on changing this field
        // enable form submission again
        // NEEDS a proper fix
        // Disable wizard validations on all input fields
        $("[data-foundation-wizard-control-action=\"next\"]").removeAttr("disabled");
    });

    $(document).on("propertychange keyup input paste", ".field-instructions-descriptor", function() {
        var field = $(".form-fields").find(".ui-selected")[0];
        var type = $(field).data("fieldtype");

        if (type === "text" || type === "number") {
            $(field).find(".formbuilder-content-form input").attr("title", this.value);
        } else if (type === "section" || type === "reference") {
            $(field).find(".formbuilder-content-form span").text(this.value);
        }
    });

    $(".tab-form-settings, .tab-form-rules").on("change", "input:checkbox", function() {
        var field = $(".form-fields").find(".ui-selected")[0];
        if ($(this).is(":checked")) {
            $(field).find(".formbuilder-content-form input:checkbox").prop("checked", true);
        } else {
            $(field).find(".formbuilder-content-form input:checkbox").prop("checked", false);
        }
    });

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
        // show the warning modal

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
        if (!hasRelation()) {
            $(".ui-selected").hide();
            $(".tab-form-settings, .tab-form-rules").html(
                $("<input/>").attr({
                    type: "hidden",
                    name: target
                })
            );
            stacheFields();
            clearFields();
        } else {
            var ui = $(window).adaptTo("foundation-ui");
            var message = Granite.I18n.get("One or more field(s) are dependant on the field.");
            ui.prompt(Granite.I18n.get("Cannot Delete Field!"), message, "error", [{
                text: Granite.I18n.get("OK"),
                primary: true
            }]);
        }
    }

    function hasRelation() {
        var fieldMap = $(".editor-right .tab-form-settings input[name*='name']").val();
        if (fieldMap !== undefined) {
            var requiredRelSel = ".cq-damadmin-admin-schema-edit-form .formbuilder-tab-section li:not(.ui-selected)" +
                " .coral-Form-field[data-cascadeRequiredFrom='" + fieldMap + "']";
            var visibilityRelSel = ".cq-damadmin-admin-schema-edit-form .formbuilder-tab-section" +
                " li:not(.ui-selected) .coral-Form-field[data-cascadeVisibilityFrom='" + fieldMap + "']";
            var choiceReltaionSel = ".cq-damadmin-admin-schema-edit-form .formbuilder-tab-section" +
                " li:not(.ui-selected) .coral-Form-field[data-cascadeChoiceFrom='" + fieldMap + "']";
            var requiredRelation = $(requiredRelSel);
            var visibilityRelation = $(visibilityRelSel);
            var choiceRelation = $(choiceReltaionSel);
            if (requiredRelation.length > 0 || visibilityRelation.length > 0 || choiceRelation.length > 0) {
                return true;
            }
        }
        return false;
    }

    $(document).on("click", ".radio-choice-json", function(e) {
        if (e.target.checked, hasRelation()) {
            e.preventDefault();

            var ui = $(window).adaptTo("foundation-ui");
            var message = Granite.I18n.get("One or more field(s) are dependent on this field.");
            ui.prompt(Granite.I18n.get("Cannot Change Choice Mode!"), message, "error", [{
                text: Granite.I18n.get("OK"),
                primary: true
            }]);

            // in case the change event is handled before click (e.g. IE11). Otherwise the click is irrelevant
            $(".tab-form-settings .radio-choice-manual").click();

            return false;
        }
    });

    $(document).on("click", ".append-dropdown-option", function(e) {
        var optionId = $.now();


        var fieldId = $(this).data("target-parent");


        var target = $("#" + $(this).data("value"));


        var content = $("#dropdown-option-template").html();


        var contentAdjusted = content.replace(/&#x7b;/g, "{").replace(/&#x7d;/g, "}");


        var optionHtml = Handlebars.compile(contentAdjusted);


        var context = new Object();
        context["field_id"] = fieldId;
        context["option_id"] = optionId;
        context["value"] = $(target).val();
        var trLastPos = $(".tab-form-settings #" + $(this).data("target") + " tr:nth-last-child(1)");
        if (trLastPos.length === 0) {
            trLastPos = $(".tab-form-settings #" + $(this).data("target"));
            trLastPos.append(optionHtml(context));
        } else {
            trLastPos.after(optionHtml(context));
        }
        $(target).val("");
        e.preventDefault();
    });

    $(document).on("click", ".remove-dropdown-option", function(e) {
        var target = $(this).data("target");


        var parentTarget = $(this).data("target-parent");


        var name = $(this).data("name");

        $(parentTarget).after(
            $("<input/>").attr({
                type: "hidden",
                name: name
            })
        );
        $(target).remove();
        e.preventDefault();
    });

    // TODO Is there a way to do this without js?
//    $(document).on('propertychange keyup input paste', '.dropdown-option-value', function () {
//        $(this).siblings('.dropdown-option-text').val($(this).val());
//    });
})(window, document, Granite, Granite.$, Handlebars);
