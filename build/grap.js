var QueryUserFeed = `query UserFeeds($username: String!, $loadMoreKey: JSON) {
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
`;

var QueryUserCollections = `query UserCollections($loadMoreKey: JSON) {
  viewer {
    collections(loadMoreKey: $loadMoreKey) {
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
    isPrivate
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
    isPrivate
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
  isSponsor
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
`;

// // 导出变量作为模块
// export { userfeed };
