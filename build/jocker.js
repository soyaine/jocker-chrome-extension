// Copyright (c) 2021 Soyaine. All rights reserved.

function select(selector) {
  return document.querySelector(selector);
}
function hasPic(node) {
  return node.pictures && node.pictures.length > 0;
}
function snackToCamel(str) {
  if (!str) {
    return "";
  }
  return str.toLowerCase().replace(/([-_]\w)/g, (g) => g[1].toUpperCase());
}

class JockerCache {
  constructor() {
    this._mode = ""; // feed or collection
    this._all_nodes_title = "";
    this._mode_button = "";

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

    this.now = new Date();
    this.nowYear = this.now.getFullYear();
    this.nowMonth = this.now.getMonth();
    this.nowDate = this.now.getDate();
  }

  reset() {
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
  }

  addPostToTopic(node, topicName) {
    if (!this._topic_map[topicName]) {
      this._topic_map[topicName] = {
        postLen: 0,
        picPostLen: 0,
        nodes: [],
      };
      this.allTopics.push(topicName);
    }
    this._topic_map[topicName].nodes.push(node);
    this._topic_map[topicName].postLen++;
    if (hasPic(node)) {
      this._topic_map[topicName].picPostLen += node.pictures.length;
    }
  }

  addPosts(nodes) {
    nodes.forEach((node) => {
      this.allNodes.push(node);

      let topicName = node["topic"] ? node["topic"]["content"] : "无";
      let topicId = node["topic"] ? node["topic"]["id"] : "no";
      this.addPostToTopic(node, topicName);

      if (node.createdAt) {
        const create = new Date(node.createdAt);
        if (create.getFullYear() !== this.nowYear && create.getMonth() === this.nowMonth && create.getDate() == this.nowDate) {
          this.addPostToTopic(node, "🫐 往年今日");
        }

        this.addPostToTopic(node, `🍊 ${create.getFullYear()}年`);
      }

      if (jocker._mode === "collection") {
        this.addPostToTopic(node, `🥒 ${node.user.screenName}`);
      }

      const content = node.content;
      const re = /#([\u4e00-\u9fa5]+)/g; // Matches Chinese characters within hashtags
      let match;
      while ((match = re.exec(content))) {
        const topic = "🥥 " + match[1];
        this.addPostToTopic(node, topic);
      }
    });
  }

  addApolloData(apollo) {
    this._user_id = apollo["$ROOT_QUERY.profile"]["username"];
  }

  updatePageInfo(hasNext, lastId) {
    this._last_id = lastId;
    this.hasNextPage = hasNext;
  }

  updateUser(username) {
    this._user_id = username;
  }

  getTopicList() {
    return Object.keys(this._topic_map);
  }

  getQueryVariables() {
    return {
      username: this._user_id,
      loadMoreKey: {
        lastId: this._last_id,
        _id: this._last_id,
      },
    };
  }

  getFirstVariables() {
    return {
      username: this._user_id,
    };
  }

  getPostsInTopic(topicId) {
    let nodes;
    if (topicId === jocker._all_nodes_title) {
      nodes = this.allNodes;
    } else {
      nodes = this._topic_map[topicId]?.nodes || [];
    }

    if (this.currentFilterMode === "picture") {
      nodes = nodes.filter((node) => hasPic(node));
    }

    return nodes;
  }

  getTopicsSortByCount() {
    let all_nodes = this.allNodes;
    let postLenKey = "postLen";

    if (this.currentFilterMode === "picture") {
      postLenKey = "picPostLen";
      all_nodes = all_nodes.filter((node) => hasPic(node));
    }

    const keysSorted = Object.keys(this._topic_map).sort((a, b) => {
      const alen = this._topic_map[a][postLenKey];
      const blen = this._topic_map[b][postLenKey];

      // 如果相等，则按照a和b的字母排序
      if (alen === blen) {
        return a.localeCompare(b);
      } else {
        return this._topic_map[b][postLenKey] - this._topic_map[a][postLenKey];
      }
    });
    const sortedTopics = keysSorted.map((key) => [key, this._topic_map[key][postLenKey]]);
    sortedTopics.splice(0, 0, [jocker._all_nodes_title, all_nodes.length]);
    return sortedTopics;
  }
}

const jocker = new JockerCache();

function loadPostsDefault(postsElem, nodes) {
  nodes.forEach((post) => {
    const postElem = document.createElement("div");
    postElem.setAttribute("class", `post post-${jocker.currenLayoutMode} mode-${jocker._mode}`);

    if (jocker._mode === "collection") {
      const userElem = document.createElement("a");
      userElem.setAttribute("class", "p-user");
      userElem.setAttribute("target", "_blank");
      userElem.setAttribute("href", `https://web.okjike.com/u/${post.user.username}`);
      userElem.innerText = post.user.screenName;
      postElem.appendChild(userElem);
    }

    const dateElem = document.createElement("span");
    dateElem.setAttribute("class", "p-date");
    const date = new Date(post.createdAt);
    
    // 格式化日期显示
    const isThisYear = date.getFullYear() === new Date().getFullYear();
    
    let dateStr;
    if (isThisYear) {
      dateStr = `${date.getFullYear()}年${(date.getMonth() + 1)}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      dateStr = `${date.getFullYear()}年${(date.getMonth() + 1)}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    dateElem.innerText = dateStr;
    postElem.appendChild(dateElem);

    const contentElem = document.createElement("div");
    contentElem.setAttribute("class", "p-content");
    contentElem.innerText = post.content;
    postElem.appendChild(contentElem);

    if (post.linkInfo) {
      const link = document.createElement("a");
      link.setAttribute("class", "p-link");
      link.setAttribute("href", post.linkInfo.linkUrl);
      link.innerText = post.linkInfo.title;

      postElem.appendChild(link);
    }

    if (post.pictures && post.pictures.length) {
      const pics = document.createElement("div");
      pics.setAttribute("class", `p-pics p-pics-${post.pictures.length}`);

      const loadImage = (pic) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve({
            url: pic.picUrl,
            width: img.width,
            height: img.height,
            ratio: img.width / img.height
          });
          img.src = pic.picUrl;
        });
      };

      Promise.all(post.pictures.map(loadImage)).then(images => {
        images.forEach(imgData => {
          const picElem = document.createElement("img");
          // 修改这里：当只有一张图片时不添加比例相关的类
          picElem.setAttribute("class", `p-pic ${post.pictures.length === 1 ? '' : 
            (imgData.ratio > 1.3 ? 'p-pic-wide' : imgData.ratio < 0.8 ? 'p-pic-tall' : 'p-pic-square')}`);
          picElem.setAttribute("src", imgData.url);
          
          picElem.addEventListener("click", function() {
            const overlay = document.querySelector(".image-preview-overlay");
            const previewImg = overlay.querySelector(".image-preview");
            previewImg.src = imgData.url;
            overlay.classList.add("active");
          });

          pics.appendChild(picElem);
        });
      });

      postElem.appendChild(pics);
    }

    if (post.video) {
      const videoLink = document.createElement("a");
      videoLink.setAttribute("class", "p-link");
      videoLink.setAttribute("href", `https://web.okjike.com/originalPost/${post.id}`);
      videoLink.setAttribute("target", "_blank");
      videoLink.innerText = "查看视频动态 →";
      postElem.appendChild(videoLink);
    }

    if (post.target) {
      const target = post.target;
      const tragetElem = document.createElement("a");
      tragetElem.setAttribute("target", "_blank");
      tragetElem.setAttribute("href", `https://web.okjike.com/${snackToCamel(post.targetType)}/${target.id}`);
      tragetElem.innerHTML = `${target.user && target.user.screenName}: ${target.content}`;
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
  topicsElem.innerHTML = "";

  topics.forEach((topic) => {
    var topic_name = topic[0];
    var topic_count = topic[1];

    if (topic_count === 0) {
      return;
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
  jocker.postFetching = false;

  select("#intro").setAttribute("style", "display: none;");
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
  if (jocker.currentTopic == "") {
    return;
  }

  const nodes = jocker.getPostsInTopic(jocker.currentTopic);
  let csvContent = "\uFEFF";
  // csvContent += ['发布时间', '内容', '链接名称', '链接地址', '图片地址1', '图片地址2', '图片地址3', '图片地址4', '图片地址5', '图片地址6', '图片地址7', '图片地址8', '图片地址9'].join(",") + "\r\n"
  csvContent += ["发布时间", "主题", "内容"].join(",") + "\r\n";

  nodes.forEach(function (post) {
    let row = [
      `"${post.createdAt}"`,
      `"${(post.topic && post.topic.content) || "无主题"}"`,
      `"${post.content}"`,
      // `"${post.linkInfo && post.linkInfo.title || ''}"`,
      // `"${post.linkInfo && post.linkInfo.linkUrl || ''}"`,
      // post.pictures && (post.pictures.map(pic => { return `"${pic.picUrl}"` }).join(',') + '"",'.repeat(9 - post.pictures.length))
    ].join(",");
    csvContent += row + "\r\n";
  });

  var csvData = new Blob([csvContent], { type: "text/csv;charset=utf-8" }); //new way
  var encodedUri = URL.createObjectURL(csvData);

  const a = document.createElement("a");
  a.setAttribute("class", "hidden-a");
  document.body.appendChild(a);
  a.href = encodedUri;
  a.download = `${new Date().toLocaleDateString("sv-SE")}-${jocker.currentTopic}-jocker-backup.csv`;
  a.click();
  window.URL.revokeObjectURL(encodedUri);
  document.body.removeChild(a);
}

function fetchPost(variables) {
  fetch("https://web-api.okjike.com/api/graphql", {
    method: "POST",
    headers: {
      origin: " https://web.okjike.com",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      operationName: jocker._mode === "feed" ? "UserFeeds" : "UserCollections",
      query: jocker._mode === "feed" ? QueryUserFeed : QueryUserCollections,
      variables,
    }),
  })
    .then((r) => r.json())
    .then((data) => {
      data = data.data;

      let feeds = null;
      let lastid = null;

      if (jocker._mode === "feed") {
        feeds = data && data.userProfile && data.userProfile.feeds;
        pageInfo = feeds.pageInfo;
        lastid = pageInfo.loadMoreKey && pageInfo.loadMoreKey.lastId;
      } else {
        feeds = data && data.viewer && data.viewer.collections;
        pageInfo = feeds.pageInfo;
        lastid = pageInfo.loadMoreKey && pageInfo.loadMoreKey._id;
      }

      if (feeds && feeds.nodes) {
        jocker.addPosts(feeds.nodes);
        console.log("fetch success got data", feeds.nodes.length);
        const type = jocker._mode === "feed" ? "自己的动态" : "收藏动态";
        select(jocker._mode_button).innerText = `已整理 ${jocker.allNodes.length} 条${type}...`;
        jocker.updatePageInfo(pageInfo.hasNextPage, lastid);

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
      select(jocker._mode_button).innerText = "出错啦";
      console.error(err);
    });
}

function handleClickStartFeed(e) {
  jocker._mode = "feed";
  jocker._mode_button = "#start-feeds";
  jocker._all_nodes_title = "所有动态";
  select("#start-feeds").classList.add("disable");
  select("#start-collections").classList.add("disable");
  select("#fetch-count").classList.remove("disable");
  select("#myfeed").classList.add("show");
  startJocker(e);
}

function handleClickStartCollection(e) {
  jocker._mode = "collection";
  jocker._mode_button = "#start-collections";
  jocker._all_nodes_title = "所有收藏";
  select("#start-feeds").classList.add("disable");
  select("#start-collections").classList.add("disable");
  select("#fetch-count").classList.remove("disable");
  select("#mycollection").classList.add("show");
  select("#layouts").classList.add("hidden");
  select("#switch-style-arrow").classList.add("hidden");
  select("#switch-style-text").classList.add("hidden");
  startJocker(e);
}

function fetchJikeApiData({ limit = 20, loadMoreKey, username }) {
  chrome.runtime.sendMessage(
    {
      type: "fetchJikeApiData",
      body: {
        limit,
        loadMoreKey,
        username,
      },
      api: `https://api.ruguoapp.com/1.0/${jocker._mode === "feed" ? "personalUpdate/single" : "collections/list"}`,
    },
    function (response) {
      if (response.data) {
        // 在插件自己的 HTML 里展示数据
        const nodes = response.data.data;
        jocker.addPosts(nodes);
        const type = jocker._mode === "feed" ? "自己的动态" : "收藏动态";
        // select(jocker._mode_button).innerText = `已整理 ${jocker.allNodes.length} 条${type}...`;
        jocker.updatePageInfo(nodes.length >= limit, nodes[nodes.length - 1].id);
        select("#fetch-count").innerText = `已整理 ${jocker.allNodes.length} 条${type}...`;

        if (jocker.hasNextPage) {
          fetchJikeApiData({
            limit,
            loadMoreKey: { lastId: nodes[nodes.length - 1].id },
            username,
          });
        } else {
          reloadTopics();
          stopLoading();
        }
      } else {
        select("#fetch-count").innerText = `诶，不太对`;
        select("#error-info").classList.remove("hidden");
        console.error("API请求失败", response.error);
      }
    }
  );
}

function startJocker(e) {
  if (jocker.postFetching) {
    return;
  }

  console.log("start", e);

  jocker.postFetching = true;
  e.currentTarget.innerText = "整理中……";
  e.currentTarget.classList.add("loading");
  select("#intro-jocker").classList.add("loading");
  fetchJikeApiData({
    limit: 50,
  });
}

var ESCAPE_KEY = 27;
window.onkeydown = function (event) {
  if (event.keyCode == ESCAPE_KEY) {
    resetFilter();
  }
};

function onload() {
  // ... existing code ...
  
  // 添加图片预览遮罩层的关闭事件
  const overlay = document.querySelector(".image-preview-overlay");
  overlay.addEventListener("click", function() {
    this.classList.remove("active");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  onload();

  select("#start-feeds").addEventListener("click", handleClickStartFeed);
  select("#start-collections").addEventListener("click", handleClickStartCollection);
  select("#layouts").addEventListener("click", changeLayout);
  select("#tool").addEventListener("click", downloadCsv);
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("jocker.js onMessage", message);
  str = JSON.stringify(message.data);
});
