function toJike() {
  var path = window.location.pathname.split('/');
  var type = path[1].slice(0, -1);
  
  if (type !== 'dailie' && type !== 'ho') {
    var banner = document.querySelector('div.top-banner__show');
    var btn = banner.querySelector('a.app-open-button');
    btn.remove();

    var toBtn = document.createElement('a');
    toBtn.className = "app-open-button jk-button jk-button-primary";
    toBtn.textContent = 'To Web';

    if (type === 'topic') {
      toBtn.href = `https://web.okjike.com/${type}/${path[2]}/official`;
    }
    else {
      toBtn.href = `https://web.okjike.com/${type}-detail/${path[2]}`;
    }

    banner.appendChild(toBtn);
  }
}

window.addEventListener("load", toJike);