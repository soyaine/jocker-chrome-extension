function init() {
  console.log("me.js init");
  var icon = chrome.runtime.getURL("icon256.png");
  const icnElem = document.createElement("img");
  icnElem.setAttribute("src", icon);
  icnElem.setAttribute("class", "ico-jocker");
  const nextElem = document.querySelector("#root");
  nextElem.appendChild(icnElem);
  icnElem.addEventListener("click", function (e) {
    chrome.runtime.sendMessage({
      openExtension: true,
    });
    console.log("chrome.runtime.sendMessage");
  });

  const accessToken = localStorage["JK_ACCESS_TOKEN"];
  chrome.runtime.sendMessage({
    type: "setAccessToken",
    accessToken: accessToken,
  });

  function tryGetUserLink(retry = 10) {
    const userLink = document.querySelector('a[aria-label="个人主页"][href^="/u/"]');
    if (userLink) {
      const matchusername = userLink.getAttribute("href").match(/\/u\/([a-z0-9\-]+)/i);
      if (matchusername) {
        chrome.runtime.sendMessage({
          type: "setUsername",
          username: matchusername[1],
        });
      }
      console.log("matchusername", matchusername);
    } else if (retry > 0) {
      setTimeout(() => tryGetUserLink(retry - 1), 50);
    }
  }
  tryGetUserLink();
}

window.addEventListener("load", init);
