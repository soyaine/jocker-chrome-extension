// Copyright (c) 2021 Soyaine. All rights reserved.

// Shorthand for document.querySelector.
function select(selector) {
  return document.querySelector(selector);
}
function hasPic(node) {
  return node.pictures && node.pictures.length > 0
}
function snackToCamel (str) {
  if (!str) {
    return ""
  }
  return str.toLowerCase().replace(/([-_]\w)/g, g => g[1].toUpperCase())
}

function JockerCache() {
  this._post_map = {};
  this._topic_map = {};
  this._last_id = "";
  this._user_id = "";

  this.allNodes = [];
  this.allTopics = [];
  this.hasNextPage = false;
  this.postFetching = false;

  this.currenLayoutMode = "default";
  this.currentFilterMode = "default";
  this.currentTopic = "";

  this.reset = function () {
    this._post_map = {};
    this._topic_map = {};
    this._last_id = "";
    this._user_id = "";

    this.allNodes = [];
    this.allTopics = [];
    this.hasNextPage = false;
    this.postFetching = false;

    this.currenLayoutMode = "default";
    this.currentFilterMode = "default";
    this.currentTopic = "";
  };

  this.addPosts = function (nodes) {
    // console.log(nodes);
    var jocker = this;
    nodes.forEach(function (node) {
      jocker.allNodes.push(node);
      let topicName = node["topic"] ? node["topic"]["content"] : "无";
      let topicId = node["topic"] ? node["topic"]["id"] : "no";
      if (!jocker._topic_map[topicName]) {
        jocker._topic_map[topicName] = {
          postLen: 0,
          picPostLen: 0,
          nodes: [],
        };
        jocker.allTopics.push(topicName);
      }
      jocker._topic_map[topicName].nodes.push(node);
      jocker._topic_map[topicName].postLen++;
      if (hasPic(node)) {
        jocker._topic_map[topicName].picPostLen += node.pictures.length;
      }
    });
  };

  this.addApolloData = function (apollo) {
    // console.log("apollo", apollo);
    this._user_id = apollo["$ROOT_QUERY.profile"]["username"];
    let nodes = apollo[`$User:${this._user_id}.feeds({})`]["nodes"];

    nodes = nodes.map(function (node) {
      const post = apollo[node.id];
      const needRenderProps = ["topic", "linkInfo"];
      needRenderProps.forEach(function (key) {
        if (post[key]) {
          post[key] = apollo[post[key]["id"]];
        }
      });
      if (post["pictures"]) {
        post["pictures"] = post["pictures"].map(function (pic) {
          return apollo[pic["id"]];
        });
      }
      console.log(post)
      if (post["video"]) {
        const pid = post["id"];
        const ptype = post["type"];
        const query = `$ROOT_QUERY.mediaMetaPlay({"messageId":"${pid}","messageType":"${ptype}"})`
        post["video"] = apollo[query]["url"]
      }
      if (post["target"]) {
        const targetPost = apollo[post["target"]["id"]]
        if (targetPost["user"] && targetPost["user"]["id"]) {
          targetPost["user"] = apollo[targetPost["user"]["id"]]
        }
        post["target"] = targetPost
      }

      return post;
    });
    this.addPosts(nodes);

    const pageInfo = apollo[`$User:${this._user_id}.feeds({}).pageInfo`];
    const lastId = pageInfo["loadMoreKey"] && pageInfo["loadMoreKey"]["json"] && pageInfo["loadMoreKey"]["json"]["lastId"] || ''

    console.log("pageInfo", pageInfo);
    this.updatePageInfo(pageInfo["hasNextPage"], lastId);
  };

  this.updatePageInfo = function (hasNext, lastId) {
    this._last_id = lastId;
    this.hasNextPage = hasNext;
  };
  this.updateUser = function (username) {
    this._user_id = username;
  };

  this.getTopicList = function () {
    return this._topic_map.keys();
  };
  this.getQueryVariables = function () {
    return {
      username: this._user_id,
      loadMoreKey: {
        lastId: this._last_id,
      },
    };
  };
  this.getPostsInTopic = function (topicId) {
    let nodes;
    if (topicId === "所有动态") {
      nodes = this.allNodes;
    } else {
      nodes = this._topic_map[topicId] && this._topic_map[topicId].nodes || [];
    }

    if (this.currentFilterMode === "picture") {
      nodes = nodes.filter((node) => {
        return hasPic(node)
      });
    }

    return nodes;
  };
  this.getTopicsSortByCount = function () {
    let all_nodes = this.allNodes
    let postLenKey = 'postLen'
    const jocker = this;

    if (jocker.currentFilterMode === 'picture') {
      postLenKey = 'picPostLen'
      all_nodes = all_nodes.filter((node) => {
        return hasPic(node)
      })
    }
    
    keysSorted = Object.keys(this._topic_map).sort(
      (a, b) => this._topic_map[b][postLenKey] - this._topic_map[a][postLenKey]
    );
    keysSorted = keysSorted.map((key) => {
      return [key, this._topic_map[key][postLenKey]];
    });
    keysSorted.splice(0, 0, ["所有动态", all_nodes.length]);
    return keysSorted;
  };
}

var jocker = new JockerCache();


function loadPostsDefault(postsElem, nodes) {
  nodes.forEach((post) => {
    var postElem = document.createElement("div");
    postElem.setAttribute("class", `post post-${jocker.currenLayoutMode}`);

    var dateElem = document.createElement("div");
    dateElem.setAttribute("class", "p-date");
    dateElem.innerText = new Date(post.createdAt).toLocaleString();
    postElem.appendChild(dateElem);

    var contentElem = document.createElement("div");
    contentElem.setAttribute("class", "p-content");
    contentElem.innerText = post.content;
    postElem.appendChild(contentElem);

    if (post.linkInfo) {
      var link = document.createElement("a");
      link.setAttribute("class", "p-link");
      link.setAttribute("href", post.linkInfo.linkUrl);
      link.innerText = post.linkInfo.title;

      postElem.appendChild(link);
    }

    if (post.pictures && post.pictures.length) {
      var pics = document.createElement("div");
      pics.setAttribute("class", "p-pics");

      post.pictures.forEach((pic) => {
        const picElem = document.createElement("img");
        picElem.setAttribute("class", "p-pic");
        picElem.setAttribute("src", pic.picUrl);

        pics.appendChild(picElem);
      });

      postElem.appendChild(pics);
    }

    if (post.video) {
      var videoElem = document.createElement("video");
      videoElem.setAttribute("class", "p-video");
      videoElem.setAttribute("src", post.video);
      postElem.appendChild(videoElem);
    }

    if (post.target) {
      const target = post.target;
      var tragetElem = document.createElement("a");
      tragetElem.setAttribute("target", "_blank");
      tragetElem.setAttribute("href", `https://web.okjike.com/${snackToCamel(post.targetType)}/${target.id}`);
      tragetElem.innerHTML = `
        ${target.user && target.user.screenName}: ${target.content}
      `
      tragetElem.setAttribute("class", "p-target");
      postElem.appendChild(tragetElem);
    }

    postsElem.appendChild(postElem);
  });
}

function loadPostsFlow(postsElem, nodes) {
  nodes.forEach((post) => {
    if (post.pictures && post.pictures.length) {
      post.pictures.forEach((pic) => {
        var postElem = document.createElement("div");
        postElem.setAttribute("class", `post post-${jocker.currenLayoutMode}`);

        const picElem = document.createElement("img");
        picElem.setAttribute("class", `p-pic p-pic-${jocker.currenLayoutMode}`);
        picElem.setAttribute("src", pic.picUrl);

        postElem.appendChild(picElem);
        postsElem.appendChild(postElem);
      });
    }
  });
}

function loadPostsGallery(postsElem, nodes) {
  var galleryElem = document.createElement("div");
  galleryElem.setAttribute("class", "gallery");

  nodes.forEach((post) => {
    if (post.pictures && post.pictures.length) {
      post.pictures.forEach((pic) => {
        var postElem = document.createElement("div");
        postElem.setAttribute("class", `post post-${jocker.currenLayoutMode}`);

        const picElem = document.createElement("div");
        picElem.setAttribute("class", `p-pic p-pic-${jocker.currenLayoutMode}`);
        picElem.setAttribute("style", `background-image: url('${pic.picUrl}')`);

        postElem.appendChild(picElem);
        galleryElem.appendChild(postElem);
      });
    }
  });
  postsElem.appendChild(galleryElem);
}

function reloadPosts(nodes) {
  console.log(jocker.currenLayoutMode);
  var postsElem = select("#posts");
  postsElem.innerHTML = "";
  postsElem.setAttribute("class", `posts posts-${jocker.currenLayoutMode}`);

  if (jocker.currenLayoutMode === "default") {
    loadPostsDefault(postsElem, nodes);
  } else if (jocker.currenLayoutMode === "gallery") {
    loadPostsGallery(postsElem, nodes);
  } else if (jocker.currenLayoutMode === "flow") {
    loadPostsFlow(postsElem, nodes);
  }
}

function loadPostsOfTopic(topic) {
  console.log("loadPostsOfTopic", topic);
  const nodes = jocker.getPostsInTopic(topic);
  reloadPosts(nodes);
}

function reloadTopics() {
  const topicsElem = select("#topics");
  const topics = jocker.getTopicsSortByCount();
  topicsElem.innerHTML = ''

  topics.forEach((topic) => {
    var topic_name = topic[0];
    var topic_count = topic[1];

    if (topic_count === 0) {
      return
    }

    var topicElem = document.createElement("div");
    topicElem.setAttribute("class", "topic");

    var topicName = document.createElement("span");
    topicName.setAttribute("class", "tp-name");
    topicName.innerText = topic_name;

    var countElem = document.createElement("span");
    countElem.setAttribute("class", "tp-count");
    countElem.innerText = topic_count;

    topicElem.appendChild(topicName);
    topicElem.appendChild(countElem);

    topicElem.addEventListener("click", function (e) {
      e.stopPropagation();
      if (select(".topic.active")) {
        select(".topic.active").classList.remove("active");
      }
      e.currentTarget.classList.add("active");
      jocker.currentTopic = topic_name;
      select("#currentTopicName").innerText = topic_name;
      loadPostsOfTopic(topic_name);
    });

    topicsElem.appendChild(topicElem);
  });
}


function stopLoading() {
  jocker.postFetching = false

  select('#intro').setAttribute('style', 'display: none;')
}

function changeLayout(e) {
  const mode = e.target.value;
  if (!mode || mode === jocker.currenLayoutMode) {
    return;
  }

  if (select(".layout-input.active")) {
    select(".layout-input.active").classList.remove("active");
  }
  e.target.classList.add("active");

  jocker.currenLayoutMode = mode;
  jocker.currentFilterMode = mode === "default" ? "default" : "picture";

  reloadTopics();
  loadPostsOfTopic(jocker.currentTopic);
}

function downloadCsv() {
  if (jocker.currentTopic == '') {
    return
  }

  const nodes = jocker.getPostsInTopic(jocker.currentTopic);
  let csvContent = "\uFEFF"
  // csvContent += ['发布时间', '内容', '链接名称', '链接地址', '图片地址1', '图片地址2', '图片地址3', '图片地址4', '图片地址5', '图片地址6', '图片地址7', '图片地址8', '图片地址9'].join(",") + "\r\n"
  csvContent += ['发布时间', '主题', '内容'].join(",") + "\r\n"

  nodes.forEach(function(post) {
      let row = [
        `"${post.createdAt}"`,
        `"${post.topic && post.topic.content || '无主题'}"`,
        `"${post.content}"`
        // `"${post.linkInfo && post.linkInfo.title || ''}"`,
        // `"${post.linkInfo && post.linkInfo.linkUrl || ''}"`,
        // post.pictures && (post.pictures.map(pic => { return `"${pic.picUrl}"` }).join(',') + '"",'.repeat(9 - post.pictures.length))
      ].join(",");
      csvContent += row + "\r\n";
  });

  var csvData = new Blob([csvContent], { type: 'text/csv;charset=utf-8' }); //new way
  var encodedUri = URL.createObjectURL(csvData);

  const a = document.createElement('a');
  a.setAttribute('class', 'hidden-a');
  document.body.appendChild(a);
  a.href = encodedUri;
  a.download = `${new Date().toLocaleDateString('sv-SE')}-${jocker.currentTopic}-jocker-backup.csv`
  a.click();
  window.URL.revokeObjectURL(encodedUri);
  document.body.removeChild(a);
}

let COOKIES = "";
let COOKIESTR = "";
let personalPosts = [];

function fetchPost(variables) {
  fetch("https://web-api.okjike.com/api/graphql", {
    method: "POST",
    headers: {
      origin: " https://web.okjike.com",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      operationName: "UserFeeds",
      query: `query UserFeeds($username: String!, $loadMoreKey: JSON) {
            userProfile(username: $username) {
                username
                feeds(loadMoreKey: $loadMoreKey) {
                    ...BasicFeedItem
                    __typename
                }
                __typename
            }
        }
        
        fragment BasicFeedItem on FeedsConnection {
            pageInfo {
                loadMoreKey
                hasNextPage
                __typename
            }
            nodes {
                ... on ReadSplitBar {
                    id
                    type
                    text
                    __typename
                }
                ... on MessageEssential {
                    ...FeedMessageFragment
                    __typename
                }
                ... on UserAction {
                    id
                    type
                    action
                    actionTime
                    ... on UserFollowAction {
                        users {
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            __typename
                        }
                        allTargetUsers {
                            ...TinyUserFragment
                            following
                            statsCount {
                                followedCount
                                __typename
                            }
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            __typename
                        }
                        __typename
                    }
                    ... on UserRespectAction {
                        users {
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            __typename
                        }
                        targetUsers {
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            ...TinyUserFragment
                            __typename
                        }
                        content
                        __typename
                    }
                    __typename
                }
                __typename
            }
            __typename
        }
        
        fragment FeedMessageFragment on MessageEssential {
            ...EssentialFragment
            ... on OriginalPost {
                ...LikeableFragment
                ...CommentableFragment
                ...RootMessageFragment
                ...UserPostFragment
                ...MessageInfoFragment
                pinned {
                    personalUpdate
                    __typename
                }
                __typename
            }
            ... on Repost {
                ...LikeableFragment
                ...CommentableFragment
                ...UserPostFragment
                ...RepostFragment
                pinned {
                    personalUpdate
                    __typename
                }
                __typename
            }
            ... on Question {
                ...UserPostFragment
                __typename
            }
            ... on OfficialMessage {
                ...LikeableFragment
                ...CommentableFragment
                ...MessageInfoFragment
                ...RootMessageFragment
                __typename
            }
            __typename
        }
        
        fragment EssentialFragment on MessageEssential {
            id
            type
            content
            shareCount
            repostCount
            createdAt
            collected
            pictures {
                format
                watermarkPicUrl
                picUrl
                thumbnailUrl
                smallPicUrl
                width
                height
                __typename
            }
            urlsInText {
                url
                originalUrl
                title
                __typename
            }
            __typename
        }
        
        fragment LikeableFragment on LikeableMessage {
            liked
            likeCount
            __typename
        }
        
        fragment CommentableFragment on CommentableMessage {
            commentCount
            __typename
        }
        
        fragment RootMessageFragment on RootMessage {
            topic {
                id
                content
                __typename
            }
            __typename
        }
        
        fragment UserPostFragment on MessageUserPost {
            readTrackInfo
            user {
                ...TinyUserFragment
                __typename
            }
            __typename
        }
        
        fragment TinyUserFragment on UserInfo {
            avatarImage {
                thumbnailUrl
                smallPicUrl
                picUrl
                __typename
            }
            username
            screenName
            briefIntro
            __typename
        }
        
        fragment MessageInfoFragment on MessageInfo {
            video {
                title
                type
                image {
                    picUrl
                    __typename
                }
                __typename
            }
            linkInfo {
                originalLinkUrl
                linkUrl
                title
                pictureUrl
                linkIcon
                audio {
                    title
                    type
                    image {
                        thumbnailUrl
                        picUrl
                        __typename
                    }
                    author
                    __typename
                }
                video {
                    title
                    type
                    image {
                        picUrl
                        __typename
                    }
                    __typename
                }
                __typename
            }
            __typename
        }
        
        fragment RepostFragment on Repost {
            target {
                ...RepostTargetFragment
                __typename
            }
            targetType
            __typename
        }
        
        fragment RepostTargetFragment on RepostTarget {
            ... on OriginalPost {
                id
                type
                content
                pictures {
                    thumbnailUrl
                    __typename
                }
                topic {
                    id
                    content
                    __typename
                }
                user {
                    ...TinyUserFragment
                    __typename
                }
                __typename
            }
            ... on Repost {
                id
                type
                content
                pictures {
                    thumbnailUrl
                    __typename
                }
                user {
                    ...TinyUserFragment
                    __typename
                }
                __typename
            }
            ... on Question {
                id
                type
                content
                pictures {
                    thumbnailUrl
                    __typename
                }
                user {
                    ...TinyUserFragment
                    __typename
                }
                __typename
            }
            ... on Answer {
                id
                type
                content
                pictures {
                    thumbnailUrl
                    __typename
                }
                user {
                    ...TinyUserFragment
                    __typename
                }
                __typename
            }
            ... on OfficialMessage {
                id
                type
                content
                pictures {
                    thumbnailUrl
                    __typename
                }
                __typename
            }
            ... on DeletedRepostTarget {
                status
                __typename
            }
            __typename
        }
        `,
      variables: variables,
    }),
  })
    .then((r) => r.json())
    .then((data) => {
      // console.log("data returned:", data);
      data = data.data;
      const feeds = data && data.userProfile && data.userProfile.feeds;
      // console.log(feeds);
      if (feeds && feeds.nodes) {
        jocker.addPosts(feeds.nodes);
        select("#start").innerText = `已整理 ${jocker.allNodes.length} 条...`
        // console.log('fetch success got data', feeds.nodes.length)
        const pageInfo = feeds.pageInfo;
        jocker.updatePageInfo(
          pageInfo.hasNextPage,
          pageInfo.loadMoreKey && pageInfo.loadMoreKey.lastId
        );

        if (jocker.hasNextPage) {
        // if (jocker.hasNextPage && jocker.allNodes.length < 100) {
          fetchPost(jocker.getQueryVariables());
        } else {
          reloadTopics();
          stopLoading();
        }
      }
    })
    .catch((err) => {
      select("#start").innerText = "出错啦"
      console.error(err);
    });
}

function startJocker(e) {
  if (jocker.postFetching) {
    return
  }

  console.log('start', e)

  jocker.postFetching = true
  e.currentTarget.innerText = '整理中……'
  e.currentTarget.classList.add('loading')
  select('#intro-jocker').classList.add('loading')

  chrome.storage.local.get("firstPagePost", function (data) {
    console.log("jocker.js get chrome storage");
    let apollo = data.firstPagePost.props.pageProps.apolloState.data;
    jocker.addApolloData(apollo);
    if (jocker.hasNextPage) {
      fetchPost(jocker.getQueryVariables());
    } else {
      stopLoading();
      reloadTopics();
    }
  });
}

var ESCAPE_KEY = 27;
window.onkeydown = function (event) {
  if (event.keyCode == ESCAPE_KEY) {
    resetFilter();
  }
};

function onload() {}

document.addEventListener("DOMContentLoaded", function () {
  onload();

  select("#start").addEventListener("click", startJocker);
  select("#layouts").addEventListener("click", changeLayout);
  select("#tool").addEventListener("click", downloadCsv);
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("jocker.js onMessage", message);
  str = JSON.stringify(message.data);
});
