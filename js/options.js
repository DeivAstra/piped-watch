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

import { Log, LogPanel } from './log.js';
import { fetchInstances } from './ajax.js';
import { instancesManager } from './background.js';
import { getById } from './api.js';
import { FETCH_PIPED_INSTANCES_URL } from './config.js';

const log = new Log('options');
const logPanel = new LogPanel();

document.addEventListener('DOMContentLoaded', async () => {

	const fetchUrlInput = getById("fetchUrlInput");
	fetchUrlInput.value = FETCH_PIPED_INSTANCES_URL;

	setInstancesTextareaJson(instancesManager.getDefaultInstances());

	const fetchBtn = getById("fetchBtn");
	fetchBtn.addEventListener('click', async (event) => {

		log.info('Fetch  ..');

		setInstancesTextareaText('Fetch instances. Please wait ..');

		const filteredInstances = [];
		let instancesCount;
		fetchInstances(FETCH_PIPED_INSTANCES_URL, null, {
			onFetchInstances: (instances) => {
				if(instances) {
					instancesCount = instances.length;
					appendInstancesTextareaText(`Fetched ${instancesCount} instances.`);
					appendInstancesTextareaText('Check instances ..');
					return true;
				} else
					appendInstancesTextareaText('Fetch instances failed. Connection problem? Please try later.');
			},
			onFetchInstanceStart: (instance) => {
				appendInstancesTextareaText(`${instance.api_url} : `);
			},
			onFetchInstanceEnd: (instance) => {
				if (instance.url) {
					appendInstancesTextareaText(`${instance.url}`, false);
					filteredInstances.push(instance);
				} else
					appendInstancesTextareaText('failed!', false);
				
				if (!--instancesCount) {
					setInstancesTextareaJson(filteredInstances);
				}
			}
		});
	});

	const resetBtn = getById("resetBtn");
	resetBtn.addEventListener('click', event => {
		log.info('Reset ..');
		setInstancesTextareaJson(instancesManager.getDefaultInstances());
	});

	const saveBtn = getById("saveBtn");
	saveBtn.addEventListener('click', event => {
		try {
			log.info('Save ..');
			const instances = JSON.parse(instancesTextarea.value);
			instancesManager.setInstances(instances);
			logPanel.info('Saved succesfully');
		} catch(e) {
			logPanel.error(e);
			log.error('Error while save instances', e);
		}
	});
});

function setInstancesTextareaJson(object) {
	getInstancesTextArea().value = JSON.stringify(object, null, 4);
}

function setInstancesTextareaText(text) {
	getInstancesTextArea().value = text;
}

function appendInstancesTextareaText(text, isNewLine = true) {
	getInstancesTextArea().value = getInstancesTextArea().value + ((isNewLine) ? '\n' : '') + text;
}

function instancesTextareaSelectAll() {
	getInstancesTextArea().select();
}
function instancesTextareaUnselectAll() {
	getInstancesTextArea().setSelectionRange(0, 0);
}

function getInstancesTextArea() {
	return getById("instancesTextarea");
}
