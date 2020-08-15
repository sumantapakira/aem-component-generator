/*###############################################################################
# Copyright 2020 Sumanta Pakira
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
###############################################################################*/

(function ($, ns, channel, window) {
    "use strict";
    var placeholderClass = 'cq-placeholder';
    var newComponentClass = 'new';
    var newComponentPlaceholderText = Granite.I18n.get('Drag components here');

    ns.Inspectable.prototype.hasPlaceholder = function() {
        if( !this.onPage() ) {
            return false;
        }
        if (this.dom.hasClass(newComponentClass)) {
             //return newComponentPlaceholderText;
            var editableEl = this.dom.parents(".cq-Editable-dom[data-placeholder-text],.cq-Editable-dom [data-placeholder-text]").first();
        if(editableEl.length > 0) {
            var placeholderHint = editableEl.data('placeholder-text');
             if(placeholderHint) {
                return Granite.I18n.get(placeholderHint);
            }
        }
        return newComponentPlaceholderText;
        }
        var placeholder;
        if (this.dom.hasClass(placeholderClass)) {
            placeholder = this.dom;
        } else {
            if (this.config.editConfig &&
                (this.config.editConfig.dropTarget || this.config.editConfig.inplaceEditingConfig)) {
                var inspectable = this;
                placeholder = inspectable.dom
                    .find(`.${placeholderClass}`)
                    .filter(function() {
                        return inspectable.dom.is($(this).closest(".cq-Editable-dom"));
                    });
            } else {
                placeholder = this.dom.find(`> .${placeholderClass}`);
            }
        }
        return placeholder && placeholder.length ?
            Granite.I18n.getVar(placeholder.data("emptytext")) : false;
    };
}(jQuery, Granite.author, jQuery(document)));