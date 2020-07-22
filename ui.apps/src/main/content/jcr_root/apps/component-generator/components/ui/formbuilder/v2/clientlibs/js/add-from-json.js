(function(document, $, HTTP, i18n) {
    "use strict";

    var selectors = {
        btn: ".add-from-json-btn",
        field: ".add-from-json-field",
        fieldWrapper: ".tab-form-settings .add-from-json-wrapper",
        optionTable: ".tab-form-settings .dropdown-options",
        options: ".tab-form-settings .option-attributes"
    };
    var $doc = $(document);
    var ui = $(window).adaptTo("foundation-ui");
    var getUrl = HTTP.getContextPath() + "/libs/dam/gui/coral/components/admin/schemaforms/formbuilder/formfields/v2" +
        "/dropdownfield/dropdownitems/items.html";

    $doc.on("click", selectors.btn, function() {
        ui.wait();
        // remove previous alerts
        $("#add-from-json-alert").remove();

        var $btn = $(this);
        var $jsonPathField = $btn.prev();
        var jsonPath = $jsonPathField.val();

        // request json options
        $.get(getUrl, { jsonPath: jsonPath })
            .done(function(html) {
                if (html.trim() === "") {
                    showEmptyJsonWarning();
                    ui.clearWait();
                    return;
                }

                // replace template id by the actual field key
                var key = $(selectors.optionTable).data("listId");
                html = html.replace(/\{\{field_id\}\}/g, key);

                mergeItems($(html).filter("tr"));

                // reset 'add from json' field
                $jsonPathField.val("");
                $btn.prop("disabled", true);
            })
            .fail(function() {
                ui.clearWait();
                ui.alert(i18n("Error"), i18n("Data could not be fetched."), "error");
            });
    });

    // disallow submit if no path has been entered
    $doc.on("input", selectors.field, function() {
        $(this).next().prop("disabled", this.value.trim() === "");
    });

    /**
     * Analyses incoming options and appends non-conflicting ones. Options which value already exists
     * aren't imported.
     * @param {$} $itemRows
     */
    function mergeItems($itemRows) {
        var skippedImports = [];
        // existing options as {name: null} map
        var newOptionsMap = $(selectors.options).toArray()
            .reduce(createOptionMap, {});

        // remove duplicates from incoming options
        var $options = $itemRows.filter(function() {
            var $this = $(this);
            var text = $this.find(".dropdown-option-text").val();
            var val = $this.find(".dropdown-option-value").val();
            // check if text already exists
            var skipImport = text in newOptionsMap;

            if (skipImport) {
                // remember duplicates
                skippedImports.push([ text, val ]);
            }

            return !skipImport;
        });

        // if imports have been skipped show a warning
        if (skippedImports.length > 0) {
            showAlert(skippedImports);
        }

        var $lastChoice = $(selectors.optionTable).find("tbody .dropdown-option").last();

        if ($lastChoice.length) {
            $options.insertAfter($lastChoice);
        } else {
            $options.prependTo($(selectors.optionTable).find("tbody"));
        }
        ui.clearWait();
    }

    /**
     * Extracts values from a set of HTML elements and transforms them into a map containing the names.
     * @param {Object} map The resulting map to append new values.
     * @param {HTMLElement} newRow The HTML element to process.
     */
    function createOptionMap(map, newRow) {
        var text = $(newRow).find(".dropdown-option-text").val();

        map[text] = null;

        return map;
    }

    /**
     * Creates and displays an error box listing all duplicate options that could not be imported.
     * @param {string[][]} skippedImports [key, value] pairs.
     */
    function showAlert(skippedImports) {
        // remove previous alerts
        $("#add-from-json-alert").remove();

        var skippedImportsString = skippedImports.map(function(skipped) {
            return "(" + skipped[0] + ": " + skipped[1] + ")";
        }).join(", ");
        var showLargeError = skippedImports.length > 5;
        var alert = new Coral.Alert().set({
            id: "add-from-json-alert",
            variant: Coral.Alert.variant.ERROR,
            size: showLargeError ? Coral.Alert.size.LARGE : Coral.Alert.size.SMALL,
            header: {
                innerHTML: showLargeError ? i18n("Error").toUpperCase() : ""
            },
            content: {
                innerHTML: skippedImports.length === 1
                    ? i18n("{0} choice could not be imported: ", skippedImports.length) + skippedImportsString
                    : i18n("{0} choices could not be imported: ", skippedImports.length) + skippedImportsString
            }
        });
        $(alert).addClass("add-from-json-error")
            .attr("variant", Coral.Alert.variant.ERROR);

        var $closeBtn = createCloseButton(showLargeError).on("click", function() {
            alert.remove();
        });

        // display the close button on its own line if the large error box is used
        if (showLargeError) {
            $closeBtn = $closeBtn.wrap("<div></div>").parent();
        }

        $closeBtn.addClass("add-from-json-error-btn")
            .appendTo(alert.content);
        $(selectors.fieldWrapper).eq(0).after(alert);
    }

    /**
     * Creates a close button for the error box.
     * @param {boolean} useIcon Indicates whether to use a text or an icon.
     */
    function createCloseButton(useIcon) {
        return $(new Coral.Button().set({
            variant: Coral.Button.variant.MINIMAL,
            icon: useIcon ? "" : "close",
            iconSize: Coral.Icon.size.EXTRA_SMALL,
            label: {
                innerHTML: useIcon ? i18n("Close") : ""
            }
        }));
    }

    function showEmptyJsonWarning() {
        // remove previous alerts
        $("#add-from-json-alert").remove();

        var warning = new Coral.Alert().set({
            id: "add-from-json-alert",
            variant: Coral.Alert.variant.WARNING,
            size: Coral.Alert.size.SMALL,
            content: {
                innerHTML: i18n("The JSON does not contain any choices.")
            }
        });
        $(warning).addClass("add-from-json-error");

        var $closeBtn = createCloseButton(false).on("click", function() {
            warning.remove();
        });

        $closeBtn.addClass("add-from-json-error-btn")
            .appendTo(warning.content);
        $(selectors.fieldWrapper).eq(0).after(warning);
    }
})(document, Granite.$, Granite.HTTP, Granite.I18n.get);
