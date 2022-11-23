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

import { Log } from './log.js'

/// AJAX ///

const log = new Log('ajax');

const FETCH_TIMEOUT = 5000;

class FetchOptions {

	options = {
		headers: { 'User-Agent': navigator.userAgent }
	}

	constructor(options) {
		Object.assign(this.options, options);
		// set fetch timeout
		const controller = new AbortController();
		setTimeout(() => controller.abort(), FETCH_TIMEOUT);
		this.options.signal = controller.signal;
	}

	get() {
		return this.options;
	}

	put(name, value) {
		this.options[name] = value;
		return this;
	}

	putHeader(name, value) {
		this.options.headers[name] = value;
		return this;
	}
}

export async function fetchInstances(url, options, instancesHandler) {

	log.info('Fetch instances: ', url);

	const promise = (async () => {
		try {
			return (
				await fetch(url, new FetchOptions(options).get() )
			).json();
		} catch (e) {
			log.error(`Error fetch instances: ${url}`, e);
		}
	})();

	const json = await promise;

	log.info('Fetched instances', json);

	const isOk = instancesHandler.onFetchInstances(json);
	if (!isOk) return;

	// add piped page url to instances (check redirects)
	for (let i = 0; i < json.length; i++) {
		const instance = json[i];
		// setTimeout is mandatory to avoid freeze UI
		setTimeout(() => { fetchInstanceUrl(instance, instancesHandler) }, 0);
	};
}

export async function fetchInstanceUrl(instance, instanceHandler) {

	log.info('Fetch instance ', instance.api_url);

	instanceHandler.onFetchInstanceStart(instance);
	try {
		const data = await fetch(instance.api_url, new FetchOptions().get());
		if (data.status === 200 && data.url) {
			instance.url = data.url;
		}
	} catch (e) {
		log.error(`Error fetch instance: ${instance.api_url}`, e);
	}
	instanceHandler.onFetchInstanceEnd(instance);
}

// Use XHR because fetch can't handle redirect
function doXhrGet(url, onLoad) {
	const xhr = new XMLHttpRequest();
	xhr.open('get', url, false);
	xhr.onload = onLoad;
	xhr.send();
}
