/**
 * ui.uploader 1.0
 * https://github.com/gavaez/ui.uploader.git
 *
 * Copyright 2013 Aleksandr Nukitin
 */
;(function($) {
	/**
	 * Remove tags
	 */
	$.extend(String.prototype, {stripTags: function() {
		return this.replace(/<.*?>/g, '');
	}});


	$.widget('ui.uploader', {
		options: {
			src: '',
			title: '',
			param: 'source',
			url: '',
			remove: ''
		},

		/**
		 * @constructor
		 * @private
		 */
		_create: function() {
			$.extend(this, {
				formElement: $('<form>', {
					name: this.options.param + '-uploader',
					action: this.options.url,
					method : 'POST',
					enctype: 'multipart/form-data'
				}).appendTo(document.body),

				inputElement: $('<input>', {
					type : 'file',
					name : this.options.param,
					style: 'cursor:pointer;left:-1000px;opacity:0;filter:alpha(opacity:0);-moz-opacity:0;position:absolute;top:-1000px;z-index:1000;',
					title: this.options.title
				}).change($.proxy(this._fileOnChange, this))
			});

			this.inputElement.appendTo(this.formElement).add(this.element)
				.on('mousemove mouseleave', $.proxy(this._onMouse, this));

			$(window).unload($.proxy(this.remove, this, null));
		},

		/**
		 * @destructor
		 */
		destroy: function() {
			this.remove();
			$(window).unbind('unload', this.remove);
			this.element.unbind('mousemove', this._onMouse);
			this.formElement.remove();
		},

		/**
		 * Set uploaded file name
		 *
		 * @param {String} src
		 * @returns {String}
		 */
		setSrc: function(src) {
			this.remove();
			return this.options.src = src.stripTags();
		},

		/**
		 * Clear source
		 */
		clear: function() {
			this.options.src = '';
		},

		/**
		 * Remove uploaded file
		 *
		 * @param {String=} filename
		 */
		remove: function(filename) {
			filename || (filename = this.options.src);
			if (filename && this.options.remove) {
				var params = {};
				params[this.options.param] = filename;
				$.post(
					this.options.remove,
					params,
					$.proxy(this.element.triggerHandler, this.element, 'unlink', filename)
				);
			}
		},

		/**
		 * @param {String} filename
		 * @private
		 */
		_onUpload: function(filename) {
			this.setSrc(filename) && this.element.triggerHandler('upload', this.options.src);
		},

		/**
		 * @param {Event} e
		 * @private
		 */
		_onMouse: function(e) {
			var p = this.element.offset();
			$.extend(p, {right: p.left + this.element.outerWidth(), bottom: p.top  + this.element.outerHeight()});
			var disabled = (e.pageX < p.left) || (p.right < e.pageX) || (e.pageY < p.top) || (p.bottom < e.pageY);
			this.inputElement.css({
				left: (disabled ? -1000 : e.pageX + 25) - this.inputElement.width(),
				top: (disabled ? -1000 : e.pageY + 10) - this.inputElement.height()
			});
			this.element.toggleClass('ui-state-hover', !disabled);
		},

		/**
		 * @private
		 */
		_fileOnChange: function() {
			this.formElement.ajaxSubmit({
				dataType: 'text',
				resetForm: true,
				success: $.proxy(this._onUpload, this)
			});
		}
	});

})(jQuery);