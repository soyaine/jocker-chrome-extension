chrome.browserAction.onClicked.addListener(function(activeTab)
{
    var newURL = "http://web.okjike.com/";
    chrome.tabs.create({ url: newURL });
});
