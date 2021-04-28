function init() {
  const icon = document.querySelector("#heart");
  icon.addEventListener("click", function (e) {
    chrome.runtime.sendMessage({
      openExtension: true,
    });
    console.log("chrome.runtime.sendMessage");
  });
}

window.addEventListener("load", init);
