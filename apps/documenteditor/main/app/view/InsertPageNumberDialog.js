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
 *  InsertPageNumberDialog.js
 *
 *  Created by Julia Svinareva on 21/09/19
 *  Copyright (c) 2019 Ascensio System SIA. All rights reserved.
 *
 */

define([
    'common/main/lib/component/Window'
], function () { 'use strict';

    DE.Views.InsertPageNumberDialog = Common.UI.Window.extend(_.extend({
        options: {
            width: 330,
            header: true,
            style: 'min-width: 338px;',
            cls: 'modal-dlg',
            id: 'window-page-number',
            buttons: ['ok', 'cancel']
        },

        initialize : function(options) {
            _.extend(this.options, {
                title: this.textTitle
            }, options || {});

            this.template = [
                '<div class="box" style="">',
                '<div style="display: inline-block; vertical-align: top; margin-bottom: 15px;">',
                    '<label>' + this.textNumberingStyle + '</label>',
                    '<div id="insert-page-number-style-list" style="height: 162px; width: 150px; margin-top: 6px;"></div>',
                '</div>',
                '<div style="display: inline-block; width: 131px; height: 184px; vertical-align: top; float: right; position: relative;">',
                    '<label style="margin-bottom: 5px;">' + this.textAlignment + '</label>',
                    '<div>',
                        '<div id="page-number-button-top-left" style="display: inline-block; margin: 0 10px 10px 0;"></div>',
                        '<div id="page-number-button-top-center" style="display: inline-block; margin: 0 10px 10px 0;"></div>',
                        '<div id="page-number-button-top-right" style="display: inline-block;"></div>',
                        '<div id="page-number-button-bottom-left" style="display: inline-block; margin: 0 10px 10px 0;"></div>',
                        '<div id="page-number-button-bottom-center" style="display: inline-block; margin: 0 10px 10px 0;"></div>',
                        '<div id="page-number-button-bottom-right" style="display: inline-block;"></div>',
                    '</div>',
                    '<button id="insert-page-number-cur-pos" class="btn btn-text-default" style="width: 131px;">' + this.textToCurrentPosition + '</button>',
                '</div>',
                '<div id="insert-page-number-checkbox" style=""></div>',
                '</div>',
            ].join('');

            this.options.tpl = _.template(this.template)(this.options);

            Common.UI.Window.prototype.initialize.call(this, this.options);
        },

        render: function() {
            Common.UI.Window.prototype.render.call(this);

            var _arrPosition = [
                [c_pageNumPosition.PAGE_NUM_POSITION_TOP,     c_pageNumPosition.PAGE_NUM_POSITION_LEFT,      'icon-right-panel btn-colontitul-tl', 'page-number-button-top-left', this.textTopLeft],
                [c_pageNumPosition.PAGE_NUM_POSITION_TOP,     c_pageNumPosition.PAGE_NUM_POSITION_CENTER,    'icon-right-panel btn-colontitul-tc', 'page-number-button-top-center', this.textTopCenter],
                [c_pageNumPosition.PAGE_NUM_POSITION_TOP,     c_pageNumPosition.PAGE_NUM_POSITION_RIGHT,     'icon-right-panel btn-colontitul-tr', 'page-number-button-top-right', this.textTopRight],
                [c_pageNumPosition.PAGE_NUM_POSITION_BOTTOM,  c_pageNumPosition.PAGE_NUM_POSITION_LEFT,      'icon-right-panel btn-colontitul-bl', 'page-number-button-bottom-left', this.textBottomLeft],
                [c_pageNumPosition.PAGE_NUM_POSITION_BOTTOM,  c_pageNumPosition.PAGE_NUM_POSITION_CENTER,    'icon-right-panel btn-colontitul-bc', 'page-number-button-bottom-center', this.textBottomCenter],
                [c_pageNumPosition.PAGE_NUM_POSITION_BOTTOM,  c_pageNumPosition.PAGE_NUM_POSITION_RIGHT,     'icon-right-panel btn-colontitul-br', 'page-number-button-bottom-right', this.textBottomRight]
            ];
            this._btnsPosition = [];
            _.each(_arrPosition, function(item, index, list){
                var _btn = new Common.UI.Button({
                    cls: 'btn-options huge',
                    iconCls: item[2],
                    posWhere:item[0],
                    posAlign:item[1],
                    hint: item[4]
                });
                _btn.render( $('#'+item[3])) ;
                _btn.on('click', _.bind(this.onPageNumberPosClick, this));
                this._btnsPosition.push( _btn );
            }, this);

            this.btnPageNumCurrentPos = new Common.UI.Button({
                el: $('#insert-page-number-cur-pos')
            });
            this.btnPageNumCurrentPos.on('click', this.onPageNumCurrentPosClick);


            var arrStyles = [
                {value: '1'},
                {value: '~1~'},
                {value: this.textPg1},
                {value: this.textPage1},
                {value: this.textPage1of10},
                {value: this.text1of10},
                {value: this.textPg1of10},
                {value: this.text1pipePage},
                {value: this.text1Pg},
                {value: '( 1 )'},
                {value: '[ 1 ]'},
                {value: '{ 1 }'},
                {value: '— 1 —'},
                {value: '| 1 |'},
                {value: '-1-'},
            ];
            this.numStylesStore = new Common.UI.DataViewStore();
            this.listNumberingStyle = new Common.UI.ListView({
                el: $('#insert-page-number-style-list', this.window),
                store: this.numStylesStore,
                itemTemplate: _.template('<div id="<%= id %>" class="list-item" style="pointer-events:none; text-align: center;"><%= value %></div>')
            });
            this.numStylesStore.reset(arrStyles);
            this.listNumberingStyle.scroller.update({alwaysVisibleY: true});

            this.chStartAt2Page = new Common.UI.CheckBox({
                el: $('#insert-page-number-checkbox'),
                labelText: this.textStartAt2Page
            });

            var $window = this.getChild();
            $window.find('.dlg-btn').on('click', _.bind(this.onBtnClick, this));
        },

        _handleInput: function(state) {
            if (this.options.handler)
                this.options.handler.call(this, this, state);
            this.close();
        },

        onBtnClick: function(event) {
            this._handleInput(event.currentTarget.attributes['result'].value);
        },

        onPrimary: function(event) {
            this._handleInput('ok');
            return false;
        },

        getSettings: function() {

            return this;
        },

        onPageNumberPosClick: function(event) {
            event.$el.parent().parent().find('.active').removeClass('active');
            event.$el.find('button').addClass('active');
        },

        onPageNumCurrentPosClick: function(event) {
            event.$el.parent().find('.active').removeClass('active');
            event.$el.toggleClass('active');
        },

        textTitle: 'Insert page number',
        textToCurrentPosition: 'To current position',
        textAlignment: 'Alignment',
        textNumberingStyle: 'Numbering style',
        textPg1: 'Pg. 1',
        textPage1: 'Page 1',
        textPage1of10: 'Page 1 of 10',
        text1of10: '1 of 10',
        textPg1of10: 'Pg. 1 of 10',
        text1pipePage: '1 | Page',
        text1Pg: '1 pg.',
        textStartAt2Page: 'Start at second page',
        textTopLeft: 'Top Left',
        textTopRight: 'Top Right',
        textTopCenter: 'Top Center',
        textBottomLeft: 'Bottom Left',
        textBottomRight: 'Bottom Right',
        textBottomCenter: 'Bottom Center'
    }, DE.Views.InsertPageNumberDialog || {}))
});