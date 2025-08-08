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

let jikeAccessToken = "";
let jikeUsername = "";

chrome.runtime.onMessage.addListener(function (request, sender) {
  console.log("sender", sender, request);
  if (request.openExtension) {
    focusOrCreateTab(chrome.runtime.getURL("/jocker.html"));
  }

  if (request.type === "setAccessToken") {
    jikeAccessToken = request.accessToken;
  }

  if (request.type === "setUsername") {
    jikeUsername = request.username;
  }
});

// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "fetchJikeApiData") {
    fetch(request.api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        origin: "https://web.okjike.com",
        "x-jike-access-token": jikeAccessToken,
      },
      body: JSON.stringify({
        ...request.body,
        username: jikeUsername,
      }),
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => sendResponse({ data }))
      .catch((err) => sendResponse({ error: err.toString() }));
    return true;
  }
});
