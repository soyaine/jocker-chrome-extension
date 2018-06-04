chrome.browserAction.onClicked.addListener(function(activeTab)
{
    var newURL = "https://web.okjike.com/";
    chrome.tabs.create({ url: newURL });
});
