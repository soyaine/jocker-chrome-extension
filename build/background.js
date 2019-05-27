chrome.browserAction.onClicked.addListener(function(activeTab)
{
    var newURL = "https://web.okjike.com/";
    chrome.tabs.create({ url: newURL });
});

const queryMap = {
  'queryNotiList': {
    url: 'https://app.jike.ruguoapp.com/1.0/notifications/list',
    method: 'POST'
  },
  'queryNotiCount': {
    url: 'https://app.jike.ruguoapp.com/1.0/notifications/unread',
    method: 'GET'
  }
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    var query = queryMap[request.contentScriptQuery]
    if (query) {
      var fetchHeaders = new Headers({
        'x-jike-access-token': request.reqToken,
        'x-from': 'duoie-love-jike',
        'app-version': '4.11.0',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://app.jike.ruguoapp.com'
      })
      fetch(query.url, {
        method: query.method,
        mode: 'cors',
        headers: fetchHeaders
      })
        .then(function(res) {
          return res.json();
        })
        .catch(function(err) {
          console.error(err);
          return {data: []};
        })
        .then(function(data) {
          sendResponse(data);
        })
      return true;
    }
});
