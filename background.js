function GetJSONAndUpdateBadge() {
  chrome.storage.sync.get(null, function(item) {
      var Httpreq = new XMLHttpRequest();
      Httpreq.open("GET", item.json_url, false);
      Httpreq.send(null);
      res = JSON.parse(Httpreq.responseText);

      // console.log(res)

      // TODO: Stay in black for gradual up/down trend and orange for steeper trends.
      if (res['reading'].includes('[OLD]')) {
        chrome.browserAction.setBadgeBackgroundColor({color:'silver'});
      }
      else if (res["trend_words"]=="FLAT") {
        chrome.browserAction.setBadgeBackgroundColor({color:'black'});
      } else if (res["trend_words"]=="FORTY_FIVE_UP" || res["trend_words"]=="FORTY_FIVE_DOWN") {
        chrome.browserAction.setBadgeBackgroundColor({color:'orange'});
      } else {
        chrome.browserAction.setBadgeBackgroundColor({color:'red'});
      }

      // Change badge text and save the res for display in popup.
      if (item.unit == 'mgdl') {
        chrome.browserAction.setBadgeText({text: res['value'].toString() + res['trend_symbol']});
        chrome.storage.sync.set({latest_bg_res: res['full'] + ' (' + res['timestamp'].split('T')[0] + ')'});
      } else {
        chrome.browserAction.setBadgeText({text: res['mmol'].toString() + res['trend_symbol']});
        chrome.storage.sync.set({latest_bg_res: res['mmol'] + ' ' + res['trend_symbol'] + ' ' + res['delta_mmol'] + ' ' + res['time'] + ' (' + res['timestamp'].split('T')[0] + ')'});
      }

    });
}

chrome.alarms.onAlarm.addListener(function() {
  chrome.storage.sync.get(null, function(item) {
   GetJSONAndUpdateBadge();
 });
  // Update BG every 2 minutes.
  chrome.alarms.create({delayInMinutes: 2});
});





