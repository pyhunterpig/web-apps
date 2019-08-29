/*
 *
 * (c) Copyright Ascensio System SIA 2010-2019
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
*/
/**
 *  MatrixSpacingDialog.js
 *
 *  Created by Julia Svinareva on 29/08/19
 *  Copyright (c) 2019 Ascensio System SIA. All rights reserved.
 *
 */

define([
    'common/main/lib/component/Window',
], function () { 'use strict';

    DE.Views.MatrixSpacingDialog = Common.UI.Window.extend(_.extend({
        options: {
            width: 240,
            header: true,
            style: 'min-width: 214px;',
            cls: 'modal-dlg'
        },

        initialize : function(options) {
            _.extend(this.options, {
                title: this.textTitle
            }, options || {});

            this.template = [
                '<div class="box">',
                    '<div class="inner-content">',
                        '<div style="padding-bottom: 16px;">',
                            '<div style="display: inline-block;">',
                                '<lable style="display: block; padding-bottom: 4px; font-weight: bold;">' + this.textRowSpacing + '</lable>',
                                '<lable style="display: block; padding-bottom: 4px;">' + this.textMinimumDistanceBetweenBaselines + '</lable>',
                                '<div>',
                                    '<div style="display: inline-block; margin-right: 8px;" id="matrix-row-spacing-cmb"></div>',
                                    '<div style="display: inline-block;" id="matrix-row-spacing-spn"></div>',
                                '</div>',
                            '</div>',
                            /*'<div style="display: inline-block;"></div>',*/
                        '</div>',
                        '<div style="padding-bottom: 16px;">',
                            '<div style="display: inline-block;">',
                                '<lable style="display: block; padding-bottom: 4px; font-weight: bold;">' + this.textColumnSpacingEdges + '</lable>',
                                '<lable style="display: block; padding-bottom: 4px;">' + this.textMinimumDistanceBetweenColumnEdges + '</lable>',
                                '<div id="matrix-column-spacing-edges"></div>',
                            '</div>',
                            /*'<div style="display: inline-block;"></div>',*/
                        '</div>',
                        '<div>',
                            '<div style="display: inline-block;">',
                                '<lable style="display: block; padding-bottom: 4px; font-weight: bold;">' + this.textColumnSpacing + '</lable>',
                                '<lable style="display: block; padding-bottom: 4px;">' + this.textMinimumDistanceBetweenColumns + '</lable>',
                                '<div>',
                                    '<div style="display: inline-block; margin-right: 8px;" id="matrix-column-spacing-cmb"></div>',
                                    '<div style="display: inline-block;" id="matrix-column-spacing-spn"></div>',
                                '</div>',
                            /*'<div style="display: inline-block;"></div>',*/
                        '</div>',
                    '</div>',
                '<div class="footer center">',
                    '<button class="btn normal dlg-btn primary" result="ok" style="margin-right: 10px;">' + this.okButtonText + '</button>',
                    '<button class="btn normal dlg-btn" result="cancel">' + this.cancelButtonText + '</button>',
                '</div>'
            ].join('');

            this.options.tpl = _.template(this.template)(this.options);

            Common.UI.Window.prototype.initialize.call(this, this.options);
        },

        render: function() {
            Common.UI.Window.prototype.render.call(this);

            this.cmbRowSpacing = new Common.UI.ComboBox({
                el: $('#matrix-row-spacing-cmb'),
                cls: 'input-group-nr',
                editable: false,
                data: [],
                style: 'width: 130px;',
                menuStyle   : 'min-width: 130px;'
            });
            this.cmbRowSpacing.setValue('');
            this.cmbRowSpacing.on('selected', _.bind(this.onRowSpacingSelect, this));

            this.numRowSpacing = new Common.UI.MetricSpinner({
                el: $('#matrix-row-spacing-spn'),
                step: .01,
                width: 70,
                value: '',
                defaultUnit : "",
                maxValue: 132,
                minValue: 0.5
            });
            this.numRowSpacing.on('change', _.bind(this.onNumRowSpacingChange, this));

            this.cmbColumnSpacing = new Common.UI.ComboBox({
                el: $('#matrix-column-spacing-cmb'),
                cls: 'input-group-nr',
                editable: false,
                data: [],
                style: 'width: 130px;',
                menuStyle   : 'min-width: 130px;'
            });
            this.cmbColumnSpacing.setValue('');
            this.cmbColumnSpacing.on('selected', _.bind(this.onColumnSpacingSelect, this));

            this.numColumnSpacing = new Common.UI.MetricSpinner({
                el: $('#matrix-column-spacing-spn'),
                step: .01,
                width: 70,
                value: '',
                defaultUnit : "",
                maxValue: 132,
                minValue: 0.5
            });
            this.numColumnSpacing.on('change', _.bind(this.onNumColumnSpacingChange, this));

            this.numColumnSpacingEdges = new Common.UI.MetricSpinner({
                el: $('#matrix-column-spacing-edges'),
                step: .01,
                width: 70,
                value: '',
                defaultUnit : "",
                maxValue: 132,
                minValue: 0.5
            });
            this.numColumnSpacingEdges.on('change', _.bind(this.onNumColumnSpacingEdgesChange, this));

            var $window = this.getChild();
            $window.find('.dlg-btn').on('click', _.bind(this.onBtnClick, this));
        },

        _handleInput: function(state) {
            if (this.options.handler) {
                this.options.handler.call(this, this, state);
            }
            this.close();
        },

        onBtnClick: function(event) {
            this._handleInput(event.currentTarget.attributes['result'].value);
        },

        getSettings: function() {
            return this;
        },

        onPrimary: function() {
            this._handleInput('ok');
            return false;
        },

        onRowSpacingSelect: function() {

        },

        onNumRowSpacingChange: function() {

        },

        onColumnSpacingSelect: function() {

        },

        onNumColumnSpacingChange: function() {

        },

        onNumColumnSpacingEdgesChange: function() {

        },

        textTitle: 'Matrix Spacing',
        cancelButtonText: 'Cancel',
        okButtonText:   'Ok',
        textRowSpacing: 'RowSpacing',
        textMinimumDistanceBetweenBaselines: 'Minimum distance between baselines',
        textColumnSpacingEdges: 'Column Spacing Edges',
        textMinimumDistanceBetweenColumnEdges: 'Minimum distance between column edges',
        textColumnSpacing: 'Column Spacing',
        textMinimumDistanceBetweenColumns: 'Minimum distance between columns'

    }, DE.Views.MatrixSpacingDialog || {}))
});