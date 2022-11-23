/*******************************************************************************

	Piped Watch - a browser extension for redirect YouTube videos to Piped*, an alternative frontend.
	The extension automatically redirects to Piped* sites with lightweight 
	responsive UI to increase speed and improve user convenience.

	Copyright (C) 2022 - present Deiv Astra (danykey@gmail.com)

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see {http://www.gnu.org/licenses/}.

	Home: https://github.com/deivastra/piped-watch
	Piped: https://github.com/TeamPiped
*/

'use strict';

/// Log ///

export class Log {

	isEnabled = false;
	isLogToContentPage = false;
	#source;

	constructor(source) {
		this.#source = source;
	}

	info(text, object) {
		this.#log(console.info, text, object);
	}

	warn(text, object) {
		this.#log(console.warn, text, object);
	}

	error(text, object) {
		this.#log(console.error, text, object);
	}

	#log(consoleLogFn, text, object) {
		if (!this.isEnabled) return;

		if (object)
			consoleLogFn(this.#source, text, object);
		else 
			consoleLogFn(this.#source, text);
	}

	#undefinedToNull(object) {
		for (let prop in object) {
			if (object[prop] === undefined)
				object[prop] = null;
		}
		return object;
	}
}

/// Panel ///

export class LogPanel {

	#placeholder;
	#isInited;

	#bgColor;
	#infoColor;
	#warnColor;
	#errorColor;

	#isShowCloseBtn;

	constructor(placeholder) {
		this.#placeholder = placeholder;
		this.setColors();
		this.showCloseBtn(true);
	}

	setColors(colors = {}) {
		this.#bgColor = colors.bg ? colors.bg : 'initial';
		this.#infoColor = colors.info ? colors.info : 'green';
		this.#warnColor = colors.warn ? colors.warn : 'orange';
		this.#errorColor = colors.error ? colors.error : 'red';
	}

	showCloseBtn(yes) {
		this.#isShowCloseBtn = yes;
	}

	#init(placeholder = '#logPanel') {

		if (typeof placeholder === 'string' && placeholder.startsWith('#'))
			placeholder = document.querySelector(placeholder);

		if (!placeholder)
			throw new Error('Placeholder is not defined');

		if (placeholder['tagName'] != 'DIV')
			throw new Error('Placeholder is not a DIV element');

		placeholder.style.display = 'none';
		placeholder.style.width = '100%';
		placeholder.style.maxHeight = '7em';
		placeholder.style.overflow = 'auto';
		placeholder.style.backgroundColor = this.#bgColor;

		this.#placeholder = placeholder;
		this.#isInited = true;
	}

	info(message) { this.#put(message, this.#infoColor) }
	warn(message) { this.#put(message, this.#warnColor) }
	error(message) { this.#put(message, this.#errorColor) }

	#put(message, color) {

		if (!this.#isInited) this.#init(this.#placeholder);

		const thiz = this;
		
		this.#placeholder.style.display = 'block';

		const bodyDiv = document.createElement('div');
		bodyDiv.style.color = color;
		bodyDiv.style.overflow = 'hidden';
		bodyDiv.style.lineHeight = '12px';
		this.#placeholder.appendChild(bodyDiv);

		const messageDiv = document.createElement('div');
		messageDiv.style.display = 'inline';
		messageDiv.innerHTML = message;
		bodyDiv.appendChild(messageDiv);

		if (this.#isShowCloseBtn) {
			const closeSpan = document.createElement('span');
			closeSpan.innerHTML = '  [&#128473;]';
			closeSpan.style.color = 'black';
			closeSpan.style.cursor = 'pointer';
			closeSpan.style.float = 'right';
			closeSpan.addEventListener('click', event => {
				thiz.#placeholder.removeChild(bodyDiv);
			});
			bodyDiv.appendChild(closeSpan);
		}

		this.#placeholder.scrollTop = this.#placeholder.scrollHeight;
	}

	reset() {
		if (this.#placeholder)
			this.#placeholder.innerHTML = '';
	}
}
