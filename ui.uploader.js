/**
 * виджет ajax-загрузки файлов
 */
;(function($) {
// удалить теги
	$.extend(String.prototype, {stripTags: function() {
		return this.replace(/<.*?>/g, '');
	}});

	$.widget('ui.uploader', {
		options: {src: '', title: '', param: 'source', url: '', remove: ''},
	// конструктор
		_create: function() {
			$.extend(this, {
				formElement: $('<form />', {
					name: this.options.param + '-uploader',
					action: this.options.url,
					method : 'POST',
					enctype: 'multipart/form-data'
				}).appendTo(document.body),
				inputElement: $('<input />', {
					type : 'file',
					name : this.options.param,
					style: 'cursor:pointer;left:-1000px;opacity:0;filter:alpha(opacity:0);-moz-opacity:0;position:absolute;top:-1000px;z-index:1000;',
					title: this.options.title
				}).change($.proxy(this._fileOnChange, this))
			});
			this.inputElement.appendTo(this.formElement).add(this.element)
				.bind('mousemove mouseleave', $.proxy(this._onMouse, this));
			$(window).unload($.proxy(this.remove, this, null));
		},
	// деструктор
		destroy: function() {
			this.remove();
			$(window).unbind('unload', this.remove);
			this.element.unbind('mousemove', this._onMouse);
			this.formElement.remove();
		},
	// установить имя загруженного файла
		setSrc: function(src) {
			this.remove();
			return this.options.src = src.stripTags();
		},
	// разорвать связь с источником
		clear: function() {
			this.options.src = '';
		},
	// удалить загруженный файл
		remove: function(filename) {
			filename || (filename = this.options.src);
			if (filename && this.options.remove) {
				var params = {};
				params[this.options.param] = filename;
				var $el = this.element;
				$.post(this.options.remove, params, $.proxy($el.triggerHandler, $el, 'unlink', filename));
			}
		},
		_onUpload: function(filename) {
			this.setSrc(filename) && this.element.triggerHandler('upload', this.options.src);
		},
		_onMouse: function(e) {
			var $el = this.element;
			var p = $el.offset();
			$.extend(p, {right: p.left + $el.outerWidth(), bottom: p.top  + $el.outerHeight()});
			var disabled = (e.pageX < p.left) || (p.right < e.pageX) || (e.pageY < p.top) || (p.bottom < e.pageY);
			var $input = this.inputElement;
			$input.css({
				left: (disabled ? -1000 : e.pageX + 25) - $input.width(),
				top: (disabled ? -1000 : e.pageY + 10) - $input.height()
			});
			$el.toggleClass('ui-state-hover', !disabled);
		},
		_fileOnChange: function() {
			this.formElement.ajaxSubmit({
				dataType: 'text',
				resetForm: true,
				success: $.proxy(this._onUpload, this)
			});
		}
	});
})(jQuery);