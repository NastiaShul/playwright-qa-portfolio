export const getCurrentUser = `
query currentUser {
    userQueries {
        current {
            id
            avatar {
                resize(width: 40, height: 40)
                url(width: 40, height: 40)
            }
            banned {
                type
                until
            }
            name
            bio
            email
            roles {
                ID
            }
            currentAuthProvider
        }
    }
}`;

export const getUserQueries = `
  query Profile($userId: ID!) {
    userQueries {
      get(input: { id: $userId }) {
        __typename
        ...UserProfileFragment
      }
    }
  }

  fragment CountryFragment on statCountry {
    code
    name
    picture(format: PNG, productType: SPORTSAPP) {
      main
    }
  }

  fragment UserProfileFragment on User {
    id
    name
    createTime
    daysRegistered
    bio
    email
    location {
      city
      country {
        __typename
        ...CountryFragment
      }
    }
    rating {
      position
      rating
    }
    avatar {
      url
    }
    roles {
      role: ID
    }
    hasActiveSubscription
    currentAuthProvider
  }
`;

export const getUserQueriesInt = `
  query Profile($userId: ID!) {
    userQueries {
      get(input: { id: $userId }) {
        __typename
        ...UserProfileFragment
      }
    }
  }

  fragment CountryFragment on statCountry {
    code
    name
    picture(format: PNG, productType: SPORTSAPP) {
      main
    }
  }

  fragment UserProfileFragment on User {
    id
    name
    createTime
    daysRegistered
    bio
    email
    location {
      city
      country {
        __typename
        ...CountryFragment
      }
    }
    avatar {
      url
    }
    roles {
      role: ID
    }
    hasActiveSubscription
    currentAuthProvider
  }
`;

export const getUserInfoQuery = `
  query getUserInfo($userId: ID!) {
    userQueries {
        get(input: { id: $userId }) {
            id
            name
            createTime
            avatar {
                url
            }
            rating {
                rating
                position
            }
            location {
                country {
                    name
                    code
                    picture(productType: SPORTSAPP, format: PNG) {
                        main
                    }
                }
                city
            }
            bio
            roles {
                ID
            }
        }
    }
}
`;

export const getUserInfoQueryInt = `
  query getUserInfo($userId: ID!) {
    userQueries {
        get(input: { id: $userId }) {
            id
            name
            createTime
            avatar {
                url
            }
            location {
                country {
                    name
                    code
                    picture(productType: SPORTSAPP, format: PNG) {
                        main
                    }
                }
                city
            }
            bio
            roles {
                ID
            }
        }
    }
}
`;

export const getCurrentUserHasPostsQuery = `
  query GetCurrentUserHasPosts($postStatus: DocumentStatus) {
    postQueries {
        currentUserFeed(
            input: { pagination: { ByPage: { page: 1, pageSize: 1 } }, status: $postStatus }
        ) {
            items {
                id
            }
        }
    }
}
`;

export const getCurrentUserDiscussionsQuery = `
    fragment localizedString on LocalizedString {
    ru
    uk
    ru
    be
    en
    es
    it
    de
    fr
    ar
}
query getCurrentUserDiscussions {
    userDiscussionsQueries {
        currentUserDiscussions {
            feed(
                input: { sort: UNREAD_LATEST_FIRST, pagination: { ByCursor: { first: 100 } } }
            ) {
                items {
                    id
                    threadNotificationType
                    unreadMessagesCount
                    parentObject {
                        __typename
                        ... on Post {
                            id
                            hru
                            title {
                                ...localizedString
                            }
                            blog {
                                id
                                hru
                            }
                            mainSport {
                                id
                                path
                            }
                        }
                        ... on News {
                            id
                            hru
                            newsTitle: title {
                                ...localizedString
                            }
                            mainSport {
                                id
                                path
                            }
                        }
                        ... on CustomPoll {
                            id
                            hru
                            title {
                                ...localizedString
                            }
                            mainSport {
                                id
                                path
                            }
                        }
                    }
                    threadInitialComment {
                        id
                        text
                        objectId
                        objectClass
                        created
                        user {
                            id
                            name
                            avatar {
                                url
                            }
                        }
                        isDeleted
                        parentComment {
                            id
                            user {
                                id
                                name
                            }
                            isDeleted
                        }
                        reactions {
                            userReaction {
                                objectClass
                                objectID
                                reactionType
                            }
                            likeCount
                            dislikeCount
                        }
                        isReadByUser
                    }
                    userFirstComment {
                        id
                        text
                        objectClass
                        isReadByUser
                        parentComment {
                            id
                            user {
                                name
                            }
                        }
                        created
                    }
                }
            }
        }
    }
}
`;

export const CurrentUserDiscussionsQuery = `
    query CurrentUserDiscussions {
    userDiscussionsQueries {
        currentUserDiscussions {
            feed(input: { pagination: { ByCursor: { first: 20 } } }) {
                items {
                    id
                    threadInitialComment {
                        __typename
                        ...CommentFragment
                    }
                    userFirstComment {
                        __typename
                        ...CommentFragment
                    }
                    unreadMessagesCount
                }
                paginationInfo {
                    __typename
                    ...PaginationByCursorFragment
                }
            }
            unreadDiscussionsCount
        }
    }
}
fragment UserShortDataFragment on User {
    id
    name
    avatar {
        url
    }
    hasActiveSubscription
}
fragment ParentCommentFragment on Comment {
    id
    created
    isDeleted
    user {
        __typename
        ...UserShortDataFragment
    }
    text
}
fragment ReactionsFragment on ObjectReactions {
    likeCount
    dislikeCount
    userReaction {
        reactionType
    }
}
fragment CommentFragment on Comment {
    id
    created
    isDeleted
    isReadByUser
    user {
        __typename
        ...UserShortDataFragment
    }
    parentComment {
        __typename
        ...ParentCommentFragment
    }
    reactions {
        __typename
        ...ReactionsFragment
    }
    text
    application
}
fragment PaginationByCursorFragment on PaginationByCursor {
    endCursor
    startCursor
    totalItemsCount
    hasNextPage
    hasPrevPage
}
`;

export const PostsDraftsByUserIdQuery = `query PostsDraftsByUserId(
    $language: Language
) {
    postQueries {
        currentUserFeed(
            input: { status: UNPUBLISHED, pagination: { ByPage: { page: 1, pageSize: 20 } } }
        ) {
            __typename
            ...PostMainFeedFragment
        }
    }
}
fragment AuthorShortInfoFragment on Author {
    user {
        id
        name
        hasActiveSubscription
    }
}
fragment BlogShortInfoFragment on Blog {
    id
    title
    avatar {
        url
    }
    subscribersCount
    description
    founder {
        id
        name
    }
}
fragment ReactionsFragment on ObjectReactions {
    likeCount
    dislikeCount
    userReaction {
        reactionType
    }
}
fragment TextFormatFragment on TextFormat {
    bold
    italic
    color
}
fragment ParagraphElement on BodyParagraphElement {
    value {
        __typename
        ... on BodyText {
            text
            format {
                __typename
                ...TextFormatFragment
            }
        }
        ... on BodyLink {
            href
            text
            format {
                __typename
                ...TextFormatFragment
            }
        }
    }
    type
}
fragment StructuredBodyFragment on BodyTopElement {
    type
    value {
        __typename
        ... on BodyAd {
            name
            platforms
            size
        }
        ... on BodyParagraph {
            elements {
                __typename
                ...ParagraphElement
            }
        }
        ... on BodySubtitle {
            text
            level
            elements {
                __typename
                ...ParagraphElement
            }
        }
        ... on BodyImage {
            source
            width
            height
        }
        ... on BodyList {
            type
            style
            items {
                elements {
                    __typename
                    ...ParagraphElement
                }
            }
        }
        ... on BodyIframe {
            source
        }
        ... on BodyTwitter {
            id
        }
        ... on BodyLinkedImage {
            href
            image {
                source
                width
                height
            }
        }
        ... on BodyYoutube {
            start
            source
        }
        ... on BodyInstagram {
            url
        }
    }
}
fragment LocalizedSBFragment on LocalizedSB {
    defaultValue(language: $language) {
        __typename
        ...StructuredBodyFragment
    }
}
fragment PostFeedFragment on Post {
    id
    link
    label
    author {
        __typename
        ...AuthorShortInfoFragment
    }
    displayAuthor {
        __typename
        ...AuthorShortInfoFragment
    }
    mainPhoto {
        webp(quality: 85)
    }
    title {
        defaultValue
    }
    blog {
        __typename
        ...BlogShortInfoFragment
    }
    reactions {
        __typename
        ...ReactionsFragment
    }
    structuredDescription {
        __typename
        ...LocalizedSBFragment
    }
    publicationTime
    modifiedTime
    commentsCount
    status
}
fragment PaginationInfoFragment on PaginationByPage {
    currentPage
    pageSize
    hasNextPage
}
fragment PostMainFeedFragment on PostFeedPage {
    items {
        __typename
        ...PostFeedFragment
    }
    paginationInfo {
        __typename
        ...PaginationInfoFragment
    }
}`;

export const getCurrentUserSocialNetworks = `
query UserQueries {
    userQueries {
        current {
            id
            name
            socialNetworks {
                network_id
                type
                url
            }
        }
    }
}
`;