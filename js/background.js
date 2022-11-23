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

import { Log } from './log.js';
import { InstancesManager } from './api.js';
import { fetchInstanceUrl } from './ajax.js';

const log = new Log('bg');

export const instancesManager = new InstancesManager();

function removeNetRuquestRules() {
	chrome.declarativeNetRequest.getDynamicRules(rules => {
		const ruleIds = rules.map(rule => rule.id);
		chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: ruleIds});
	});
}

async function getRedirectDomain(instance) {
	if (instance.url) return new URL(instance.url).hostname;

	log.info('Instance url not defined. Instance will be fetched');

	await fillInstanceUrl(instance);
	if (instance.url)
		return new URL(instance.url).hostname;
	else
		log.error('Fill instance url failed');
}

async function fillInstanceUrl(instance) {
	return new Promise(resolve => {
		fetchInstanceUrl(instance,
			{
				onFetchInstanceStart: (instance) => {
					log.info('onFetchInstanceStart', instance)
				},
				onFetchInstanceEnd: (instance) => {
					log.info('onFetchInstanceEnd', instance)
					resolve(instance);
				}
			}
		);
	});
}

async function loadNetRuquestRules() {

	log.info('Load net request rules ..');

	const instance = await instancesManager.getSelectedInstance();

	if (!instance) {
		log.info('Instance not selected. Remove all rules.');
		removeNetRuquestRules();
		return;
	}

	const redirectDomain = await getRedirectDomain(instance);

	log.info('Redirect domain', redirectDomain);

	chrome.declarativeNetRequest.updateDynamicRules(
		{
			removeRuleIds: [1, 2],
			addRules: [
				{
					"id": 1,
					"priority": 1,
					"action": {
						"type": "redirect",
						"redirect": {
							"transform": { "scheme": "https", "host": redirectDomain }
						}
					},
					"condition": { "urlFilter": "||youtube.com/channel/", "resourceTypes": ["main_frame"] }
				},
				{
					"id": 2,
					"priority": 1,
					"action": {
						"type": "redirect",
						"redirect": {
							"transform": { "scheme": "https", "host": redirectDomain }
						}
					},
					"condition": { "urlFilter": "||youtube.com/watch?v=", "resourceTypes": ["main_frame"] }
				}
			]
		}
	);
}

(async () => {

	instancesManager.watchSelectInstance(async (instance) => {
		log.info('Selected instance changed', instance);
		await loadNetRuquestRules();
	});

	await loadNetRuquestRules();
})();
