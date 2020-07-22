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

    var manualChoiceRadio = ".radio-choice-manual";
    var manualChoiceMarkup = ".choice-values-manual";

    var jsonChoiceRadio = ".radio-choice-json";
    var jsonChoiceMarkup = ".choice-values-json";
    var jsonPathInput = jsonChoiceMarkup + " .json-path-descriptor";

    var defaultChoiceRadio = ".default-choice-radio";
    var defaultOptionTag = "#default-option-tag";
    var defaultTag = ".default-option-tag";

    var settingsTab = ".tab-form-settings";
    var manualChoiceOnlyFields = ".editor-right .manual-options-only";
    var manualChoiceTable = ".dropdown-options";
    var manualChoiceTableRow = ".dropdown-option";

    $(document).on("change", manualChoiceRadio, function(e) {
        var key = e.target.getAttribute("key");
        var manualElement = manualChoiceMarkup + "[key='" + key + "']";
        var jsonElement = jsonChoiceMarkup + "[key='" + key + "']";
        var jsonPath = $(jsonPathInput).val();

        if (e.target.checked) {
            show(manualElement);
            hide(jsonElement);
        } else {
            hide(manualElement);
            show(jsonElement);
        }

        $("#schema-editor-settings-alert").remove();
        toggleHiddenProperty(!e.target.checked);

        if (jsonPath.length > 0) {
            showError("Settings to 'JSON Path' will be ignored when the 'Add Manually' option is checked.");
        }
    });

    $(document).on("change", jsonChoiceRadio, function(e) {
        var key = e.target.getAttribute("key");
        var manualElement = manualChoiceMarkup + "[key='" + key + "']";
        var jsonElement = jsonChoiceMarkup + "[key='" + key + "']";
        if (e.target.checked) {
            hide(manualElement);
            show(jsonElement);
        } else {
            show(manualElement);
            hide(jsonElement);
        }

        $("#schema-editor-settings-alert").remove();
        toggleHiddenProperty(e.target.checked);

        if ($(manualChoiceTable).eq(0).find(manualChoiceTableRow).length > 0) {
            showError("Changing to 'Add through JSON path' will ignore all manually added items on save.");
        }
    });

    $(document).on("change", defaultChoiceRadio, function(e) {
        var name = e.target.name;
        var defaultTag;
        var previousDefault = $(defaultChoiceRadio + ".selected[name='" + name + "']");
        if (previousDefault[0]) {
            previousDefault.removeClass("selected");
            var row = previousDefault.parents("tr");
            cleanSelectedStatus(row);
            defaultTag = row.find(defaultOptionTag);
            $(defaultTag).hide();
        }
        var target = $(e.target);
        target.addClass("selected");
        var currentRow = target.parents("tr");
        cleanSelectedStatus(currentRow);
        addSelectedStatus(currentRow);
        defaultTag = currentRow.find(defaultOptionTag);
        $(defaultTag).show();
    });

    $(document).on("click", defaultTag, function(e) {
        e.preventDefault();
        var target = $(e.target);
        var row = target.parents("tr");
        var radioButton = row.find(defaultChoiceRadio);
        var defaultTag = row.find(defaultOptionTag);
        if (radioButton[0]) {
            radioButton[0].checked = false;
        }
        if (defaultTag[0]) {
            defaultTag.removeClass("visible");
            defaultTag.addClass("hidden");
        }
        cleanSelectedStatus(row);
    });

    $(document).on("click", "#schema-editor-settings-alert button", function() {
        $("#schema-editor-settings-alert").remove();
    });

    function showError(i18nKey) {
        $("#schema-editor-settings-alert").remove();

        var alert = new Coral.Alert().set({
            id: "schema-editor-settings-alert",
            variant: Coral.Alert.variant.ERROR,
            content: {
                innerHTML: Granite.I18n.get(i18nKey)
            }
        });
        alert.setAttribute("variant", Coral.Alert.variant.ERROR);

        var closeBtn = new Coral.Button().set({
            variant: Coral.Button.variant.MINIMAL,
            icon: "close",
            iconSize: Coral.Icon.size.EXTRA_SMALL
        });

        $(closeBtn).appendTo(alert.content);
        $(settingsTab).eq(0).prepend(alert);
    }

    function cleanSelectedStatus(row) {
        var id = row.attr("id");
        var dropdownId = id.split("-")[1];
        var itemId = id.split("-")[3];
        var nodeName = "./items/" + dropdownId + "/items/" + itemId + "/selected";
        var tdNode = row.find("td#" + id);
        var existingInputNode = tdNode.find("input[name='" + nodeName + "']");
        if (existingInputNode[0]) {
            existingInputNode.remove();
        }
        var existingDeleteNode = tdNode.find("input[name='" + nodeName + "/@Delete']");
        if (!existingDeleteNode[0]) {
            var deleteNode = createHiddenInputNode(nodeName + "/@Delete");
            tdNode.append(deleteNode);
        }
    }

    function addSelectedStatus(row) {
        var id = row.attr("id");
        var dropdownId = id.split("-")[1];
        var itemId = id.split("-")[3];
        var nodeName = "./items/" + dropdownId + "/items/" + itemId + "/selected";
        var tdNode = row.find("td#".concat(id));
        var selectionNode = createHiddenInputNode(nodeName, "true");
        tdNode.append(selectionNode);
    }

    function createHiddenInputNode(name, value) {
        var node = $("<input type='hidden'/>");
        node = node.attr("name", name);
        if (value) {
            node = node.attr("value", value);
        }
        return node;
    }

    function toggleHiddenProperty(set) {
        if (set) {
            $(manualChoiceOnlyFields).attr("hidden", "hidden");
        } else {
            $(manualChoiceOnlyFields).removeAttr("hidden");
        }
    }

    function show(selector) {
        $(selector)[0].hidden = false;
    }
    function hide(selector) {
        $(selector)[0].hidden = true;
    }
})(document, Granite.$);
