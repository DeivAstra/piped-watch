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

export const INSTANCES_DEFAULT = [
	{
		"name": "kavin.rocks (Official)",
		"api_url": "https://pipedapi.kavin.rocks",
		"locations": "🇺🇸, 🇮🇳, 🇳🇱, 🇨🇦, 🇬🇧, 🇫🇷",
		"version": "2022-11-06-e95a7d0",
		"up_to_date": true,
		"cdn": true,
		"registered": 113448,
		"last_checked": 1667824878
	},
	{
		"name": "syncpundit.io",
		"api_url": "https://pipedapi.syncpundit.io",
		"locations": "🇺🇸, 🇬🇧, 🇯🇵",
		"version": "2022-11-06-e95a7d0",
		"up_to_date": true,
		"cdn": true,
		"registered": 837,
		"last_checked": 1667824985
	},
	{
		"name": "mha.fi",
		"api_url": "https://api-piped.mha.fi",
		"locations": "🇫🇮",
		"version": "2022-11-06-e95a7d0",
		"up_to_date": true,
		"cdn": true,
		"registered": 3146,
		"last_checked": 1667825049
	},
	{
		"name": "whatever.social",
		"api_url": "https://watchapi.whatever.social",
		"locations": "🇺🇸",
		"version": "2022-11-06-e95a7d0",
		"up_to_date": true,
		"cdn": true,
		"registered": 800,
		"last_checked": 1667825050
	},
	{
		"name": "garudalinux.org",
		"api_url": "https://piped-api.garudalinux.org",
		"locations": "🇫🇮",
		"version": "2022-11-04-4a95926",
		"up_to_date": false,
		"cdn": true,
		"registered": 1284,
		"last_checked": 1667825051
	},
	{
		"name": "rivo.lol",
		"api_url": "https://pipedapi.rivo.lol",
		"locations": "🇨🇱",
		"version": "2022-11-06-e95a7d0",
		"up_to_date": true,
		"cdn": true,
		"registered": 183,
		"last_checked": 1667825051
	},
	{
		"name": "aeong.one",
		"api_url": "https://pipedapi.aeong.one",
		"locations": "🇰🇷",
		"version": "2022-11-04-4a95926",
		"up_to_date": false,
		"cdn": true,
		"registered": 0,
		"last_checked": 1667825052
	},
	{
		"name": "kavin.rocks libre (Official)",
		"api_url": "https://pipedapi-libre.kavin.rocks",
		"locations": "🇳🇱",
		"version": "2022-11-06-e95a7d0",
		"up_to_date": true,
		"cdn": false,
		"registered": 113448,
		"last_checked": 1667825053
	},
	{
		"name": "jae.fi",
		"api_url": "https://api.yt.jae.fi",
		"locations": "🇫🇮",
		"version": "2022-11-06-e95a7d0",
		"up_to_date": true,
		"cdn": false,
		"registered": 3324,
		"last_checked": 1667825053
	},
	{
		"name": "il.ax",
		"api_url": "https://pa.il.ax",
		"locations": "🇺🇸",
		"version": "2022-11-06-e95a7d0",
		"up_to_date": true,
		"cdn": false,
		"registered": 2101,
		"last_checked": 1667825054
	},
	{
		"name": "esmailelbob.xyz",
		"api_url": "https://pipedapi.esmailelbob.xyz",
		"locations": "🇨🇦",
		"version": "2022-10-31-d4a935b",
		"up_to_date": false,
		"cdn": false,
		"registered": 1,
		"last_checked": 1667825085
	},
	{
		"name": "privacydev.net",
		"api_url": "https://api.piped.privacydev.net",
		"locations": "🇺🇸",
		"version": "unknown",
		"up_to_date": false,
		"cdn": false,
		"registered": 0,
		"last_checked": 1667825145
	},
	{
		"name": "smnz.de",
		"api_url": "https://pipedapi.smnz.de",
		"locations": "🇩🇪",
		"version": "2022-11-06-e95a7d0",
		"up_to_date": true,
		"cdn": false,
		"registered": 1,
		"last_checked": 1667825148
	},
	{
		"name": "adminforge.de",
		"api_url": "https://pipedapi.adminforge.de",
		"locations": "🇩🇪",
		"version": "2022-11-06-e95a7d0",
		"up_to_date": true,
		"cdn": false,
		"registered": 609,
		"last_checked": 1667825148
	},
	{
		"name": "whatevertinfoil.de",
		"api_url": "https://watchapi.whatevertinfoil.de",
		"locations": "🇩🇪",
		"version": "2022-11-06-e95a7d0",
		"up_to_date": true,
		"cdn": false,
		"registered": 300,
		"last_checked": 1667825148
	}
]
