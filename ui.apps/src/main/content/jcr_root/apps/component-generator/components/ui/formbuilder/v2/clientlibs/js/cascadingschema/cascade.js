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

(function(document, $) {
    "use strict";
    var commons;

    var ruleAppliedButtonSel = ".editor-right button.rule-applied-section";
    var ruleAppliedInfoSel = ".editor-right .rule-applied-info";
    var addChoiceRuleSel = ".editor-right button.add-choice-rule";
    var ruleAppliedSel = ".editor-right div.rule-applied-section";
    var addGeneralRuleSel = ".editor-right button.add-general-rule";

    $(document).on("foundation-contentloaded", function() {
        commons = $.DAM.MetadataSchema;
    });

    $(document).on("click", ".add-general-rule", function() {
        commons.cascadeRuleContext = $(this).data("context");
        var ruleAppliedSel = ruleAppliedButtonSel + "[data-context='" + commons.cascadeRuleContext + "']";
        if ($(ruleAppliedSel).attr("disabled") === undefined) {
            commons.intializeGeneralCascadeDialog();
            $("#cf-general-field-dropdown").attr("data-context", commons.cascadeRuleContext);
            $("#general-rule-dialog").get(0).show();

            var selectedFormfield = $(commons.ACTIVE_FIELD).find(".formbuilder-content-form .coral-Form-field");
            var cfField = $(selectedFormfield).attr(commons.CF_RULE_MAPPING[commons.cascadeRuleContext]);

            // populate the dependant from field dropdown
            commons.clearItems("#cf-general-field-dropdown");
            var dropdownFields = $(commons.ALL_INACTIVE_DROPDOWNS).has("input.radio-choice-manual[checked]");
            var dropdownItems = $("<div></div>");
            for (var i = 0; i < dropdownFields.length; i++) {
                var text = $(dropdownFields[i]).find(".formbuilder-content-form label").html();
                var value = $(dropdownFields[i]).find(".formbuilder-content-form coral-select").attr("name");
                if (value === undefined) {
                    value = $(dropdownFields[i])
                        .find(".formbuilder-content-properties .field-mvtext-descriptor input[name*='name']")
                        .attr("value");
                }
                if (text && value) {
                    dropdownItems.append(commons.createAndGetSelectItem(text,
                        value,
                        value === cfField));
                }
            }

            $("#cf-general-field-dropdown").append(dropdownItems.html());
            // populate the dependant from field values table
            commons.clearItems("#cf-general-field-values-table");
            commons.updateCfFieldTableValues(cfField);
        }
    });

    $(document).on("change", "#cf-general-field-dropdown", function() {
        commons.clearItems("#cf-general-field-values-table");
        commons.updateCfFieldTableValues($("#cf-general-field-dropdown").get(0).value);
    });

    $(document).on("click", "#save-general-rule", function() {
        // read the current changes
        var cfFieldName = $("#cf-general-field-dropdown").get(0).value;
        var tableRows = $("#cf-general-field-values-table").get(0).items.getAll();
        var cfFieldValues = [];
        for (var i = 0; i < tableRows.length; i++) {
            if (tableRows[i].classList.contains("is-selected")) {
                var value = $(tableRows[i]).find("#cf-field-value").val();
                if (value && value !== undefined) {
                    cfFieldValues.push(value);
                }
            }
        }

        // save the current changes
        var selectedFormfield = $(commons.ACTIVE_FIELD).find(".formbuilder-content-form .coral-Form-field");
        $(selectedFormfield).attr(commons.CF_RULE_MAPPING[commons.cascadeRuleContext], cfFieldName);
        $(selectedFormfield).attr(commons.CF_VALUE_SET_MAPPING[commons.cascadeRuleContext],
            cfFieldValues.join(commons.CF_VALUES_DELIMITER));
        $(".editor-right .cf-" + commons.cascadeRuleContext + "-field").val(cfFieldName);
        $(".editor-right .cf-" + commons.cascadeRuleContext + "-value-set")
            .val(cfFieldValues.join(commons.CF_VALUES_DELIMITER));

        if (cfFieldName !== "") {
            $(".editor-right .add-general-rule[icon='addCircle'][data-context='" + commons.cascadeRuleContext + "']")
                .attr("hidden", "");
            $(".editor-right .rule-applied-section[data-context='" + commons.cascadeRuleContext + "']")
                .removeAttr("hidden");
            $(ruleAppliedInfoSel + "[data-context='" + commons.cascadeRuleContext + "']").children("span").empty();
            $(ruleAppliedInfoSel + "[data-context='" + commons.cascadeRuleContext + "']").removeAttr("hidden");

            var select = $(".form-fields li coral-select[name=\"" + cfFieldName + "\"]");
            var ruleAppliedInfoTxt = select.length
                ? select.parent().children("label").text()
                : $($("#cf-general-field-dropdown").get(0).selectedItem).text();
            ruleAppliedInfoTxt = 'New rule is dependent from "' + ruleAppliedInfoTxt + '" field';

            $(ruleAppliedInfoSel + "[data-context='" + commons.cascadeRuleContext + "']")
                .children("span")
                .text(Granite.I18n.getVar(ruleAppliedInfoTxt));
        }

        // hide the dialog
        $("#general-rule-dialog").get(0).hide();
    });

    $(document).on("click", ".clear-all-general-fields", function() {
        $($("#cf-general-field-values-table").get(0).items.getAll()).removeAttr("selected");
        $("#save-general-rule").attr("disabled", "");
    });

    $(document).on("click", ".add-choice-rule", function() {
        commons.cascadeRuleContext = $(this).data("context");
        if ($(ruleAppliedButtonSel + "[data-context='choice']").attr("disabled") === undefined) {
            commons.cfValueChoices = [];
            commons.cfValueDefault = [];
            commons.checkAndUpdateCfChoiceValueItems();
            commons.intializeChoiceCascadeDialog();

            var cfChoiceDropdown = $("#cf-choice-field-dropdown").get(0);
            Coral.commons.ready(cfChoiceDropdown, function() {
                $("#cf-choice-field-dropdown").attr("data-context", "choice");
                commons.initializeCfValueChoicesArray();
                $("#choice-rule-dialog").get(0).show();

                // populate the dependant from field dropdown
                commons.clearItems("#cf-choice-field-dropdown");

                // clearing out column values
                commons.clearItems("#cf-field-value-set");
                commons.clearItems("#selected-item-value-set");
                var selectedFormfield = $(commons.ACTIVE_FIELD).find(".formbuilder-content-form .coral-Form-field");
                var cfField = $(selectedFormfield).attr(commons.CF_RULE_MAPPING[commons.cascadeRuleContext]);

                var dropdownFields = $(commons.ALL_INACTIVE_DROPDOWNS).has("input.radio-choice-manual[checked]");
                var dropdownItems = $("<div></div>");
                for (var i = 0; i < dropdownFields.length; i++) {
                    var text = $(dropdownFields[i]).find(".formbuilder-content-form label").html();
                    var value = $(dropdownFields[i]).find(".formbuilder-content-form coral-select").attr("name");
                    if (value === undefined) {
                        value = $(dropdownFields[i])
                            .find(".formbuilder-content-properties .field-mvtext-descriptor input[name*='name']")
                            .attr("value");
                    }
                    dropdownItems.append(commons.createAndGetSelectItem(text,
                        value, value === cfField && cfField !== undefined));
                }
                $("#cf-choice-field-dropdown").append(dropdownItems.html());

                // populate the dependant from field values table
                commons.updateCfFieldColumnValues(cfField);
            });
        }
    });

    $(document).on("change", "#cf-choice-field-dropdown", function() {
        commons.clearItems("#cf-field-value-set");
        commons.cfValueChoices = [];
        var dropdownValue = $("#cf-choice-field-dropdown").get(0).value;
        commons.updateCfFieldColumnValues(dropdownValue);
    });

    $(document).on("coral-columnview:activeitemchange", "#cf-column-selection", function(event) {
        // left column part
        if (event.detail.oldActiveItem && event.detail.oldActiveItem.classList.contains("cf-field-values")) {
            var oldTarget = event.detail.oldActiveItem;
            if (commons.hasSelectedItems(oldTarget)) {
                $(oldTarget).find("coral-icon").css("color", "rgba(50,110,200,0.75)");
            } else {
                $(oldTarget).find("coral-icon").css("color", "rgba(0,0,0,0.4)");
            }
            commons.updateCfValueChoicesArray(oldTarget);
        }

        // check why the column view is getting deleted
        if ($("#selected-item-value-set").length === 0) {
            $("#cf-column-selection").append('<coral-columnview-column id="selected-item-value-set">' +
                "</coral-columnview-column>");
        }
        $("#selected-item-value-set coral-columnview-column-content").html("");
        Coral.commons.ready(event.detail, function() {
            if (event.detail.activeItem && event.detail.activeItem.classList.contains("cf-field-values")) {
                var newtarget = event.target.activeItem;
                var newtargetValue = $(newtarget).attr("data-value");
                var previouslySelectedFields = (commons.cfValueChoices[newtargetValue])
                    ? commons.cfValueChoices[newtargetValue] : [];

                // list all options
                var optionText = $(".editor-right .tab-form-settings .dropdown-option-text");
                var optionValue = $(".editor-right .tab-form-settings .dropdown-option-value");
                var rightColumnContent = $("<div></div>");
                for (var i = 0; i < optionText.length; i++) {
                    var value = $(optionValue[i]).val();
                    var text = $(optionText[i]).val();
                    if (text && value) {
                        var previouslySelected = previouslySelectedFields.indexOf(value) !== -1;
                        rightColumnContent.append(commons.createAndGetColumnCtValueItem(text,
                            value,
                            newtargetValue,
                            previouslySelected));
                    }
                }

                $("#selected-item-value-set coral-columnview-column-content").append(rightColumnContent.html());
            }
        });
    });

    $(document).on("click", "#cancel-choice-rule", function() {
        commons.clearItems("#cf-field-value-set");
        commons.clearItems("#selected-item-value-set");

        $("#choice-rule-dialog").get(0).hide();
    });

    $(document).on("click", "#save-choice-rule", function() {
        // update choice array with last selected cf value item
        commons.updateCfValueChoicesArray($("#cf-field-value-set").get(0).activeItem);

        // update the cascadechoicefrom data from dropdown
        var cfFieldName = $("#cf-choice-field-dropdown").get(0).value;
        var selectedFormfield = $(commons.ACTIVE_FIELD).find(".formbuilder-content-form .coral-Form-field");
        $(selectedFormfield).attr(commons.CF_RULE_MAPPING[commons.cascadeRuleContext], cfFieldName);
        $(".editor-right .cf-choice-field").val(cfFieldName);

        // re-write cf-choice-value-item
        while ($(".editor-right #cf-choice-value-item").length !== 0) {
            $(".editor-right #cf-choice-value-items").get(0)
                .removeChild($(".editor-right #cf-choice-value-item").get(0));
        }
        for (var cfValue in commons.cfValueChoices) {
            commons.writebackCfChoice(cfValue,
                commons.cfValueChoices[cfValue],
                commons.cfValueDefault[cfValue] ? commons.cfValueDefault[cfValue] : "");
        }

        commons.clearItems("#cf-field-value-set");
        commons.clearItems("#selected-item-value-set");

        if (cfFieldName !== "") {
            $(".editor-right .add-choice-rule[icon='addCircle'][data-context='choice']").attr("hidden", "");
            $(".editor-right .rule-applied-section[data-context='choice']").removeAttr("hidden");
            $(ruleAppliedInfoSel + "[data-context='" + commons.cascadeRuleContext + "']").children("span").empty();
            $(ruleAppliedInfoSel + "[data-context='" + commons.cascadeRuleContext + "']").removeAttr("hidden");

            var select = $(".form-fields li coral-select[name=\"" + cfFieldName + "\"]");
            var ruleAppliedInfoTxt = select.length
                ? select.parent().children("label").text()
                : $($("#cf-choice-field-dropdown").get(0).selectedItem).text();
            ruleAppliedInfoTxt = 'New rule is dependent from "' + ruleAppliedInfoTxt + '" field';

            $(ruleAppliedInfoSel + "[data-context='" + commons.cascadeRuleContext + "']")
                .children("span").text(Granite.I18n.getVar(ruleAppliedInfoTxt));
        }

        $("#choice-rule-dialog").get(0).hide();
    });

    $(document).on("click", "#clear-all-choice-label", function() {
        $($("#selected-item-value-set").get(0).selectedItems).find("coral-radio").removeAttr("checked");
        $($("#selected-item-value-set").get(0).selectedItems).find("#default-tag").attr("hidden", "");
        $($("#selected-item-value-set").get(0).selectedItems).removeAttr("selected");
        commons.cfValueDefault[$(".cf-field-values.is-active").attr("data-value")] = undefined;
    });

    $(document).on("change", "#visibility-radio-group, #required-radio-group, #choice-radio-group", function(e) {
        var context = $(e.target).parent().attr("data-context");
        var addRuleButton = (context === "choice") ? ".add-choice-rule" : ".add-general-rule";
        if (e.target.value === "ruleBased") {
            $(".editor-right " + addRuleButton + "[icon='addCircle'][data-context='" + context + "']")
                .removeAttr("disabled");
            $(".editor-right .rule-applied-section[data-context='" + context + "']").removeAttr("disabled");
        } else {
            $(".editor-right " + addRuleButton + "[icon='addCircle'][data-context='" + context + "']")
                .attr("disabled", "");
            $(".editor-right .rule-applied-section[data-context='" + context + "']")
                .attr("disabled", "");
        }
    });

    $(document).on("click", ".delete-general-rule, .delete-choice-rule", function(e) {
        if ($(e.target).parent().attr("disabled") === undefined) {
            commons.cascadeRuleContext = e.target.getAttribute("data-context");
            var dialog;
            if ($("#delete-rule-dialog").length === 0) {
                dialog = new Coral.Dialog().set({
                    id: "delete-rule-dialog",
                    header: {
                        innerHTML: Granite.I18n.get("Delete Rule")
                    },
                    content: {
                        innerHTML: Granite.I18n.get("Are you sure you wanted to delete the existing rule?")
                    },
                    footer: {
                        innerHTML: '<button is="coral-button" ' +
                            'variant="secondary" class="coral-Form-field" ' +
                            'size="M" coral-close>' +
                            Granite.I18n.get("Cancel") +
                            "</button>" +
                            '<button is="coral-button" ' +
                            'class="delete-rule-button coral-Form-field" ' +
                            'variant="primary" size="M">' +
                            Granite.I18n.get("Delete") +
                            "</button>"
                    },
                    variant: "error",
                    backdrop: "static"
                });
                document.body.appendChild(dialog);
            } else {
                dialog = $("#delete-rule-dialog").get(0);
            }
            dialog.show();
        }
    });

    $(document).on("click", ".delete-rule-button", function() {
        var selectedFormfield = $(commons.ACTIVE_FIELD).find(".formbuilder-content-form .coral-Form-field");
        if (commons.cascadeRuleContext === "required" || commons.cascadeRuleContext === "visibility") {
            // unset the cf values
            $(selectedFormfield).removeAttr(commons.CF_RULE_MAPPING[commons.cascadeRuleContext]);
            $(selectedFormfield).removeAttr(commons.CF_VALUE_SET_MAPPING[commons.cascadeRuleContext]);
            $(".editor-right .cf-" + commons.cascadeRuleContext + "-field").val("");
            $(".editor-right .cf-" + commons.cascadeRuleContext + "-value-set").val("");

            // toggle the rule buttons and applied rule info
            $(ruleAppliedInfoSel + "[data-context='" + commons.cascadeRuleContext + "']").attr("hidden", "");
            $(ruleAppliedInfoSel + "[data-context='" + commons.cascadeRuleContext + "']").children("span").empty();
            $(ruleAppliedSel + "[data-context='" + commons.cascadeRuleContext + "']").attr("hidden", "");
            $(addGeneralRuleSel + "[data-context='" + commons.cascadeRuleContext + "']").removeAttr("hidden");
        } else if (commons.cascadeRuleContext === "choice") {
            // unset the values
            $(selectedFormfield).removeAttr(commons.CF_RULE_MAPPING[commons.cascadeRuleContext]);
            $(".editor-right .cf-choice-field").val("");

            while ($(".editor-right #cf-choice-value-item").length !== 0) {
                $(".editor-right #cf-choice-value-items").get(0)
                    .removeChild($(".editor-right #cf-choice-value-item").get(0));
            }

            // toggle the button and applied rule info
            $(ruleAppliedInfoSel + "[data-context='" + commons.cascadeRuleContext + "']").attr("hidden", "");
            $(ruleAppliedInfoSel + "[data-context='" + commons.cascadeRuleContext + "']").children("span").empty();
            $(ruleAppliedSel + "[data-context='" + commons.cascadeRuleContext + "']").attr("hidden", "");
            $(addChoiceRuleSel + "[data-context='" + commons.cascadeRuleContext + "']").removeAttr("hidden");
        }
        $("#delete-rule-dialog").get(0).hide();
    });

    $(document).on("mouseenter", ".editor-right .radio-label-info, .dependant-from-label-info", function(e) {
        $(e.target).parent().find("coral-tooltip").attr("open", "");
    });
    $(document).on("mouseleave", ".editor-right .radio-label-info, .dependant-from-label-info", function(e) {
        $(e.target).parent().find("coral-tooltip").removeAttr("open", "");
    });

    $(document).on("click", "#cf-general-field-dropdown, #cf-choice-field-dropdown", function(e) {
        var currentDropdown = $(e.target).closest("coral-select");
        var context = $(currentDropdown).attr("data-context");
        var currentDropdownValue = $(".editor-right .tab-form-settings input[name*='name']").val();
        commons.cfUnacceptableDropdowns = [ currentDropdownValue ];
        commons.checkForCyclicConflictFields(currentDropdownValue, context);

        var items = $(currentDropdown).get(0).items.getAll();
        for (var i = 0; i < items.length; i++) {
            if (commons.cfUnacceptableDropdowns.indexOf($(items[i]).val()) !== -1) {
                $(items[i]).attr("disabled", "");
            } else {
                $(items[i]).removeAttr("disabled");
            }
        }

        if ($(e.target).closest("coral-select").get(0).value !== "") {
            if ($("#cf-change-error").length === 0) {
                var alert = '<coral-alert id="cf-change-error" variant="error"><coral-alert-content>' +
                    Granite.I18n.get("All current settings will be lost on changing fields.") +
                    '<button is="coral-button" id="cf-change-error-close" variant="minimal" coral-close>' +
                    '<coral-icon icon="close" size="XS"></coral-icon>' +
                    "</button>" +
                    "</coral-alert-content></coral-alert>";
                var dialog = $("#general-rule-dialog.is-open");
                if (!dialog[0]) {
                    dialog = $("#choice-rule-dialog.is-open");
                }
                dialog = dialog.find("coral-dialog-content").parents("div");
                dialog.prepend(alert);
            }
            $("#cf-change-error").removeAttr("hidden");
        }
    });

    $(document).on("coral-columnview:change", "#cf-column-selection", function(event) {
        $("#selected-item-value-set div#default-radio").attr("hidden", "");
        _removeDefaultTagIfPresent(event);
        $(event.detail.selection).find("div#default-radio").removeAttr("hidden");
        commons.updateSaveChoiceRuleBtn(event);
    });

    function _removeDefaultTagIfPresent(event) {
        if (event.detail.oldSelection.length - event.detail.selection.length === 1) {
            var diff = $(event.detail.oldSelection).not(event.detail.selection);
            if (diff[0] && diff.find("#default-tag")) {
                var defaultTag = diff.find("#default-tag");
                defaultTag.remove();
            }
        }
    }

    $(document).on("click", "#default-radio", function(event) {
        var ctValueSetVal = $(event.target).closest(".ct-value-set").attr("data-value") + "']";

        $("#selected-item-value-set div#default-radio coral-radio").removeAttr("checked");
        $("#selected-item-value-set div#default-tag").attr("hidden", "");
        $("#selected-item-value-set div#ct-value-item-content").css("width", "9.5rem");

        $(".ct-value-set[data-value='" + ctValueSetVal).find("coral-radio").attr("checked", "");

        $(".ct-value-set[data-value='" + ctValueSetVal).find("div#default-tag").removeAttr("hidden");

        $(".ct-value-set[data-value='" + ctValueSetVal).find("div#ct-value-item-content").css("width", "4.5rem");

        // update default
        commons.cfValueDefault[$(".cf-field-values.is-active").attr("data-value")] =
            $(event.target).closest(".ct-value-set").attr("data-value");
    });

    $(document).on("coral-collection:remove", "#remove-default", function(event) {
        $(event.target).closest(".ct-value-set").find("#default-radio coral-radio").removeAttr("checked");
        $(event.target).closest(".ct-value-set").find("#ct-value-item-content").css("width", "9.5rem");
        commons.cfValueDefault[$(".cf-field-values.is-active").attr("data-value")] = undefined;
    });

    $(document).on("coral-overlay:close", "#choice-rule-dialog,#general-rule-dialog", function(event) {
        _removeErrorAlert();
    });

    function _removeErrorAlert() {
        var errorDialog = $("#cf-change-error");
        if (errorDialog[0] && !errorDialog[0].hidden) {
            errorDialog.remove();
        }
    }

    $(document).on("click", "#cf-general-field-values-table tbody tr", function(event) {
        commons.updateSaveGeneralRuleBtn();
    });

    $(document).on("change", ".select-all-general-fields", function(event) {
        var dependentFromDropdownVal = $("#cf-general-field-dropdown").get(0).value;
        if ((false === this.checked) || (dependentFromDropdownVal === "") ||
            (typeof (dependentFromDropdownVal) === "undefined")) {
            $("#save-general-rule").attr("disabled", "");
        } else {
            $("#save-general-rule").removeAttr("disabled");
        }
    });
})(document, Granite.$);
