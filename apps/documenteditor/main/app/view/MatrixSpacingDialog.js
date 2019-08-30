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
    'common/main/lib/component/ComboBox',
    'common/main/lib/component/MetricSpinner'
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

            //this._originalProps = new Asc.asc_CMatrixProperty(this.options.matrixProps);
            this.spinners = [];

            this.CurRowSpacing = 0; //this.options.getRowSpacing();
            this.CurColumnSpacing = 0; //this.options.getColumnSpacing();

            this._arrRowSpacing = [
                {displayValue: this.textMultiple,  defaultValue: 1, value: c_matrixRowSpacing.MULTIPLE, minValue: 0.5, step: 0.1, defaultUnit: ''},
                {displayValue: this.textExact,  defaultValue: 5, value: c_matrixRowSpacing.EXACT, minValue: 0.3, step: 0.1, defaultUnit: 'cm'}
            ];

            this._arrColumnSpacing = [
                {displayValue: this.textMultiple,  defaultValue: 1, value: c_matrixColumnSpacing.MULTIPLE, minValue: 0.5, step: 0.1, defaultUnit: ''},
                {displayValue: this.textExact,  defaultValue: 5, value: c_matrixColumnSpacing.EXACT, minValue: 0.3, step: 0.1, defaultUnit: 'cm'}
            ];

            Common.UI.Window.prototype.initialize.call(this, this.options);
        },

        render: function() {
            Common.UI.Window.prototype.render.call(this);

            this.cmbRowSpacing = new Common.UI.ComboBox({
                el: $('#matrix-row-spacing-cmb'),
                cls: 'input-group-nr',
                editable: false,
                data: this._arrRowSpacing,
                style: 'width: 130px;',
                menuStyle   : 'min-width: 130px;'
            });
            this.cmbRowSpacing.setValue('');
            this.cmbRowSpacing.on('selected', _.bind(this.onRowSpacingSelect, this));

            this.numRowSpacing = new Common.UI.MetricSpinner({
                el: $('#matrix-row-spacing-spn'),
                width: 70
            });
            this.numRowSpacing.on('change', _.bind(this.onNumRowSpacingChange, this));
            this.spinners.push(this.numRowSpacing);

            this.cmbColumnSpacing = new Common.UI.ComboBox({
                el: $('#matrix-column-spacing-cmb'),
                cls: 'input-group-nr',
                editable: false,
                data: this._arrColumnSpacing,
                style: 'width: 130px;',
                menuStyle   : 'min-width: 130px;'
            });
            this.cmbColumnSpacing.setValue('');
            this.cmbColumnSpacing.on('selected', _.bind(this.onColumnSpacingSelect, this));

            this.numColumnSpacing = new Common.UI.MetricSpinner({
                el: $('#matrix-column-spacing-spn'),
                width: 70
            });
            this.numColumnSpacing.on('change', _.bind(this.onNumColumnSpacingChange, this));
            this.spinners.push(this.numColumnSpacing);

            this.numColumnSpacingEdges = new Common.UI.MetricSpinner({
                el: $('#matrix-column-spacing-edges'),
                step: .1,
                width: 70,
                value: '',
                defaultUnit : "cm",
                maxValue: 132,
                minValue: 0.5
            });
            this.numColumnSpacingEdges.on('change', _.bind(this.onNumColumnSpacingEdgesChange, this));
            this.spinners.push(this.numColumnSpacingEdges);

            var $window = this.getChild();
            $window.find('.dlg-btn').on('click', _.bind(this.onBtnClick, this));

            this.afterRender();
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

        afterRender: function() {
            this.updateMetricUnit();
            this._setDefaults(this._originalProps);
        },

        updateMetricUnit: function() {
            if (this.spinners) {
                for (var i=0; i<this.spinners.length; i++) {
                    var spinner = this.spinners[i];
                    spinner.setDefaultUnit(Common.Utils.Metric.getCurrentMetricName());
                    spinner.setStep(Common.Utils.Metric.getCurrentMetric()==Common.Utils.Metric.c_MetricUnits.pt ? 1 : 0.1);
                }
            }
            this._arrRowSpacing[1].defaultUnit = Common.Utils.Metric.getCurrentMetricName();
            this._arrRowSpacing[1].minValue =  parseFloat(Common.Utils.Metric.fnRecalcFromMM(0.3).toFixed(2));
            this._arrRowSpacing[1].step = (Common.Utils.Metric.getCurrentMetric()==Common.Utils.Metric.c_MetricUnits.pt) ? 1 : 0.1;
            if (this.CurRowSpacing !== null) {
                this.numRowSpacing.setDefaultUnit(this._arrRowSpacing[this.CurRowSpacing].defaultUnit);
                this.numRowSpacing.setStep(this._arrRowSpacing[this.CurRowSpacing].step);
            }
            this._arrColumnSpacing[1].defaultUnit = Common.Utils.Metric.getCurrentMetricName();
            this._arrColumnSpacing[1].minValue =  parseFloat(Common.Utils.Metric.fnRecalcFromMM(0.3).toFixed(2));
            this._arrColumnSpacing[1].step = (Common.Utils.Metric.getCurrentMetric()==Common.Utils.Metric.c_MetricUnits.pt) ? 1 : 0.1;
            if (this.CurColumnSpacing !== null) {
                this.numColumnSpacing.setDefaultUnit(this._arrColumnSpacing[this.CurColumnSpacing].defaultUnit);
                this.numColumnSpacing.setStep(this._arrColumnSpacing[this.CurColumnSpacing].step);
            }
        },

        _setDefaults: function(props) {
            /*var rowSpacing = props.get_rowSpacing();
            this.cmbRowSpacing.setValue((rowSpacing !== null) ? rowSpacing : '', true);

            if(rowSpacing !== null) {
                this.numRowSpacing.setValue((rowSpacing == c_matrixRowSpacing.MULTIPLE) ? props.get_numRowSpacing() : Common.Utils.Metric.fnRecalcFromMM(props.get_numRowSpacing()), true);
            } else {
                this.numRowSpacing.setValue('', true);
            }*/

            /*var сolumnSpacing = props.get_сolumnSpacing();
            this.cmbСolumnSpacing.setValue((сolumnSpacing !== null) ? сolumnSpacing : '', true);

            if(сolumnSpacing !== null) {
                this.numСolumnSpacing.setValue((сolumnSpacing == c_matrixСolumnSpacing.MULTIPLE) ? props.get_numСolumnSpacing() : Common.Utils.Metric.fnRecalcFromMM(props.get_numСolumnSpacing()), true);
            } else {
                this.numСolumnSpacing.setValue('', true);
            }*/

            /*var columnSpacingEdges = props.get_columnSpacingEdges();
            this.numColumnSpacingEdges.setValue(columnSpacingEdges !== null ? Common.Utils.Metric.fnRecalcFromMM(columnSpacingEdges) : '', true);*/
        },

        getSettings: function() {
            return this;
        },

        onPrimary: function() {
            this._handleInput('ok');
            return false;
        },

        onRowSpacingSelect: function(combo, record) {
            this.RowSpacing = record.value;
            if ( this.CurRowSpacing !== this.RowSpacing ) {
                this.numRowSpacing.setDefaultUnit(this._arrRowSpacing[record.value].defaultUnit);
                this.numRowSpacing.setMinValue(this._arrRowSpacing[record.value].minValue);
                this.numRowSpacing.setStep(this._arrRowSpacing[record.value].step);
                if (this.RowSpacing === c_matrixRowSpacing.MULTIPLE) {
                    this.numRowSpacing.setValue(this._arrRowSpacing[record.value].defaultValue);
                } else {
                    this.numRowSpacing.setValue(Common.Utils.Metric.fnRecalcFromMM(this._arrRowSpacing[record.value].defaultValue));
                }
                this.CurRowSpacing = record.value;
            }
        },

        onNumRowSpacingChange: function(field, newValue, oldValue, eOpts) {
            /*if ( this.cmbRowSpacing.getRawValue() === '' )
                return;
            if (this.RowSpacing === null) {
                var properties = (this._originalProps) ? this._originalProps : new Asc.asc_CMatrixProperty();
                this.RowSpacing = properties.get_RowSpacing();
            }
            this.RowSpacing = (this.cmbRowSpacing.getValue() == c_matrixRowSpacing.MULTIPLE) ? field.getNumberValue() : Common.Utils.Metric.fnRecalcToMM(field.getNumberValue());*/
        },

        onColumnSpacingSelect: function(combo, record) {
            this.ColumnSpacing = record.value;
            if ( this.CurColumnSpacing !== this.ColumnSpacing ) {
                this.numColumnSpacing.setDefaultUnit(this._arrColumnSpacing[record.value].defaultUnit);
                this.numColumnSpacing.setMinValue(this._arrColumnSpacing[record.value].minValue);
                this.numColumnSpacing.setStep(this._arrColumnSpacing[record.value].step);
                if (this.ColumnSpacing === c_matrixColumnSpacing.MULTIPLE) {
                    this.numColumnSpacing.setValue(this._arrColumnSpacing[record.value].defaultValue);
                } else {
                    this.numColumnSpacing.setValue(Common.Utils.Metric.fnRecalcFromMM(this._arrColumnSpacing[record.value].defaultValue));
                }
                this.CurColumnSpacing = record.value;
            }
        },

        onNumColumnSpacingChange: function() {
            /*if ( this.cmbColumnSpacing.getRawValue() === '' )
                return;
            if (this.ColumnSpacing === null) {
                var properties = (this._originalProps) ? this._originalProps : new Asc.asc_CMatrixProperty();
                this.ColumnSpacing = properties.get_ColumnSpacing();
            }
            this.ColumnSpacing = (this.cmbColumnSpacing.getValue() == c_matrixColumnSpacing.MULTIPLE) ? field.getNumberValue() : Common.Utils.Metric.fnRecalcToMM(field.getNumberValue());*/
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
        textMinimumDistanceBetweenColumns: 'Minimum distance between columns',
        textMultiple: 'Multiple',
        textExact: 'Exactly'

    }, DE.Views.MatrixSpacingDialog || {}))
});