function init() {
  console.log("user.js init");
  var data = JSON.parse(document.getElementById("__NEXT_DATA__").innerHTML);
  
  console.log("me.js data");
  var icon = chrome.runtime.getURL("icon256.png");
  const icnElem = document.createElement("img");
  icnElem.setAttribute("src", icon);
  icnElem.setAttribute("class", "ico-jocker");
  const nextElem = document.querySelector(".cvJDST");
  nextElem.appendChild(icnElem);
  icnElem.addEventListener("click", function (e) {
    const key = 'careList'
    chrome.storage.sync.get([key], function(result) {
      console.log(result)
      let list = result[key] || []
      console.log(list)
      list.push(window.location.pathname)
      chrome.storage.sync.set({
        careList: list,
      });
    })
    console.log("chrome.runtime.sendMessage");
  });
}

window.addEventListener("load", init);
