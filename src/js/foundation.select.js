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

    class Select {

        constructor(select, options) {
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
                'ARROW_DOWN': 'select_down',
            });

        }

        /**
         * Initializes the plugin by setting/checking options and attributes, adding helper variables, and saving the anchor.
         * @function
         * @private
         */
        _init() {
            let $id = Foundation.GetYoDigits(6, 'select'),
                $ddId = Foundation.GetYoDigits(6, 'select-dropdown'),
                $label = $(`label[for="${this.$select.attr('id')}"]`),
                $wrapper = $('<div class="select-wrapper">'),
                $container = $('<div class="select-container">'),
                $scroll = $('<div data-perfect-scrollbar>');

            this.$select.wrap($wrapper);
            this.$select.after($container);

            this.$element = $(`<input type="text" id="${$id}" data-toggle="${$ddId}" readonly>`);
            $container.append(this.$element);
            $label.attr('for', $id);

            this.$selectTriangle = $(`<i class="select-triangle fa ${this.options.iconClass}" data-toggle="${$ddId}">`);
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

        _setOption(index, option) {
            let value = $(option).val(), text = $(option).text();
            if (value == '') {
                this.options.placeholder = this.options.placeholder == '' ? text : this.options.placeholder;
                return;
            }
            if (value == this.options.value || $(option).is(':selected')) this.$autoSelect = value;
            this.$options[value] = $(`<li><a data-value="${value}">${text}</a></li>`).appendTo(this.$list);
        }

        /**
         * Adds event listeners to the element utilizing the triggers utility library.
         * @function
         * @private
         */
        _events() {
            const _this = this;
            this.$element
                .add(this.$dropdown)
                .off('keybord.zf.dropdown')
                .on('keydown.zf.select', (e) => {
                    Foundation.Keyboard.handleKey(e, 'Select', {
                        open: () => {
                            if ($target.is(_this.$element)) {
                                _this.$dropdown.trigger('open');
                                _this.$dropdown.attr('tabindex', -1).focus();
                                e.preventDefault();
                            }
                        },
                        select_down: () => {
                            e.preventDefault();
                            const $selected = _this.$list.find('a.selected');
                            let $option;

                            if ($selected.parent().is(':last-child')) return;
                            if ($selected.length > 0) {
                                $option = $selected.parent().next().find('a');
                            }
                            else {
                                $option = _this.$list.find('li:first-child a');
                            }
                            _this.$select.val($option.data('value'));
                            _this.$element.val($option.text());
                            _this.$list.find('li a').removeClass('selected');
                            $option.addClass('selected');

                        },
                        select_up: () => {
                            e.preventDefault();
                            var $selected = _this.$list.find('a.selected'),
                                $option;
                            if ($selected.parent().is(':first-child')) return;
                            if ($selected.length > 0) {
                                $option = $selected.parent().prev().find('a');
                            }
                            else {
                                $option = _this.$list.find('li:last-child a');
                            }
                            _this.$select.val($option.data('value'));
                            _this.$element.val($option.text());
                            _this.$list.find('li a').removeClass('selected');
                            $option.addClass('selected');

                        },
                        tab: () => {
                            _this.$dropdown.trigger('close');
                        },
                        close: () => {
                            _this.$dropdown.trigger('close');
                            _this.$element.focus();
                        }
                    });
                });

            $.each(this.$options, () => {
                var $target = $(this).find('a');
                $target.on('click', (e) => _this.select(e));
            });

        }

        select(e) {
            e.preventDefault();
            const $option = $(e.currentTarget);
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
        destroy() {
            this.$wrapper.after(this.$select.detach());
            this.$wrapper.remove();

            Foundation.unregisterPlugin(this);
        }

        static get defaults() {
            return {
                iconClass: 'fa-caret-down',
                placeholder: '',
                value: ''
            };
        }
    }

    // Window exports
    Foundation.plugin(Select, 'Select');

} (jQuery);
