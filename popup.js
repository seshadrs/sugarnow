'use strict';

function getHostName(url) {
	var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
	if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
		return match[2];
	}
	else {
		return "";
	}
}

function isValidSugarmateUrl(url) {
	// TODO: better validation that won't break.
	return (getHostName(url) == "sugarmate.io") && url.includes('/api/') && url.includes('.json');
}

function saveUrlAndSetAlarm(event) {
	if (!isValidSugarmateUrl(document.getElementById('jsonUrl').value)) {
		alert('Please check the URL entered. A valid one should look something like this: https://sugarmate.io/api/v1/5d42adw/latest.json');
		return;
	}
	var unit_val='mgdl';
	if (document.getElementById("mmol").checked) {
		unit_val = 'mmol';
	}
	chrome.storage.sync.set({json_url: document.getElementById('jsonUrl').value, unit:unit_val});
	chrome.alarms.create({delayInMinutes: 0});
	alert("Great :) you'll momentarily start seeing your BG periodically updated on the icon in the preferred unit.");
	window.close();
}

function clearAlarm() {
	chrome.alarms.clearAll();
	window.close();
}

document.getElementById('saveConfig').addEventListener('click', saveUrlAndSetAlarm);

window.onload = function(){
	chrome.storage.sync.get(['json_url'], function(item) {
		if (item.json_url) {
			document.getElementById("jsonUrl").value = item.json_url;
		}
	});
	chrome.storage.sync.get(['unit'], function(item) {
		console.log(item)
		if (item.unit == 'mmol') {
			document.getElementById("mmol").checked = 'checked';
		} else {
			document.getElementById("mgdl").checked = 'checked';
		}
	});
	chrome.storage.sync.get(['latest_bg_res'], function(item) {
		if (item.latest_bg_res) {
			document.getElementById("latestBGRes").innerHTML = "Last known BG: "+item.latest_bg_res;
		}
	});
};