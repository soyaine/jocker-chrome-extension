function getNoti() {
  var token = localStorage.getItem('auth-token');
  var req = {
    method: 'get',
    headers: {
      'app-version': '4.0.0',
      'x-jike-app-auth-jwt': token,
      'x-from': 'duoie-love-jike'
    }
  };
  var profileUrl = document.querySelector('.user-nav ul.menu li.menu-item a').href;
  fetch('https://app.jike.ruguoapp.com/1.0/notifications/list', req)
  .then(function(res) {
    return res.json();
  })
  .then(function(res) {
    var filterData = res.data.filter(function(data) {
      if (data.type === 'REPLIED_TO_PERSONAL_UPDATE_COMMENT'){
        var action = data.actionItem;
        data.render = {
          thumbnailUrl: action.user.avatarImage.thumbnailUrl,
          username: action.user.username,
          screenName: action.user.screenName,
          time: new Date(data.createdAt).toLocaleString(),
          content: action.content,
          picture: !!(action.pictureUrls.length),
          targetUrl: `/post-detail/${action.replyToComment.targetId}/originalPost?commentId=${action.commentId}`,
          targetContent: action.replyToComment.content
        }
        return true;
      } else if (data.type === 'COMMENT_PERSONAL_UPDATE') {
        var action = data.actionItem;
        data.render = {
          thumbnailUrl: action.user.avatarImage.thumbnailUrl,
          username: action.user.username,
          screenName: action.user.screenName,
          time: new Date(data.createdAt).toLocaleString(),
          content: action.content,
          picture: !!(action.pictureUrls.length),
          targetUrl: profileUrl,
          targetContent: data.referenceItem.content
        };
        return true;
      } else if (data.type === 'REPLY_TO_COMMENT') {
        console.log(data);
        console.log('REPLY_TO_COMMENT');
        var action = data.actionItem;
        data.render = {
          thumbnailUrl: action.user.avatarImage.thumbnailUrl,
          username: action.user.username,
          screenName: action.user.screenName,
          time: new Date(data.createdAt).toLocaleString(),
          content: action.content,
          picture: !!(action.pictureUrls.length),
          targetUrl: `/message-detail/${action.targetId}/originalMessage?commentId=${action.commentId}`,
          targetContent: data.referenceItem.content
        };
        return true;
      } return false;
    }).map(function(data) {
      var render = data.render;
      var innerHTML = `<div class="comment-card is-flex">
                        <div class="comment-card-left">
                          <div class="user-avatar ">
                              <div class="user-avatar-content" style="background-image: url(&quot;${render.thumbnailUrl}&quot;);"></div>
                          </div>
                        </div>
                        <div class="comment-card-right">
                          <div class="comment-card-header">
                              <a href="/user/${render.username}/post">
                                <span class="comment-card-header-screenname">${render.screenName}</span></a>
                                <span class="comment-card-header-time">${render.time}</span>
                              </div>
                          <div class="comment-card-main">
                              <div class="comment-card-comment-section">
                                <div class="comment-card-main-content">
                                    <div class="readable-content">
                                      <div class="readable-content-collapse">
                                        <span>${render.content}</span>
                                        <span class="comment-card-header-time">${render.picture ? '有配图哦' : ''}</span>
                                      </div>
                                    </div>
                                </div>
                              </div>
                              <div class="user-activity-repost" style="margin-right: 20px;">
                                  <a class="user-activity-repost-card" href="${render.targetUrl}" target="_blank">
                                    <div class="user-activity-repost-card-body">
                                        <div class="user-activity-post">
                                          <div class="readable-content">
                                              <div class="readable-content-collapse" style="">
                                                  <span>${render.targetContent}</span>
                                              </div>
                                          </div>
                                        </div>
                                    </div>
                                  </a>
                              </div>
                          </div>
                        </div>
                      </div>`;
      return innerHTML;
    });
    var noti = document.querySelector('div.duoie-noti');
    noti.innerHTML = `<div class="comments-timeline-container-title">近期的评论和关注</div><div>${filterData.join('')}</div>`;
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
