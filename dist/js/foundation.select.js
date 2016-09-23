'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Foundation select by Samuel Moncarey
 * Version 0.0.0
 * Licensed under MIT Open Source
 */

!function ($) {
    "use strict";

    /**
     * Select module.
     * @module foundation.select
     * @requires foundation.util.keyboard
     * @requires foundation.dropdown
     * @requires foundation.perfectScrollbar
     */

    var Select = function () {
        function Select(select, options) {
            _classCallCheck(this, Select);

            this.$select = select;

            if (!this.$select.is('select')) {
                console.warn('The select can only be used on a <select> element.');
                return;
            }

            this.options = $.extend({}, Select.defaults, this.$select.data(), options);
            this._init();

            Foundation.registerPlugin(this, 'Select');
            Foundation.Keyboard.register('Select', {
                'SPACE': 'open',
                'ESCAPE': 'close',
                'TAB': 'tab',
                'SHIFT_TAB': 'tab',
                'ARROW_UP': 'select_up',
                'ARROW_DOWN': 'select_down'
            });
        }

        /**
         * Initializes the plugin by setting/checking options and attributes, adding helper variables, and saving the anchor.
         * @function
         * @private
         */


        _createClass(Select, [{
            key: '_init',
            value: function _init() {
                var $id = Foundation.GetYoDigits(6, 'select'),
                    $ddId = Foundation.GetYoDigits(6, 'select-dropdown'),
                    $label = $('label[for="' + this.$select.attr('id') + '"]'),
                    $wrapper = $('<div class="select-wrapper">'),
                    $container = $('<div class="select-container">'),
                    $scroll = $('<div data-perfect-scrollbar>');

                this.$select.wrap($wrapper);
                this.$select.after($container);

                this.$element = $('<input type="text" id="' + $id + '" data-toggle="' + $ddId + '" readonly>');
                $container.append(this.$element);
                $label.attr('for', $id);

                this.$selectTriangle = $('<i class="select-triangle fa ' + this.options.iconClass + '" data-toggle="' + $ddId + '">');
                $container.append(this.$selectTriangle);

                this.$dropdown = $('<div>');
                this.$dropdown.attr({
                    'id': $ddId,
                    'class': 'select-dropdown',
                    'data-dropdown': '',
                    'data-v-offset': 0,
                    'data-h-offset': 0,
                    'data-close-on-click': true
                });
                this.$dropdown.append($scroll);
                $container.append(this.$dropdown);

                this.$list = $('<ul>');
                $scroll.append(this.$list);

                this.$options = {};
                this.$autoSelect = false;
                this.$select.find('option').each(this._setOption.bind(this));

                this.$element.attr('placeholder', this.options.placeholder);

                $container.foundation();

                this._events();

                if (this.$autoSelect !== false) {
                    this.$options[this.$autoSelect].find('a').trigger('click');
                }
            }
        }, {
            key: '_setOption',
            value: function _setOption(index, option) {
                var value = $(option).val(),
                    text = $(option).text();
                if (value == '') {
                    this.options.placeholder = this.options.placeholder == '' ? text : this.options.placeholder;
                    return;
                }
                if (value == this.options.value || $(option).is(':selected')) this.$autoSelect = value;
                this.$options[value] = $('<li><a data-value="' + value + '">' + text + '</a></li>').appendTo(this.$list);
            }

            /**
             * Adds event listeners to the element utilizing the triggers utility library.
             * @function
             * @private
             */

        }, {
            key: '_events',
            value: function _events() {
                var _this2 = this;

                var _this = this;
                this.$element.add(this.$dropdown).off('keybord.zf.dropdown').on('keydown.zf.select', function (e) {
                    Foundation.Keyboard.handleKey(e, 'Select', {
                        open: function open() {
                            if ($target.is(_this.$element)) {
                                _this.$dropdown.trigger('open');
                                _this.$dropdown.attr('tabindex', -1).focus();
                                e.preventDefault();
                            }
                        },
                        select_down: function select_down() {
                            e.preventDefault();
                            var $selected = _this.$list.find('a.selected');
                            var $option = void 0;

                            if ($selected.parent().is(':last-child')) return;
                            if ($selected.length > 0) {
                                $option = $selected.parent().next().find('a');
                            } else {
                                $option = _this.$list.find('li:first-child a');
                            }
                            _this.$select.val($option.data('value'));
                            _this.$element.val($option.text());
                            _this.$list.find('li a').removeClass('selected');
                            $option.addClass('selected');
                        },
                        select_up: function select_up() {
                            e.preventDefault();
                            var $selected = _this.$list.find('a.selected'),
                                $option;
                            if ($selected.parent().is(':first-child')) return;
                            if ($selected.length > 0) {
                                $option = $selected.parent().prev().find('a');
                            } else {
                                $option = _this.$list.find('li:last-child a');
                            }
                            _this.$select.val($option.data('value'));
                            _this.$element.val($option.text());
                            _this.$list.find('li a').removeClass('selected');
                            $option.addClass('selected');
                        },
                        tab: function tab() {
                            _this.$dropdown.trigger('close');
                        },
                        close: function close() {
                            _this.$dropdown.trigger('close');
                            _this.$element.focus();
                        }
                    });
                });

                $.each(this.$options, function () {
                    var $target = $(_this2).find('a');
                    $target.on('click', function (e) {
                        return _this.select(e);
                    });
                });
            }
        }, {
            key: 'select',
            value: function select(e) {
                e.preventDefault();
                var $option = $(e.currentTarget);
                this.$select.val($option.data('value'));
                this.$element.val($option.text());
                this.$list.find('li a').removeClass('selected');
                $option.addClass('selected');
                this.$dropdown.trigger('close');
                this.$element.focus();
            }

            /**
             * Destroys the select.
             * @function
             */

        }, {
            key: 'destroy',
            value: function destroy() {
                this.$wrapper.after(this.$select.detach());
                this.$wrapper.remove();

                Foundation.unregisterPlugin(this);
            }
        }], [{
            key: 'defaults',
            get: function get() {
                return {
                    iconClass: 'fa-caret-down',
                    placeholder: '',
                    value: ''
                };
            }
        }]);

        return Select;
    }();

    // Window exports


    Foundation.plugin(Select, 'Select');
}(jQuery);