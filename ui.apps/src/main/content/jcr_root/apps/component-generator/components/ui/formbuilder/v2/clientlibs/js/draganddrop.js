/**
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2020 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 */

(function(window, document, Granite, $) {
    "use strict";

    // This class is responsible for making the metadata editor page keyboard accessible
    // and screen reader friendly.

    var iField = 0;
    var $lrContainer;

    $(document).on("foundation-contentloaded", function(e) {
        var contentForm = $(".formbuilder-content-form");
        Coral.commons.ready(contentForm, function(e) {
            var inputFields = $(".formbuilder-content-form .coral-Form-fieldwrapper input");
            var buttonFields = $(".formbuilder-content-form .coral-Form-fieldwrapper button");
            var fieldWrappers = $(".formbuilder-content-form .coral-Form-fieldwrapper");
            // put tabindex=-1 on all input and button elements inside content form
            inputFields.attr("tabindex", "-1");
            buttonFields.attr("tabindex", "-1");

            // put aria-hidden on all form-fieldwrapper elements inside content form
            // so that they are not announced by screen readers.
            fieldWrappers.attr("aria-hidden", "true");

            // set tabindex = 0 for first list item in first column
            var existingList = $(".dam-schemaeditor-panel-content section.is-active .form-fields");
            if (existingList.length > 0) {
                var firstChild = existingList.children().first();
                firstChild.attr("tabindex", "0");
            }
            setupNotifier();
        });
    });

    // for build items on right hand rail
    $(document).on("keydown", "li.ui-draggable", function(e) {
        if (e.keyCode === 38) {
            e.preventDefault();
            var prev = $(this).prev();
            if (prev.length > 0) {
                prev.attr("tabindex", "0");
                $(this).removeAttr("tabindex");
                $(this).removeAttr("aria-selected");
                prev.focus();
            }
        }
        if (e.keyCode === 40) {
            e.preventDefault();
            var next = $(this).next();
            if (next.length > 0) {
                next.attr("tabindex", "0");
                $(this).removeAttr("tabindex");
                $(this).removeAttr("aria-selected");
                next.focus();
            }
        }
    });

    // pressing space bar on right hand component should create a placeholder field on left panel.
    $(document).on("keypress", "li.ui-draggable", function(e) {
        if (e.keyCode === 32) {
            e.stopPropagation();
            var fieldType = $(this).data("fieldtype");
            $(this).attr("aria-selected", true);
            var existingList = $(".dam-schemaeditor-panel-content section.is-active .column:last .form-fields");
            if (existingList) {
                // we remove focus from any other field
                $(".form-fields > li").attr("tabindex", "-1");
                var fieldID = $.now();
                var fieldHTML = $(this).find(".field-properties").html();
                fieldHTML = fieldHTML.replace(/\{\{field_id\}\}/g, fieldID).trim();
                var newItem = "<li data-id='" + fieldID +
                            "' class='field is-selected' role='row' tabindex='0' data-fieldtype=" +
                            fieldType + ">" + fieldHTML + "</li>";
                // add the new field as the last field of the last column
                existingList.append(newItem);
                existingList.children().last().focus();
                var columnNumber = $(".dam-schemaeditor-panel-content section.is-active .column").length;
                var activeTab = $(".formbuilder-tab-anchor.is-active").text();
                var ariaLabel = Granite.I18n.get("{0} field added at the bottom of column {1} of the {2} tab, " +
                    "selected to reorder", [ fieldType, columnNumber, activeTab ]);
                notify(ariaLabel);
                $(".formbuilder-content-form .coral-Form-fieldwrapper").attr("aria-hidden", "true");
                $(".formbuilder-content-form .coral-Form-fieldwrapper input").attr("tabindex", "-1");
                $(".formbuilder-content-form .coral-Form-fieldwrapper button").attr("tabindex", "-1");
            }
        }
    });


    // form fields on left panel should be controlled by arrow keys.
    $(document).on("keydown", ".dam-schemaeditor-panel-content section.is-active .form-fields > li", function(e) {
        var prev;
        var next;
        var currentLabel;
        var ariaLabel;
        var columnNumber;
        var activeTab = $(".formbuilder-tab-anchor.is-active").text();
        // pressing space key should enable drag mode.
        // Pressing space again should drop the field at its current location.
        if (e.keyCode === 32) {
            e.preventDefault();
            if ($(this).hasClass("is-selected")) {
                removeSelection($(this));
            } else {
                $(this).addClass("is-selected");
                $(this).attr("aria-selected", "true");
                currentLabel = getLiveRegionLabel($(this));
                ariaLabel = Granite.I18n.get("{0} selected to reorder", [ currentLabel ], "current field's label");
                notify(ariaLabel);
            }
        }

        // up arrow key press
        if (e.keyCode === 38) {
            e.preventDefault();
            // it is possible that a field is deleted but still present in form as save has not been performed
            prev = getPrevVisible($(this).prev());
            if ($(this).hasClass("is-selected") && prev.length > 0) {
                var beforePrev = getPrevVisible(prev.prev());
                $(prev).before(this);
                $(this).focus();
                currentLabel = getLiveRegionLabel($(this));
                var prevLabel = getLiveRegionLabel($(prev));
                if (beforePrev.length > 0) {
                    var beforePrevLabel = getLiveRegionLabel($(beforePrev));
                    ariaLabel = Granite.I18n.get("{0} moved before {1} and after {2}",
                        [ currentLabel, prevLabel, beforePrevLabel ],
                        "current field's label, next field's label, previous field's label");
                } else {
                    columnNumber = $(this).closest(".column").index() + 1;
                    ariaLabel = Granite.I18n.get("{0} moved before {1} and to the top of column {2} of the {3} tab",
                        [ currentLabel, prevLabel, columnNumber, activeTab ],
                        "current field's label, next field's label, current column's index, selected tab's name");
                }
                notify(ariaLabel);
            } else if (prev.length > 0) {
                setTabIndex($(this), prev);
            }
        }
        // down arrow key press
        if (e.keyCode === 40) {
            e.preventDefault();
            // it is possible that a field is deleted but still present in form as save has not been performed
            next = getNextVisible($(this).next());
            if ($(this).hasClass("is-selected") && next.length > 0) {
                var afterNext = getNextVisible(next.next());
                $(next).after(this);
                $(this).focus();
                currentLabel = getLiveRegionLabel($(this));
                var nextLabel = getLiveRegionLabel($(next));
                if (afterNext.length > 0) {
                    var afterNextLabel = getLiveRegionLabel($(afterNext));
                    ariaLabel = Granite.I18n.get("{0} moved after {1} and before {2}",
                        [ currentLabel, nextLabel, afterNextLabel ],
                        "current field's label, previous field's label, next field's label");
                } else {
                    columnNumber = $(this).closest(".column").index() + 1;
                    ariaLabel = Granite.I18n.get("{0} moved after {1} and to the bottom of column {2} of the {3} tab",
                        [ currentLabel, nextLabel, columnNumber, activeTab ],
                        "current field's label, previous field's label, current column's index, selected tab's name");
                }
                notify(ariaLabel);
            } else if (next.length > 0) {
                setTabIndex($(this), next);
            }
        }
        // left arrow key press
        if (e.keyCode === 37) {
            e.preventDefault();
            prev = $(this).closest(".column").prev();
            if (prev.length > 0) {
                // if it's a selected item we want to enable drag and drop otherwise we will just shift the focus
                var prevList = prev.find(".form-fields");
                if ($(this).hasClass("is-selected")) {
                    prevList.append(this);
                    $(this).focus();
                    currentLabel = getLiveRegionLabel($(this));
                    columnNumber = prev.index() + 1;
                    ariaLabel = Granite.I18n.get("{0} moved to the bottom of column {1} of the {2} tab",
                        [ currentLabel, columnNumber, activeTab ],
                        "current field's label, target column's index, active tab's name");
                    notify(ariaLabel);
                } else {
                    prevList = prev.find(".form-fields > li").first();
                    // it is possible that a field is deleted but still present in form as save has not been performed
                    prevList = getNextVisible(prevList);
                    setTabIndex($(this), prevList);
                }
            }
        }
        // right arrow key press
        if (e.keyCode === 39) {
            e.preventDefault();
            next = $(this).closest(".column").next();
            if (next.length > 0) {
                // if it's a selected item we want to enable drag and drop otherwise we will just shift the focus
                var nextList = next.find(".form-fields");
                if ($(this).hasClass("is-selected")) {
                    nextList.append(this);
                    $(this).focus();
                    currentLabel = getLiveRegionLabel($(this));
                    columnNumber = next.index() + 1;
                    ariaLabel = Granite.I18n.get("{0} moved to the bottom of column {1} of the {2} tab",
                        [ currentLabel, columnNumber, activeTab ],
                        "current field's label, target column's index, active tab's name");
                    notify(ariaLabel);
                } else {
                    nextList = next.find(".form-fields > li").first();
                    // it is possible that a field is deleted but still present in form as save has not been performed
                    nextList = getNextVisible(nextList);
                    setTabIndex($(this), nextList);
                }
            }
        }

        // pressing tab key should disable drag-drop mode.
        if (e.keyCode === 9) {
            removeSelection($(this));
        }
    });

    $(document).on("keyup", ".dam-schemaeditor-panel-content section.is-active .form-fields > li", function(e) {
        // pressing escape should disable the drag-drop mode.
        if (e.keyCode === 27) {
            e.preventDefault();
            removeSelection($(this));
        }
    });

    $(document).on("keydown", ".formbuilder-tab-anchor", function(e) {
        // pressing tab key on a form tab should announce the first form field in this section
        // as that's the one which will be selected
        if (e.keyCode === 9) {
            var existingList = $(".dam-schemaeditor-panel-content section.is-active .form-fields");
            if (existingList.length > 0) {
                var firstChild = existingList.children().first();
                announceField(firstChild);
            }
        }
    });

    function announceField(element) {
        var ariaLabel = getLiveRegionLabel(element);
        notify(ariaLabel);
    }

    function removeSelection(elem) {
        if (elem.hasClass("is-selected")) {
            elem.removeClass("is-selected");
            elem.removeAttr("aria-selected");
        }
        var activeTab = $(".formbuilder-tab-anchor.is-active").text();
        var columnNumber = elem.closest(".column").index() + 1;
        var currentLabel = getLiveRegionLabel(elem);
        var prevElement = getPrevVisible(elem.prev());
        var nextElement = getNextVisible(elem.next());
        var ariaLabel;
        var prevLabel;
        var nextLabel;
        if (prevElement.length > 0 && nextElement.length > 0) {
            prevLabel = getLiveRegionLabel(prevElement);
            nextLabel = getLiveRegionLabel(nextElement);
            ariaLabel = Granite.I18n.get("Move Complete. {0}, unselected, inserted before {1} and after {2}",
                [ currentLabel, nextLabel, prevLabel ]);
        } else if (!prevElement.length > 0) {
            nextLabel = getLiveRegionLabel(nextElement);
            ariaLabel = Granite.I18n.get("Move Complete. {0}, unselected, inserted at the top of column {1} " +
                "of the {2} tab, above {3}", [ currentLabel, columnNumber, activeTab, nextLabel ]);
        } else if (!nextElement.length > 0) {
            prevLabel = getLiveRegionLabel(prevElement);
            ariaLabel = Granite.I18n.get("Move Complete. {0}, unselected, inserted at the bottom of column {1} " +
                "of the {2} tab, below {3}", [ currentLabel, columnNumber, activeTab, prevLabel ]);
        }
        notify(ariaLabel);
    }

    function getNextVisible(elem) {
        while (elem.length > 0) {
            if (elem.is(":visible")) {
                break;
            } else {
                elem = elem.next();
            }
        }
        return elem;
    }

    function getPrevVisible(elem) {
        while (elem.length > 0) {
            if (elem.is(":visible")) {
                break;
            } else {
                elem = elem.prev();
            }
        }
        return elem;
    }

    function setTabIndex(source, dest) {
        source.attr("tabindex", "-1");
        dest.attr("tabindex", "0");
        dest.focus();
        announceField(dest);
    }

    function getLiveRegionLabel(element) {
        var fieldTypeLabelSelector = element.find(".formbuilder-content-form").find("label:eq(0)");
        var fieldNameLabelSelector = element.find(".formbuilder-content-form").find("label:eq(1)");
        var ariaLabel = fieldNameLabelSelector.text() + fieldTypeLabelSelector.text();
        if (!ariaLabel) {
            ariaLabel = Granite.I18n.get("Unlabelled Form Field");
        }
        return ariaLabel;
    }

    function setupNotifier() {
        // Set up a live region for feedback
        $lrContainer = $("#schema_lrNotifier");
        if (!$lrContainer.length) {
            $lrContainer = $("<div></div>").attr("id", "schema_lrNotifier")
                .attr("aria-live", "polite")
                .attr("aria-relevant", "additions")
                .attr("role", "status")
                .appendTo(document.body);
        }
    }

    // changing the HTML inside a static div for everytime we want to feed screen reader something, might not work,
    // as sometimes screen readers are not triggered if only the content of element is changed.
    // so we add a new div everytime notify function is called and clean it up with a timeout.
    function notify(strFeedback) {
        if (!strFeedback) {
            return;
        }
        setTimeout(function() {
            var $fieldLabel = $("<div></div>").attr("id", "field" + iField).text(strFeedback).appendTo($lrContainer);
            iField++;
            if (iField > 1000) {
                iField = 0;
            }
            setTimeout(function() {
                clear($fieldLabel);
            }, 1000);
        }, 0);
    }

    function clear($fieldLabel) {
        // Remove message
        $fieldLabel.remove();
    }
})(window, document, Granite, Granite.$);
