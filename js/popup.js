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

import { getById, resetSelect } from './api.js';
import { fetchInstances } from './ajax.js';
import { instancesManager } from './background.js';
import { Log, LogPanel } from './log.js'
import { FETCH_PIPED_INSTANCES_URL } from './config.js';

const log = new Log('popup');

const logPanel = new LogPanel();
logPanel.setColors({ bg: 'lightgray', info: '#2e2e31' });
logPanel.showCloseBtn(false);

function setupInstances() {

	log.info('Setup instances')

	getWorkSection().style.display = 'none';
	getInstancePanel().style.display = 'none';
	getSetupSection().style.display = 'block';

	logPanel.reset();
	logPanel.info('Fetch instances list ..');

	instancesManager.setSelectedInstance(undefined);

	const filteredInstances = [];
	let instancesCount;
	fetchInstances(FETCH_PIPED_INSTANCES_URL, null, {
		onFetchInstances: (instances) => {
			if(instances) {
				instancesCount = instances.length;
				logPanel.info(`Fetched ${instancesCount} instances.`);
				logPanel.info('Check instances ..');
				return true;
			} else
				logPanel.error('Fetch instances failed. Connection problem? Press Reload to try fetch again.');
		},
		onFetchInstanceStart: (instance) => {
			logPanel.info(`> ${instance.api_url}:`);
		},
		onFetchInstanceEnd: async (instance) => {
			if (instance.url) {
				logPanel.info(`${instance.url}`);
				filteredInstances.push(instance);
			} else
				logPanel.error('failed!', false);

			if (!--instancesCount) {
				await instancesManager.setInstances(filteredInstances);
				renderWorkSection();
			}
		}
	});
}

async function renderWorkSection() {

	const instances = await instancesManager.getInstances();
	const instanceSelect = getInstanceSelect();

	resetSelect(instanceSelect);

	// append Disabled option first
	const disabledOption = document.createElement('option');
	disabledOption.text = 'Disabled';
	disabledOption.style.color = 'white';
	disabledOption.style.backgroundColor = 'tomato';
	instanceSelect.appendChild(disabledOption);

	// append instances
	instances.forEach((instance, index) => {
		const option = document.createElement('option');
		option.setAttribute('value', instance.api_url);
		option.innerHTML = ((index <= 9) ? '&nbsp;' : '') + (index + 1) + '. ' + instance.name;
		option.instance = instance;
		instanceSelect.appendChild(option);
	});

	const selectedInstance = await instancesManager.getSelectedInstance();

	log.info('selectedInstance', selectedInstance);

	if (selectedInstance) {
		instanceSelect.value = selectedInstance.api_url;
		showInstanceInfo(selectedInstance);
		getInstancePanel().style.display = 'block';
	}

	getSetupSection().style.display = 'none';
	getWorkSection().style.display = 'block';
}

document.addEventListener('DOMContentLoaded', async () => {

	const instances = await instancesManager.getInstances();

	log.info('Instances', instances);

	if (instances)
		renderWorkSection();
	else
		setupInstances();

	instanceSelect.addEventListener('change', (event) => {

		log.info('Selected instance changed', event);

		const option = event.target.selectedOptions[0];

		getInstancePanel().style.display = option.instance ? 'block' : 'none';

		const instance = option.instance;
		if (instance) {
			showInstanceInfo(instance);
			instancesManager.setSelectedInstance(instance);
		} else 
			instancesManager.setSelectedInstance(undefined);
	});

	getById('reloadBtn').addEventListener('click', () => {
		setupInstances();
	});

	getById('optionsBtn').addEventListener('click', () => {
		chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
	});

	getById('aboutBtn').addEventListener('click', () => {
		chrome.tabs.create({ 'url': 'https://github.com/deivastra/piped-watch' });
	});
});

function showInstanceInfo(instance) {
	const panel = getInstancePanel();

	const homeUrlSpan = panel.querySelector('span[data="homeUrl"]');
	const locationsSpan = panel.querySelector('span[data="locations"]');
	const registeredSpan = panel.querySelector('span[data="registered"]');
	const cdnSpan = panel.querySelector('span[data="cdn"]');
	const upToDateSpan = panel.querySelector('span[data="upToDate"]');
	const versionSpan = panel.querySelector('span[data="version"]');
	
	const url = new URL(instance.url);
	homeUrlSpan.innerHTML = `<a target="_blank" href="${instance.url}">${url.host}</a>`;
	locationsSpan.innerHTML = instance.locations;
	registeredSpan.innerHTML = instance.registered;
	cdnSpan.innerHTML = instance.cdn;
	upToDateSpan.innerHTML = instance.up_to_date;
	versionSpan.innerHTML = instance.version;
}

function removeChilds(parent) {
	while (parent.lastChild) {
		parent.removeChild(parent.lastChild);
	}
}

function getSetupSection() {
	return getById('setupSection');
}

function getWorkSection() {
	return getById('workSection');
}

function getInstanceSelect() {
	return getById('instanceSelect');
}

function getInstancePanel() {
	return getById('instancePanel');
}

function getReloadBtn() {
	return getById('reloadBtn');
}
