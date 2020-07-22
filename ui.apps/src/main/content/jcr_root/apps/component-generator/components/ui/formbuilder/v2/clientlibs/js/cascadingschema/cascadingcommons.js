/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2017 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 *
 */

(function(document, $) {
    "use strict";

    var schemaForm = ".cq-damadmin-admin-schema-edit-form";
    var contentSel = ".formbuilder-content-form";

    if ($.DAM === undefined) {
        $.DAM = {};
    }

    $.DAM.MetadataSchema = {};

    $.DAM.MetadataSchema.ACTIVE_FIELD = schemaForm + " li.ui-selected";
    $.DAM.MetadataSchema.ALL_INACTIVE_DROPDOWNS = schemaForm + " " +
        ".formbuilder-tab-section li[data-fieldtype='dropdown']:not(.ui-selected)";
    $.DAM.MetadataSchema.CF_VALUES_DELIMITER = "|";
    $.DAM.MetadataSchema.ALL_DROPDOWNS = schemaForm + " " +
        ".formbuilder-tab-section li[data-fieldtype='dropdown']";

    $.DAM.MetadataSchema.CF_RULE_MAPPING = {
        "choice": "data-cascadeChoiceFrom",
        "required": "data-cascadeRequiredFrom",
        "visibility": "data-cascadeVisibilityFrom"
    };
    $.DAM.MetadataSchema.CF_VALUE_SET_MAPPING = {
        "required": "data-cascadeRequiredValueSet",
        "visibility": "data-cascadeVisibilityValueSet"
    };

    $.DAM.MetadataSchema.cfValueChoices = [];
    $.DAM.MetadataSchema.cfValueDefault = [];
    $.DAM.MetadataSchema.cfUnacceptableDropdowns = [];
    $.DAM.MetadataSchema.cascadeRuleContext = "";
    $.DAM.MetadataSchema.generalCRInitialized = false;
    $.DAM.MetadataSchema.choiceCRInitialized = false;

    $(document).on("foundation-contentloaded", function() {
        init();
    });

    function init() {
        var formPath = $(".cq-damadmin-admin-metadata-schemaedit .foundation-content-path")
            .attr("data-foundation-content-path");
        var formFields = $($.DAM.MetadataSchema.ALL_DROPDOWNS);

        // get and append cf-choice-value-items markup wherever applicable
        for (var i = 0; i < formFields.length; i++) {
            var dropdownField = formFields[i];
            var dropdownFieldName = $(dropdownField).attr("data-id");
            if (dropdownFieldName !== undefined) {
                var fieldPath = "/items/tabs/items/tab" + getFieldPosition(dropdownField, "tab") +
                    "/items/col" + getFieldPosition(dropdownField, "column") +
                    "/items/" + dropdownFieldName;
                var cascadeItems = undefined;
                var cascadeItemDelete = "./items/" + dropdownFieldName + "/cascadeitems@Delete";
                var cascadeItemResourceType = "./items/" + dropdownFieldName + "/cascadeitems/sling:resourceType";

                if ($(dropdownField).find(".formbuilder-content-properties-rules label[for='choices'] input[name='" +
                       cascadeItemDelete + "']").length !== 0) {
                    // skip if rule set has already been added.
                    continue;
                }

                $.ajax({
                    url: "/libs/dam/gui/coral/components/admin/schemaforms/formbuilder/cascadeitems/choiceitem.html",
                    type: "GET",
                    cache: false,
                    data: {
                        "fieldPath": formPath + fieldPath,
                        "fieldName": dropdownFieldName
                    },
                    async: false
                }).done(function(data, statusText, xhr) {
                    if (xhr.status === 200) {
                        cascadeItems = data;
                    }
                });

                // no choice cascade rule set previously
                if (cascadeItems === undefined) {
                    cascadeItems = $("<div id='cf-choice-value-items'></div>");
                    cascadeItems.append($("<input type='hidden'/>").attr("name", cascadeItemDelete)
                        .attr("value", "true"));
                    cascadeItems.append($("<input type='hidden'/>")
                        .attr("name", cascadeItemResourceType)
                        .attr("value", "dam/gui/coral/components/admin/schemaforms/formbuilder/cascadeitems"));
                }

                $(dropdownField).find(".formbuilder-content-properties-rules label[for='choices']")
                    .append(cascadeItems);
            }
        }
    }

    function getFieldPosition(field, posType) {
        var col;
        var cols;

        if (posType === "column") {
            cols = $(field).closest(".panel").find(".column");
            col = $(field).closest(".column");
            return Array.from(cols).indexOf(col.get(0)) + 1;
        } else if (posType === "tab") {
            cols = $(field).closest(".dam-schemaeditor-panel-content").find(".formbuilder-tab-section");
            col = $(field).closest(".formbuilder-tab-section");
            return Array.from(cols).indexOf(col.get(0)) + 1;
        }
        return -1;
    }

    $.DAM.MetadataSchema.checkForCyclicConflictFields = function(dropdownValue, cascadeContext) {
        var formFields = $($.DAM.MetadataSchema.ALL_INACTIVE_DROPDOWNS);
        for (var i = 0; i < formFields.length; i++) {
            var field = formFields[i];
            var actualValue = $(field).find(contentSel + " .coral-Form-field")
                .attr($.DAM.MetadataSchema.CF_RULE_MAPPING[cascadeContext]);
            var fieldValue = $(field).find(".formbuilder-content-properties input[name*='name']").val();
            if ($.DAM.MetadataSchema.cfUnacceptableDropdowns.indexOf(fieldValue) === -1 &&
                actualValue === dropdownValue) {
                $.DAM.MetadataSchema.cfUnacceptableDropdowns.push(fieldValue);
                $.DAM.MetadataSchema.checkForCyclicConflictFields(fieldValue, cascadeContext);
            }
        }
    };

    $.DAM.MetadataSchema.createAndGetSelectItem = function(text, value, isSelected) {
        var item = $("<coral-select-item></coral-select-item>").attr("value", value).html(text);
        return isSelected ? item.attr("selected", "") : item;
    };

    $.DAM.MetadataSchema.createAndGetTableRowItem = function(text, value, isSelected) {
        var item = $("<tr is='coral-table-row'></tr>");
        item.append($("<td is='coral-table-cell' id='cf-general-field-value-check' coral-table-rowselect></td>")
            .append($("<coral-icon icon='check' size='M'></coral-icon>")));
        item.append($("<td is='coral-table-cell' id='cf-field-value'></td>")
            .attr("value", value).html(text));
        return isSelected ? item.attr("selected", "") : item;
    };

    $.DAM.MetadataSchema.createAndGetColumnCfValueItem = function(text, value) {
        var selectedItems = $.DAM.MetadataSchema.cfValueChoices[value];
        if (selectedItems) {
            return '<coral-columnview-item class="cf-field-values has-selected-items" ' +
                'variant="drilldown" icon="check" data-value="' + value + '">' +
                text +
                "</coral-columnview-item>";
        } else {
            return '<coral-columnview-item class="cf-field-values" variant="drilldown" ' +
                'icon="check" data-value="' + value + '">' +
                text +
                "</coral-columnview-item>";
        }
    };

    $.DAM.MetadataSchema.createAndGetColumnCtValueItem = function(text, value, cfValue, isSelected) {
        var item = '<coral-columnview-item class="ct-value-set" icon="check" ' +
            'data-value="' + value + '" ' + ((isSelected) ? "selected" : "") + ">";
        item += '<div id="ct-value-item-content">' + text + "</div>";
        item += '<div id="default-radio" ' + ((isSelected) ? "" : "hidden") + ">" +
            "<coral-radio " +
            ($.DAM.MetadataSchema.cfValueDefault[cfValue] === value ? "checked" : "") + ">" +
            "</coral-radio>" +
            "</div>";
        item += '<div id="default-tag" ' +
            ($.DAM.MetadataSchema.cfValueDefault[cfValue] === value ? "" : "hidden") + ">" +
            '<coral-taglist name="rm-default" id="remove-default">' +
            '<coral-tag closable size="S">' + Granite.I18n.get("default") + "</coral-tag>" +
            "</coral-taglist>" +
            "</div>";
        item += "</coral-columnview-item>";
        return item;
    };

    $.DAM.MetadataSchema.initializeCfValueChoicesArray = function() {
        var cfChoiceValueItems = $(".editor-right #cf-choice-value-item");
        for (var i = 0; i < cfChoiceValueItems.length; i++) {
            var cfChoiceValueItem = cfChoiceValueItems[i];
            var cfValue = $(cfChoiceValueItem).attr("data-cfvalue");
            var ctItems = $(cfChoiceValueItems[i])
                .find("input[name*='/children']:not(input[name*='/children@Delete'], " +
                    "input[name*='/children@TypeHint'])");
            for (var j = 0; j < ctItems.length; j++) {
                if ($.DAM.MetadataSchema.cfValueChoices[cfValue] !== undefined) {
                    $.DAM.MetadataSchema.cfValueChoices[cfValue].push($(ctItems[j]).val());
                } else {
                    $.DAM.MetadataSchema.cfValueChoices[cfValue] = [ $(ctItems[j]).val() ];
                }
            }
            $.DAM.MetadataSchema.cfValueDefault[cfValue] = $(cfChoiceValueItems[i])
                .find("input[name*='/default']:not(input[name*='/default@Delete'], " +
                    "input[name*='/default@TypeHint'])")
                .val();
        }
    };

    $.DAM.MetadataSchema.hasSelectedItems = function(cfValueItem) {
        if (cfValueItem && $(cfValueItem).length === 1 && $(cfValueItem).attr("data-value") !== undefined) {
            var ctValuesItems = $("#selected-item-value-set coral-columnview-item.is-selected");
            return ctValuesItems.length > 0;
        }
        return false;
    };

    $.DAM.MetadataSchema.updateCfValueChoicesArray = function(cfValueItem) {
        if (cfValueItem && $(cfValueItem).length === 1 && $(cfValueItem).attr("data-value") !== undefined) {
            var ctValuesItems = $("#selected-item-value-set coral-columnview-item.is-selected");
            var values = [];
            for (var i = 0; i < ctValuesItems.length; i++) {
                values.push($(ctValuesItems[i]).attr("data-value"));
            }
            $.DAM.MetadataSchema.cfValueChoices[$(cfValueItem).attr("data-value")] = values;
        }
    };

    $.DAM.MetadataSchema.checkAndUpdateCfChoiceValueItems = function() {
        if ($(".editor-right #cf-choice-value-items").length === 0) {
            var fieldId = $($.DAM.MetadataSchema.ACTIVE_FIELD).attr("data-id");

            var cfChoiceValueItems = $("<div id='cf-choice-value-items'></div>");
            cfChoiceValueItems
                .append($("<input type='hidden' />").attr("name", "./items/" + fieldId + "/cascadeitems@Delete")
                    .attr("value", "true"));
            cfChoiceValueItems
                .append($("<input type='hidden' />")
                    .attr("name", "./items/" + fieldId + "/cascadeitems/sling:resourceType")
                    .attr("value", "dam/gui/coral/components/admin/schemaforms/formbuilder/cascadeitems"));
            $(".editor-right .tab-form-rules label[for='choices']").append(cfChoiceValueItems);
        }
    };

    $.DAM.MetadataSchema.writebackCfChoice = function(cfValue, cfValueSet, cfValueDefault) {
        if (cfValue && cfValue !== "" && cfValueSet.length > 0) {
            var fieldId = $($.DAM.MetadataSchema.ACTIVE_FIELD).attr("data-id");
            var tempName = Math.floor(Math.random() * 1000000000000);

            var item = $("<div id='cf-choice-value-item'></div>")
                .attr("data-cfvalue", cfValue);
            item.append($("<input type='hidden'/>")
                .attr("name", "./items/" + fieldId + "/cascadeitems/" + tempName + "/@Delete")
                .attr("value", "true"));
            item.append($("<input type='hidden'/>")
                .attr("name", "./items/" + fieldId + "/cascadeitems/" + tempName + "/children@Delete")
                .attr("value", "true"));
            item.append($("<input type='hidden'/>")
                .attr("name", "./items/" + fieldId + "/cascadeitems/" + tempName + "/children@TypeHint")
                .attr("value", "String[]"));

            for (var index in cfValueSet) {
                if (cfValueSet[index] && cfValueSet[index] !== "") {
                    item.append($("<input type='hidden'/>")
                        .attr("name", "./items/" + fieldId + "/cascadeitems/" + tempName + "/children")
                        .attr("value", cfValueSet[index]));
                }
            }
            item.append($("<input type='hidden'/>")
                .attr("name", "./items/" + fieldId + "/cascadeitems/" + tempName + "/default@Delete")
                .attr("value", "true"));
            item.append($("<input type='hidden'/>")
                .attr("name", "./items/" + fieldId + "/cascadeitems/" + tempName + "/default@TypeHint")
                .attr("value", "String"));
            item.append($("<input type='hidden'/>")
                .attr("name", "./items/" + fieldId + "/cascadeitems/" + tempName + "/default")
                .attr("value", cfValueDefault));
            item.append($("<input type='hidden'/>")
                .attr("name", "./items/" + fieldId + "/cascadeitems/" + tempName + "/cfvalue@Delete")
                .attr("value", "true"));
            item.append($("<input type='hidden'/>")
                .attr("name", "./items/" + fieldId + "/cascadeitems/" + tempName + "/cfvalue@TypeHint")
                .attr("value", "String"));
            item.append($("<input type='hidden'/>")
                .attr("name", "./items/" + fieldId + "/cascadeitems/" + tempName + "/cfvalue")
                .attr("value", cfValue));

            $(".editor-right #cf-choice-value-items").append(item);
        }
    };

    $.DAM.MetadataSchema.updateCfFieldTableValues = function(dropdownValue) {
        if (dropdownValue && dropdownValue !== undefined) {
            var selectedFormfield = $($.DAM.MetadataSchema.ACTIVE_FIELD)
                .find(contentSel + " .coral-Form-field");
            var cfValueSet = $(selectedFormfield)
                .attr($.DAM.MetadataSchema.CF_VALUE_SET_MAPPING[$.DAM.MetadataSchema.cascadeRuleContext]);
            if (cfValueSet) {
                cfValueSet = cfValueSet.split($.DAM.MetadataSchema.CF_VALUES_DELIMITER);
            }

            var cfFormField = $(schemaForm + " " + contentSel +
            " coral-select[name='" + dropdownValue + "']")
                .closest("li[data-fieldtype='dropdown']");
            if (cfFormField.length === 0) {
                cfFormField = $(schemaForm).find("input[value='" + dropdownValue + "']:not(input[name*='cascade'])")
                    .closest("li[data-fieldtype='dropdown']");
            }

            var cfTable = $("#cf-general-field-values-table").get(0);
            Coral.commons.ready(cfTable, function() {
                var value;
                var text;
                // list all new options added by user in current session
                var optionText = $(cfFormField)
                    .find(".formbuilder-content-properties .dropdown > input.dropdown-option-text");
                var optionValue = $(cfFormField)
                    .find(".formbuilder-content-properties .dropdown > input.dropdown-option-value");
                for (var i = 0; i < optionText.length; i++) {
                    value = $(optionValue[i]).attr("value");
                    text = $(optionText[i]).attr("value");
                    if (text && value) {
                        cfTable.items.add($.DAM.MetadataSchema.createAndGetTableRowItem(text,
                            value,
                            !!(cfValueSet && cfValueSet.indexOf(value) !== -1)).get(0));
                    }
                }

                // list all old options from previously added by user except the one that are deleted manually
                var oldOptionTable = $(cfFormField).find(".dropdown-option");
                for (i = 0; i < oldOptionTable.length; i++) {
                    value = $(oldOptionTable[i]).find(".dropdown-option-value").attr("value");
                    text = $(oldOptionTable[i]).find(".dropdown-option-text").attr("value");
                    if (text && value) {
                        cfTable.items.add($.DAM.MetadataSchema.createAndGetTableRowItem(text,
                            value,
                            !!(cfValueSet && cfValueSet.indexOf(value) !== -1)).get(0));
                    }
                }
                $.DAM.MetadataSchema.updateSaveGeneralRuleBtn();
            });
        } else {
            $("#save-general-rule").attr("disabled", "");
        }
    };

    $.DAM.MetadataSchema.intializeGeneralCascadeDialog = function() {
        if ($.DAM.MetadataSchema.generalCRInitialized) {
            return;
        }

        var saveGeneralBtn = "<button is='coral-button' id='save-general-rule' variant='primary'" +
            " class='coral-Form-field' size='M'></button>";
        var cancelGeneralBtn = "<button is='coral-button' variant='secondary' class='coral-Form-field'" +
            " size='M'></button>";

        var actionButton = $("<div></div>");
        actionButton.append($(cancelGeneralBtn).attr("coral-close", "")
            .html(Granite.I18n.get("Cancel")));
        actionButton.append($(saveGeneralBtn)
            .html(Granite.I18n.get("Done")));

        var cfDropdownField = "<div id='cf-general-dropdown-field'></div>";
        var cfDropdownFieldValues = "<div id='cf-general-dropdown-field-values'></div>";

        // create a dialog for defining visibility and required rule, and append it to document body
        var generalRuleCascadeDialog = new Coral.Dialog().set({
            id: "general-rule-dialog",
            header: {
                innerHTML: Granite.I18n.get("Define Rule")
            },
            content: {
                innerHTML: '<div id="general-rule-dialog-content"></div>'
            },
            footer: {
                innerHTML: actionButton.html()
            },
            backdrop: "static"
        });
        $(document.body).append(generalRuleCascadeDialog);

        // adding the content section in dialog
        $("#general-rule-dialog-content").append(cfDropdownField);
        $("#general-rule-dialog-content").append(cfDropdownFieldValues);

        // adding the cf field dropdown proto
        var dependentFromDropdownLabel = '<div id="general-dropdown-label">' +
            '<label class="coral-Form-fieldlabel">' + Granite.I18n.get("Dependant On") +
            '</label><coral-icon icon="infoCircle" size="S" class="dependant-from-label-info">' +
            '</coral-icon><coral-tooltip placement="right" class="dependant-from-info-tooltip">' +
            Granite.I18n.get("All current setting will be lost on changing fields.") +
            "</coral-tooltip><div>";
        var dependentFromDropdownList = '<coral-select class="coral-Form-field" id="cf-general-field-dropdown" ' +
            'placeholder="' + Granite.I18n.get("Choose a single field") + '">' +
            "</coral-select>";
        $("#cf-general-dropdown-field").append(dependentFromDropdownLabel);
        $("#cf-general-dropdown-field").append(dependentFromDropdownList);

        // adding the cf field values proto
        var fieldValueLabel = '<label class="coral-Form-fieldlabel">' +
            Granite.I18n.get("Field values") +
            "</label>";
        var clearAllLabel = '<label class="coral-Form-fieldlabel clear-all-general-fields" ' +
            'id="clear-all-general-label">' +
            Granite.I18n.get("Clear All") +
            "</label><br>";
        var cfValuesTable = '<table is="coral-table" id="cf-general-field-values-table" ' +
            'variant="list" selectable multiple>' +
            '<thead is="coral-table-head" sticky>' +
            '<tr is="coral-table-row">' +
            '<th is="coral-table-headercell" id="cf-general-field-value-check">' +
            '<coral-checkbox class="coral-Form-field select-all-general-fields" coral-table-select>' +
            '</coral-checkbox></th><th is="coral-table-headercell">' +
            Granite.I18n.get("Title") +
            "</th>" +
            "</tr>" +
            "</thead>" +
            "</table>";
        $("#cf-general-dropdown-field-values").append(fieldValueLabel);
        $("#cf-general-dropdown-field-values").append(clearAllLabel);
        $("#cf-general-dropdown-field-values").append(cfValuesTable);

        $.DAM.MetadataSchema.generalCRInitialized = true;
    };

    $.DAM.MetadataSchema.intializeChoiceCascadeDialog = function() {
        if ($.DAM.MetadataSchema.choiceCRInitialized) {
            return;
        }

        var saveChoiceBtn = "<button is='coral-button' id='save-choice-rule' variant='primary'" +
            " class='coral-Form-field' size='M'></button>";
        var cancelChoiceBtn = "<button is='coral-button' id='cancel-choice-rule' variant='secondary'" +
            " class='coral-Form-field' size='M'></button>";
        var actionButton = $("<div></div>");
        actionButton.append($(cancelChoiceBtn)
            .html(Granite.I18n.get("Cancel")));
        actionButton.append($(saveChoiceBtn)
            .html(Granite.I18n.get("Done")));

        var cfDropdownField = "<div id='cf-choice-dropdown-field'></div>";
        var cfDropdownFieldValues = "<div id='cf-choice-dropdown-field-values'></div>";

        // create a dialog for defining visibility and required rule, and append it to document body
        var choiceRuleCascadeDialog = new Coral.Dialog().set({
            id: "choice-rule-dialog",
            header: {
                innerHTML: Granite.I18n.get("Define Rule")
            },
            content: {
                innerHTML: '<div id="choice-rule-dialog-content"></div>'
            },
            footer: {
                innerHTML: actionButton.html()
            },
            backdrop: "static"
        });
        $(document.body).append(choiceRuleCascadeDialog);

        // adding the content section in dialog
        $("#choice-rule-dialog-content").append(cfDropdownField);
        $("#choice-rule-dialog-content").append(cfDropdownFieldValues);

        // adding the cf field dropdown proto
        var dependentFromDropdownLabel = '<div id="choice-dropdown-label">';
        dependentFromDropdownLabel += '<label class="coral-Form-fieldlabel">' +
            Granite.I18n.get("Dependant On") + "</label>";
        dependentFromDropdownLabel += '<coral-icon icon="infoCircle" size="S" ' +
                                        'class="dependant-from-label-info">' +
                                        "</coral-icon>";
        dependentFromDropdownLabel += '<coral-tooltip placement="right" class="dependant-from-info-tooltip">' +
            Granite.I18n.get("All current setting will be lost on changing fields.") + "</coral-tooltip>";
        dependentFromDropdownLabel += "</div>";

        var dependentFromDropdownList = '<coral-select class="coral-Form-field" ' +
            'id="cf-choice-field-dropdown" placeholder="' +
            Granite.I18n.get("Choose a single field") + '">' +
            "</coral-select>";
        $("#cf-choice-dropdown-field").append(dependentFromDropdownLabel);
        $("#cf-choice-dropdown-field").append(dependentFromDropdownList);

        // adding cf field values proto
        var fieldValueLabel = '<label class="coral-Form-fieldlabel">' + Granite.I18n.get("Field values") + "</label>";
        var fieldChoicesLabel = '<label class="coral-Form-fieldlabel" id="choice-field-label">' +
            Granite.I18n.get("Field Choices") +
            "</label>";
        var clearAllLabel = '<label class="coral-Form-fieldlabel" id="clear-all-choice-label">' +
            Granite.I18n.get("Clear All") +
            "</label>";
        var cfValuesColumnView = '<coral-columnview id="cf-column-selection" selectionmode="multiple">' +
            '<coral-columnview-column id="cf-field-value-set"></coral-columnview-column>' +
            '<coral-columnview-column id="selected-item-value-set"></coral-columnview-column>' +
            "</coral-columnview>";
        $("#cf-choice-dropdown-field-values").append(fieldValueLabel);
        $("#cf-choice-dropdown-field-values").append(fieldChoicesLabel);
        $("#cf-choice-dropdown-field-values").append(clearAllLabel);
        $("#cf-choice-dropdown-field-values").append(cfValuesColumnView);

        $.DAM.MetadataSchema.choiceCRInitialized = true;
    };

    $.DAM.MetadataSchema.updateCfFieldColumnValues = function(dropdownValue) {
        if (dropdownValue && (typeof (dropdownValue) !== "undefined")) {
            var field = $(schemaForm + " li " + contentSel + " .coral-Form-field[name='" + dropdownValue + "']");
            if (field.length === 0) {
                field = $(schemaForm).find("input[value='" + dropdownValue + "']")
                    .closest("li[data-fieldtype='dropdown']");
            }
            if (field.length !== 0) {
                var cfFormField = $(schemaForm + " " + contentSel + "coral-select[name='" + dropdownValue + "']")
                    .closest("li[data-fieldtype='dropdown']");
                if (cfFormField.length === 0) {
                    cfFormField = $(schemaForm)
                        .find("input[value='" + dropdownValue + "']:not(input[name*='cascade'])")
                        .closest("li[data-fieldtype='dropdown']");
                }

                var optionsList = [];
                var leftColumnContent = $("<div></div>");
                var value;
                var text;

                // list all new options added by user in current session
                var optionText = $(cfFormField)
                    .find(".formbuilder-content-properties .dropdown > input.dropdown-option-text");
                var optionValue = $(cfFormField)
                    .find(".formbuilder-content-properties .dropdown > input.dropdown-option-value");
                for (var i = 0; i < optionText.length; i++) {
                    value = $(optionValue[i]).attr("value");
                    text = $(optionText[i]).attr("value");
                    if (text && value) {
                        optionsList[value] = text;
                    }
                }

                // list all old options from prevously added by user except the one that are deleted manually
                var table = $(cfFormField).find(".dropdown-option");
                for (i = 0; i < table.length; i++) {
                    value = $(table[i]).find(".dropdown-option-value").attr("value");
                    text = $(table[i]).find(".dropdown-option-text").attr("value");
                    if (text && value) {
                        optionsList[value] = text;
                    }
                }

                for (var index in optionsList) {
                    leftColumnContent
                        .append($.DAM.MetadataSchema.createAndGetColumnCfValueItem(optionsList[index], index));
                }
                $("#cf-field-value-set coral-columnview-column-content").append(leftColumnContent.html());
            }
        } else {
            $("#save-choice-rule").attr("disabled", "");
        }
    };

    $.DAM.MetadataSchema.updateSaveGeneralRuleBtn = function() {
        var selected = false;
        $.each($("#cf-general-field-values-table").get(0).items.getAll(), function(index, value) {
            if (typeof ($(value).attr("selected")) !== "undefined") {
                selected = true;
                return false;
            }
        });
        if (false === selected) {
            $("#save-general-rule").attr("disabled", "");
        } else {
            $("#save-general-rule").removeAttr("disabled");
        }
    };

    $.DAM.MetadataSchema.updateSaveChoiceRuleBtn = function(event) {
        var enableSaveChoiceRule = false;
        if ((typeof (event.target.selectedItems) !== "undefined") && (event.target.selectedItems.length > 0)) {
            var selItem = event.target.selectedItems[0];
            if ($(selItem).hasClass("ct-value-set")) {
                enableSaveChoiceRule = true;
            }
        }
        if (false === enableSaveChoiceRule) {
            var cfValueItem = $("#cf-field-value-set").get(0).activeItem;
            var key;
            if (typeof (cfValueItem) !== "undefined") {
                key = $(cfValueItem).attr("data-value");
            }
            for (var cfValue in $.DAM.MetadataSchema.cfValueChoices) {
                if ($.DAM.MetadataSchema.cfValueChoices[cfValue].length > 0) {
                    if (typeof (key) !== "undefined") {
                        if (cfValue === key) {
                            continue;
                        }
                    }
                    enableSaveChoiceRule = true;
                    break;
                }
            }
        }
        if (enableSaveChoiceRule) {
            $("#save-choice-rule").removeAttr("disabled");
        } else {
            $("#save-choice-rule").attr("disabled", "");
        }
    };

    $.DAM.MetadataSchema.clearItems = function(selector) {
        if ($(selector)[0] && $(selector)[0].items) {
            $(selector)[0].items.clear();
        }
    };
})(document, Granite.$);
