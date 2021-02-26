function init() {
  console.log("me.js init");
  var data = JSON.parse(document.getElementById("__NEXT_DATA__").innerHTML);
  console.log("me.js data");
  var icon = chrome.runtime.getURL("icon256.png");
  const icnElem = document.createElement("img");
  icnElem.setAttribute("src", icon);
  icnElem.setAttribute("class", "ico-jocker");
  const nextElem = document.querySelector("#__next");
  nextElem.appendChild(icnElem);
  icnElem.addEventListener("click", function (e) {
    chrome.storage.local.set({
      firstPagePost: data,
    });
    chrome.runtime.sendMessage({
      openExtension: true,
    });
    console.log("chrome.runtime.sendMessage");
  });
}

window.addEventListener("load", init);
