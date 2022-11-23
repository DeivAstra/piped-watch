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

import { fetchInstances } from './ajax.js';
import { Log } from './log.js';
import { INSTANCES_DEFAULT } from './instances.js';

const log = new Log('api');

export class InstancesRecord {

	selectedIndex;
	instances;
	date;

	constructor(selectedIndex = null, instances = null) {
		this.selectedIndex = selectedIndex;
		this.instances = instances;
		this.date = new Date();
	}
}

export class InstancesManager {

	constructor() {
		log.info(`Constructor: ${this.constructor.name}`);
	}

	async setupInstances(instancesHandler) {

		log.info('Setup instances');
	
		const instancesRecord = await this.#fetchInstancesRecord();
		log.info('Fetched instances record', instancesRecord);

		if (instancesRecord.instances) {
			log.info('Found instances', instancesRecord);
			return instancesRecord;
		} else {
			log.info('No instances. Fetch instances from server');
			fetchInstances(FETCH_PIPED_INSTANCES_URL, null, instancesHandler);
		}
	}

	getDefaultInstances() {
		return INSTANCES_DEFAULT;
	}

	async getSelectedInstance() {
		const instancesRecord = await this.#fetchInstancesRecord();
		if (instancesRecord.selectedIndex != undefined)
			return instancesRecord.instances[instancesRecord.selectedIndex];
	}

	async setSelectedInstance(instance) {
		log.info('Set selected instance', instance);
		const instancesRecord = await this.#fetchInstancesRecord();
		if (instance) {
			const instanceIndex = this.#findIndexByInstanceName(instancesRecord.instances, instance.name);
			if (!instanceIndex === undefined) 
				throw new Error(`Instance index not found for name: '${instance.name}'`);

			instancesRecord.selectedIndex = instanceIndex;
		} else {
			instancesRecord.selectedIndex = undefined;
		}
		LocalStorage.push(instancesRecord);
	}

	async getInstances() {
		const instancesRecord = await this.#fetchInstancesRecord();
		return instancesRecord.instances;
	}

	async setInstances(instances) {
		if (!instances) throw Error('Instances is null');
		if (!instances instanceof Array) throw new Error('Instances is not Array');

		log.info('Set instances', instances);

		const instancesRecord = await this.#fetchInstancesRecord();
		instancesRecord.instances = instances;
		LocalStorage.push(instancesRecord);
	}

	watchSelectInstance(callback) {
		const instancesRecord = new InstancesRecord();
		LocalStorage.watch(instancesRecord, async (instancesRecord) => {
			callback(await this.getSelectedInstance());
		});
	}

	async #fetchInstancesRecord() {
		const instancesRecord = new InstancesRecord();
		return Object.assign(instancesRecord, await LocalStorage.fetch(instancesRecord));
	}

	#findIndexByInstanceName(instances, instanceName) {
		for (var i = 0; i < instances.length; i++) {
			const instance = instances[i];
			if (instance.name == instanceName)
				return i;
		}
	}
}

/// Channel ///

export class Channel {

	constructor(sender, receiver) {
		this.sender = sender;
		this.receiver = receiver;
		this.commandListenerMap = new Map();
		this.onMessageListenerInit = false;
	}

	send(command, data={}, responseHandler) {
		Object.assign(data, {
			$sender: this.sender,
			$receiver: this.receiver,
			$command: command
		});
		chrome.runtime.sendMessage(data, responseHandler);
	}

	listen(command, callback) {
		if(!this.onMessageListenerInit) {
			this.onMessageListenerInit = true;
			this.initOnMessageListener();
		}
		this.commandListenerMap.set(command, callback);
	}

	initOnMessageListener() {

		chrome.runtime.onMessage.addListener((data, sender, sendResponse)=>{

			if (data.$sender != this.receiver || 
				data.$receiver != this.sender) return;

			if(sender['tab']) {
				Object.assign(data, {
					tabId: sender.tab.id
				});
			}

			log.info('Channel.send', data);
		
			const callback = this.commandListenerMap.get(data.$command);

			if(!callback) return;

			delete data.$sender;
			delete data.$receiver;
			delete data.$command;
			
			callback(data, sendResponse);
		});
	}
}

export class TabChannel extends Channel {

	constructor(sender) {
		super(sender, CHANNEL.TAB);
	}

	send(tabId, command, data={}, responseHandler) {
		Object.assign(data, {
			$sender: this.sender,
			$receiver: this.receiver,
			$cmd: command
		});
		chrome.tabs.sendMessage(tabId, data, responseHandler);
	}
}

/// Storage ///

export class LocalStorage {

	static #isLogEnabled = false;

	static push(bean) {

		if (!bean) throw Error('Bean is null');

		if (this.#isLogEnabled)
			log.info('Storage.push', bean);

		const keyValue = {};
		keyValue[bean.constructor.name] = bean;
		chrome.storage.local.set(keyValue);
	}

	static async fetch(bean) {

		if (!bean) throw Error('Bean is null');

		if (this.#isLogEnabled)
			log.info('Storage.fetch', bean);

		const keyValue = {};
		keyValue[bean.constructor.name] = bean;

		return (await chrome.storage.local.get(keyValue/*, (data) => {
			callback(Object.assign(bean, data[bean.constructor.name]));
		}*/))[bean.constructor.name];
	}

	static async exist(bean) {

		if (!bean) throw Error('Bean is null');
	
		const result = await fetch(bean);
		return Object.entries(result).length > 0;
	}

	static watch(bean, callback) {

		if (!bean) throw Error('Bean is null');

		chrome.storage.onChanged.addListener((changes, areaName) => {
			if (bean.constructor.name in changes) {
				callback(Object.assign(bean, changes[bean.constructor.name].newValue));
			}
		});
	}
}

/// Functions ///

export function getById(id) {
	return document.getElementById(id);
}

export function sleep (ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function resetSelect(select) {
	while (select.options.length > 0)
		select.remove(0);
}
