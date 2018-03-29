function getNoti() {
  var token = localStorage.getItem('auth-token');
  var req = {
    method: 'get',
    headers: {
      'app-version': '4.0.0',
      'x-jike-app-auth-jwt': token,
      'x-from': 'duoie-love-jike'
    }
  }
  fetch('https://app.jike.ruguoapp.com/1.0/notifications/list', req)
  .then(function(res) {
    console.log('sucess');
    return res.json();
  })
  .then(function(res) {
    var filterData = res.data.filter(function(data) {
      if (data.actionType === 'COMMENT'){
        return true;
      } else return false;
    }).map(function(data) {
      var action = data.actionItem;
        console.log(data);
      var innerHTML = `<div class="comment-card is-flex">
      <div class="comment-card-left">
         <div class="user-avatar ">
            <div class="user-avatar-content" style="background-image: url(&quot;${action.user.avatarImage.thumbnailUrl}&quot;);"></div>
         </div>
      </div>
      <div class="comment-card-right">
         <div class="comment-card-header">
            <a href="/user/${action.user.username}/post">
              <span class="comment-card-header-screenname">${action.user.screenName}</span></a>
              <span class="comment-card-header-time">${data.createdAt}</span>
              <a href="/user/${action.user.username}/post">
            <span class="comment-card-header-time">去原消息瞅一眼</span>
          </a>
            </div>
         <div class="comment-card-main">
            <div class="comment-card-comment-section">
               <div class="comment-card-main-content">
                  <div class="readable-content">
                     <div class="readable-content-collapse"><span>${action.content}</span></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>`;
      return innerHTML;
    });
    console.log(res.data[0].type);
    console.log(filterData);
    var noti = document.querySelector('div.duoie-noti');
    noti.innerHTML = `<div style="overflow: scroll">${filterData.join('')}</div>`;
  });
}

function init(params) {
  var btn = document.querySelector('.header-item.header-item-icon');
  var insertBody = document.getElementsByClassName('row column')[1];
  var noti = document.createElement('div');
  noti.setAttribute('class', 'duoie-noti comments-timeline-container');
  noti.setAttribute('style', 'height: 40vh; overflow-y: scroll; margin-bottom: 5px; background: #fff;');
  insertBody.appendChild(noti);
  btn.addEventListener('click', getNoti);
  getNoti();
}

window.addEventListener("load", init);
