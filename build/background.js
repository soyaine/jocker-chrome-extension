function focusOrCreateTab(url) {
  chrome.windows.getAll({ populate: true }, function (windows) {
    var existing_tab = null;
    for (var i in windows) {
      var tabs = windows[i].tabs;
      for (var j in tabs) {
        var tab = tabs[j];
        if (tab.url == url) {
          existing_tab = tab;
          break;
        }
      }
    }
    if (existing_tab) {
      chrome.tabs.update(existing_tab.id, { selected: true });
    } else {
      chrome.tabs.create({ url: url, selected: true });
    }
  });
}

chrome.runtime.onMessage.addListener(function (msg, sender) {
  console.log("sender", sender, msg);
  if (msg.openExtension) {
    focusOrCreateTab(chrome.runtime.getURL("/jocker.html"));
  }
  if (msg.careThisOne) {
    focusOrCreateTab(chrome.runtime.getURL("/heart.html"));
  }
});

chrome.action.onClicked.addListener(function () {
    focusOrCreateTab(chrome.runtime.getURL("/heart.html"));
});