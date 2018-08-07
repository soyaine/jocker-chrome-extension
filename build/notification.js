function getNoti() {
  var token = localStorage.getItem('auth-token');
  var req = {
    "method": "POST",
    "headers": {
      "x-jike-app-auth-jwt": token,
      "x-from": "duoie-love-jike",
      "app-version": "4.7.0"
    }
  };
  var profileUrl = document.querySelector('.user-nav ul.menu li.menu-item a').href;
  fetch('https://app.jike.ruguoapp.com/1.0/notifications/list', req)
  .then(function(res) {
    return res.json();
  })
  .then(function(res) {
    var filterData = res.data.filter(function(data) {
      if (data.linkUrl) {
        var url = new URL(data.linkUrl);
        var targetType = url.searchParams.get('targetType');
        var targetId = url.searchParams.get('targetId');
      }
      var action = data.actionItem;

      data.render = {
        thumbnailUrl: action.users[0].avatarImage.thumbnailUrl,
        username: action.users[0].username,
        screenName: action.users[0].screenName,
        time: new Date(data.createdAt).toLocaleString('zh-cn').slice(5),
        content: action.content,
        picture: !!(action.pictureUrls && action.pictureUrls.length),
        targetContent: data.referenceItem ? data.referenceItem.content : '',
        users: action.users
      }

      if (data.type === 'REPLIED_TO_PERSONAL_UPDATE_COMMENT'){
        var ifOriginal = targetType === 'ORIGINAL_POST' ? 'originalPost' : '';
        data.renderType = 'content';
        data.render.note = '回复了你';
        data.render.targetUrl = `/post-detail/${targetId}/${ifOriginal}`;
        return true;
      } else if (data.type === 'COMMENT_PERSONAL_UPDATE') {
        var ifOriginal = data.linkType === 'ORIGINAL_POST' ? 'originalPost' : '';
        data.renderType = 'content';
        data.render.note = '评论了你的动态';
        data.render.targetUrl = `/post-detail/${data.referenceItem.id}/${ifOriginal}`;
        return true;
      } else if (data.type === 'REPLY_TO_COMMENT') {
        data.renderType = 'content';
        data.render.note = '回复了你';
        data.render.targetUrl = `/message-detail/${targetId}/originalMessage`;
        return true;
      } else if (data.type === 'PERSONAL_UPDATE_REPOSTED') {
        data.renderType = 'content';
        data.render.note = '转发了你的动态';
        data.render.nolink = true;
        data.render.picture = false;
        data.render.targetUrl = `/post-detail/${action.id}/repost`;
        return true;
      } else if (data.type === 'USER_FOLLOWED') {
        data.renderType = 'users_follow';
        data.render.note = '有人关注了你嗷~';
        data.render.users = data.actionItem.users;
        return true;
      } else if (data.type === 'LIKE_PERSONAL_UPDATE_COMMENT') {
        data.renderType = 'users_like';
        data.render.note = `有 ${data.actionItem.usersCount} 个人给这条评论点赞喽~`;
        data.render.users = data.actionItem.users;
        if (targetType) {
          data.render.targetUrl = `/post-detail/${targetId}/${getCamelName(targetType)}`;
        } else if (data.linkUrl) {
          data.render.targetUrl = `/post-detail/${data.linkUrl.replace(/jike:\/\/page\.jk\/(\w+)\/(.+)/, "$2/$1")}`;
        }
        return true;
      } else if (data.type === 'LIKE_PERSONAL_UPDATE') {
        data.renderType = 'users_like';
        data.render.note = `有 ${data.actionItem.usersCount} 个人给这条动态点赞啦~`;
        data.render.users = data.actionItem.users;
        if (targetType) {
          data.render.targetUrl = `/post-detail/${targetId}/${getCamelName(targetType)}`;
        } else if (data.linkUrl) {
          data.render.targetUrl = `/post-detail/${data.linkUrl.replace(/jike:\/\/page\.jk\/(\w+)\/(.+)/, "$2/$1")}`;
        }
        return true;
      } else if (data.type === 'ANSWER_QUESTION') {
        data.renderType = 'content';
        data.render.targetUrl = '#';
        data.render.note = '回答了你的问题（原问题页面在网页看不了哈';
        data.render.nolink = true;
        return true;
      } else if (data.type === 'LIKE_QUESTION') {
        data.renderType = 'users_like';
        data.render.note = `有 ${data.actionItem.usersCount} 个人给你的提问点赞喽~`;
        data.render.users = data.actionItem.users;
        data.render.targetUrl = '#';
        data.render.nolink = true;
        return true;
      } else return false;
    }).map(function(data) {
      var render = data.render;
      var innerHTML = '';

      if (data.renderType === 'content') {
        innerHTML = `<div class="comment-card is-flex">
                        <div class="comment-card-left">
                          <div class="user-avatar ">
                              <div class="user-avatar-content" style="background-image: url(&quot;${render.thumbnailUrl}&quot;);"></div>
                          </div>
                        </div>
                        <div class="comment-card-right">
                          <div class="comment-card-header">
                              <a href="/user/${render.username}/post">
                                <span class="comment-card-header-screenname">${render.screenName}</span>
                              </a>
                              <span class="comment-card-header-time">在 ${render.time}</span>
                              <span class="comment-card-header-time"> ${render.note}</span>
                          </div>
                          <div class="comment-card-main">
                              <div class="comment-card-comment-section">
                                <div class="comment-card-main-content">
                                    <div class="readable-content">
                                      <div class="readable-content-collapse">
                                        <span>${render.content}</span>
                                        <span class="comment-card-header-time">${render.picture ? '<br/>↓有配图，可以去原消息查看哦' : ''}</span>
                                      </div>
                                    </div>
                                </div>
                              </div>
                              <div class="user-activity-repost" style="margin-right: 20px;">
                                  <a class="user-activity-repost-card" href="${render.targetUrl}" target="${render.nolink ? '' : '_blank'}">
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
      } else if (data.renderType === 'users_follow' || data.renderType === 'users_like') {
        var usersHTML = data.render.users.map(function(user){
          return `<a class="" href="/user/${user.username}" target="_blank">
                    <div class="readable-content-collapse" style="margin-top: 3px; margin-bottom: 3px;">
                        <img style="width: 25px; height: 25px; border-radius: 50%;" src="${user.avatarImage.thumbnailUrl}">
                        <span>${user.screenName}</span>
                    </div>
                  </a>`;
        }).join('');
        var referHTML = data.renderType === 'users_follow' ? '' 
                        : `<div class="user-activity-repost" style="margin-right: 20px;">
                              <a class="user-activity-repost-card" href="${render.targetUrl}" target="${render.nolink ? '' : '_blank'}">
                                <div class="user-activity-repost-card-body">
                                    <div class="user-activity-post">
                                      <div class="readable-content">
                                          <div class="readable-content-collapse" style="">
                                              <span>${render.targetContent ? render.targetContent : ''}</span>
                                          </div>
                                      </div>
                                    </div>
                                </div>
                              </a>
                          </div>`
        innerHTML = `<div class="comment-card is-flex">
                      <div class="comment-card-left">
                        <div class="user-avatar ">
                          <img class="brand-logo" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNDAgNDAiPjxkZWZzPjxyZWN0IGlkPSJhIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSIyMCIvPjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgeDE9IjkwLjM3NCUiIHgyPSI3OC42MDQlIiB5MT0iNjguMTk4JSIgeTI9IjY4LjE5OCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM1RUMxRjkiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM1RUI4RjkiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjx1c2UgZmlsbD0iI0ZGRTQxMSIgeGxpbms6aHJlZj0iI2EiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNLjk4OSAyMC44M2EuNTIuNTIgMCAwIDEtLjA1NC4wMWwxLjcyIDEuNjc3YzEuNjU0LS4xNTIgMy4yNzMtLjU4NyA0LjQ2NS0xLjAxOCAxLjE5My0uNDMyIDIuMTc0LS45ODcgMi45NDUtMS42NjdhNi4yMjcgNi4yMjcgMCAwIDAgMS43MTMtMi40NWMuMzctLjk1NC41NTUtMi4wNTUuNTU1LTMuMzAzVjcuOTE1YzAtMS4zOS4wMDUtMi41OTUuMDE1LTMuNjE0LjAxLTEuMDIuMDE2LTEuOTQuMDE2LTIuNzYzTDEwLjQ0LjAwM2MwIC44MjEtLjAwNSAxLjc0MS0uMDE1IDIuNzYtLjAxIDEuMDE5LS4wMTUgMi4yMjQtLjAxNSAzLjYxNHY2LjE2NGMwIDEuMjQ4LS4xODUgMi4zNDktLjU1NSAzLjMwMmE2LjIyNyA2LjIyNyAwIDAgMS0xLjcxMyAyLjQ1Yy0uNzcuNjgtMS43NTIgMS4yMzYtMi45NDUgMS42NjctMS4xNzcuNDI2LTIuNTguNzE2LTQuMjA4Ljg3eiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTIuOTQ5IDkuMzU5KSIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0yMy4zOSA5LjM1OWMwIC44MjItLjAwNiAxLjc0My0uMDE2IDIuNzYyLS4wMSAxLjAyLS4wMTUgMi4yMjUtLjAxNSAzLjYxNVYyMS45YzAgMS4yNDgtLjE4NSAyLjM0OS0uNTU2IDMuMzAyYTYuMjI3IDYuMjI3IDAgMCAxLTEuNzEyIDIuNDVjLS43NzEuNjgtMS43NTMgMS4yMzYtMi45NDUgMS42NjctMS4xOTIuNDMxLTIuNjE1LjcyMy00LjI2OS44NzVsLS45MjgtMy45ODdhMTYuNzIgMTYuNzIgMCAwIDAgMi4yMzctLjQwNCA0LjY2IDQuNjYgMCAwIDAgMS42NzQtLjc5OWMuNTA3LS4zOTUuODktLjg5MiAxLjE1LTEuNDkxLjI1OC0uNTk5LjM4Ny0xLjM5LjM4Ny0yLjM3NCAwLS43OTIuMDAzLTEuNjI2LjAwOC0yLjUwNC4wMDUtLjg3Ny4wMDctMS43ODMuMDA3LTIuNzE2IDAtMS42MjQtLjAwNy0yLjkxNS0uMDIyLTMuODc0LS4wMTYtLjk1OS0uMDI4LTEuODU0LS4wMzgtMi42ODZoNS4wMzd6Ii8+PC9nPjwvc3ZnPg==">
                        </div>
                      </div>
                      <div class="comment-card-right">
                        <div class="comment-card-header">
                          <span class="comment-card-header-screenname">${render.note}</span>
                        </div>
                        <div class="comment-card-main">
                          <div class="comment-card-comment-section">
                            <div class="comment-card-main-content">
                                <div class="readable-content">
                                  <div class="readable-content-collapse">
                                  ${usersHTML}
                                  </div>
                                </div>
                            </div>
                          </div>
                          ${referHTML}
                        </div>
                      </div>
                    </div>`;
      }
      return innerHTML;
    });
    var noti = document.querySelector('div.duoie-noti');
    noti.innerHTML = `<a class="comment-card-header-time" style="float: right; margin-right: .5em;" href="/post-detail/5b5197a98608090017604f5c/originalPost">Ⓙ 此功能非官方哟，戳这里反馈你的想法 </a>
                      <div class="comments-timeline-container-title">近期的新通知</div>
                      <div>${filterData.join('')}</div>`;
  });
}

function getCamelName(str) {
  return str.replace(/(\w+)_(\w)(\w+)/, function ($0, $1, $2, $3) {
    return $1.toLowerCase() + $2 + $3.toLowerCase()
  });
}

function getList(id) {
  var token = localStorage.getItem('auth-token');
  var req = {
    "method": "POST",
    "headers": {
      "x-jike-app-auth-jwt": token,
      "x-from": "duoie-love-jike",
      "app-version": "4.7.0"
    },
    "body": {
      "id": id
    }
  };
  var profileUrl = document.querySelector('.user-nav ul.menu li.menu-item a').href;
  fetch('https://app.jike.ruguoapp.com/1.0/originalPosts/listLikedUsers', req)
  .then(function(res) {
    return res.json();
  })
  .then(function(res) {

  })
}

function init(params) {
  var insertBody = document.getElementsByClassName('row column')[1];
  var noti = document.createElement('div');
  noti.setAttribute('class', 'duoie-noti comments-timeline-container');
  noti.setAttribute('style', 'height: 40vh; overflow-y: scroll; margin-bottom: 5px; background: #fff;');
  insertBody.appendChild(noti);
  getNoti();

  setTimeout(function() {
    var btn = document.querySelector('.row.no-margin.end-xs.middle-xs.is-flex.middle-xs').children[2];
    btn.addEventListener('click', getNoti);
  }, 5000);
}

window.addEventListener("load", init);
