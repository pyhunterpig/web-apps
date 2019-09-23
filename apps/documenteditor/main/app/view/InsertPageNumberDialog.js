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
            width: 338,
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
                '<div style="display: inline-block; width: 130px; height: 205px; vertical-align: top;">',
                    '<label style="margin-left: 6px; margin-bottom: 2px;">' + this.textAlignment + '</label>',
                    '<div id="insert-page-number-picker-position" class="menu-pageposition"></div>',
                    '<button id="insert-page-number-cur-pos" class="btn btn-text-default" style="margin-left: 6px; margin-top: 6px; width: 117px;">' + this.textToCurrentPosition + '</button>',
                '</div>',
                '<div style="display: inline-block; height: 205px; vertical-align: top; float: right;">',
                    '<label>' + this.textNumberingStyle + '</label>',
                    '<div id="insert-page-number-style-list" style="height: 150px; width: 150px; margin-top: 5px;"></div>',
                    '<div id="insert-page-number-checkbox" style="margin-top: 12px;"></div>',
                '</div>',
                '</div>',
            ].join('');

            this.options.tpl = _.template(this.template)(this.options);

            Common.UI.Window.prototype.initialize.call(this, this.options);
        },

        render: function() {
            Common.UI.Window.prototype.render.call(this);

            this.pageNumberPosPicker = new Common.UI.DataView({
                el: $('#insert-page-number-picker-position'),
                allowScrollbar: false,
                store: new Common.UI.DataViewStore([
                    {
                        offsety: 132,
                        allowSelected: false,
                        data: {
                            type: c_pageNumPosition.PAGE_NUM_POSITION_TOP,
                            subtype: c_pageNumPosition.PAGE_NUM_POSITION_LEFT
                        }
                    },
                    {
                        offsety: 99,
                        allowSelected: false,
                        data: {
                            type: c_pageNumPosition.PAGE_NUM_POSITION_TOP,
                            subtype: c_pageNumPosition.PAGE_NUM_POSITION_CENTER
                        }
                    },
                    {
                        offsety: 66,
                        allowSelected: false,
                        data: {
                            type: c_pageNumPosition.PAGE_NUM_POSITION_TOP,
                            subtype: c_pageNumPosition.PAGE_NUM_POSITION_RIGHT
                        }
                    },
                    {
                        offsety: 33,
                        allowSelected: false,
                        data: {
                            type: c_pageNumPosition.PAGE_NUM_POSITION_BOTTOM,
                            subtype: c_pageNumPosition.PAGE_NUM_POSITION_LEFT
                        }
                    },
                    {
                        offsety: 0,
                        allowSelected: false,
                        data: {
                            type: c_pageNumPosition.PAGE_NUM_POSITION_BOTTOM,
                            subtype: c_pageNumPosition.PAGE_NUM_POSITION_CENTER
                        }
                    },
                    {
                        offsety: 165,
                        allowSelected: false,
                        data: {
                            type: c_pageNumPosition.PAGE_NUM_POSITION_BOTTOM,
                            subtype: c_pageNumPosition.PAGE_NUM_POSITION_RIGHT
                        }
                    }
                ]),
                itemTemplate: _.template('<div id="<%= id %>" class="item-pagenumber" style="background-position: 0 -<%= offsety %>px"></div>')
            });
            this.pageNumberPosPicker.on('item:click', this.onPageNumberPosClick);

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

        onPageNumberPosClick: function(picker, item, record) {
            var type = record.get('data').type,
                subtype = record.get('data').subtype;
            item.$el.parent().find('.item-pagenumber.active').removeClass('active');
            this.$el.parent().find('#insert-page-number-cur-pos').removeClass('active');
            item.$el.find('.item-pagenumber').addClass('active');
        },

        onPageNumCurrentPosClick: function(event) {
            event.$el.parent().find('.item-pagenumber.active').removeClass('active');
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
        textStartAt2Page: 'Start at 2 page'
    }, DE.Views.InsertPageNumberDialog || {}))
});