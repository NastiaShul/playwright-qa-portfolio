export const getComments = `query getComments($objectId: ID!, $objectClass: ObjectClass!) {
    commentsQueries {
        feed(
            input: {
                filter: { objectClass: $objectClass, objectId: $objectId }
                pagination: { ByCursor: { last: 100 } }
                sort: NEWEST
            }
        ) {
            items {
                id
                isReadByUser
                text
                created
                objectId
                edited
                isDeleted
                isReplyToTopLevelComment
                user {
                    name
                    avatar {
                        url
                    }
                    id
                    roles {
                        ID
                    }
                }
                objectClass
                reactions {
                    userReaction {
                        objectClass
                        objectID
                        reactionType
                    }
                    likeCount
                    dislikeCount
                }
                threadCommentsCount
                parentComment {
                    id
                    isDeleted
                    user {
                        id
                        name
                    }
                }
                childThread(
                    input: { sort: OLDEST, pagination: { ByCursor: { first: 10 } } }
                ) {
                    items {
                        id
                        text
                        created
                        threadId
                        isDeleted
                        edited
                        isReplyToTopLevelComment
                        objectClass
                        objectId
                        threadCommentsCount
                        user {
                            id
                            name
                            avatar {
                                url
                            }
                            roles {
                                ID
                            }
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
                        parentComment {
                            id
                            isDeleted
                            user {
                                id
                                name
                            }
                        }
                        threadComment {
                            id
                            user {
                                id
                                name
                            }
                        }
                    }
                    paginationInfo {
                        ... on PaginationByCursor {
                            totalItemsCount
                            hasNextPage
                            endCursor
                        }
                    }
                }
            }
            paginationInfo {
                ... on PaginationByCursor {
                    totalItemsCount
                    hasNextPage
                    endCursor
                }
            }
        }
    }
}`;

export const commentList = `
query CommentList(
    $objectId: ID!, $objectClass: ObjectClass!
) {
    commentsQueries {
        feed(
            input: {
                filter: {
                    objectClass: $objectClass
                    objectId: $objectId
                    superTag: "ALL_COMMENTS"
                }
                sort: OLDEST
                pagination: { ByCursor: { after: null, first: 20 } }
            }
        ) {
            __typename
            ...CommentsFeedFragment
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
fragment ChildThreadFragment on CommentsFeedPage {
    items {
        __typename
        ...CommentFragment
    }
    paginationInfo {
        __typename
        ...PaginationByCursorFragment
    }
}
fragment CommentsFeedFragment on CommentsFeedPage {
    items {
        __typename
        ...CommentFragment
        childThread(
            input: {
                sort: OLDEST
                pagination: { ByCursor: { after: null, first: 30 } }
            }
        ) {
            __typename
            ...ChildThreadFragment
        }
    }
    paginationInfo {
        __typename
        ...PaginationByCursorFragment
    }
}
`;

export const getCommentsSuperTagsConfigQuery = `
query GetCommentsSuperTagsConfig {
    adminQueries {
        configQueries {
            __typename
            ...SuperTagsFragment
        }
    }
}
fragment SuperTagsFragment on ConfigAdminQueries {
    superTags {
        colorDark
        colorLight
        mobileAppConfig {
            appURL
            logoURL
            id
            name
            tag {
                id
                title {
                    defaultValue
                }
                logo {
                    url
                }
            }
        }
    }
}`;

export const getCommentsSuperTagsQuery = `
    query GetCommentsSuperTags($objectId: ID!) {
    commentsQueries {
        CommentsSuperTags(input: { objectId: $objectId, objectClass: NEWS })
    }
 }
`;

export const getUnreadDiscussionsQuery = `query GetUnreadDiscussions {
    userDiscussionsQueries {
        currentUserDiscussions {
            unreadDiscussionsCount
            feed(input: { pagination: { ByCursor: { last: 5 } } }) {
                items {
                    id
                    userFirstComment {
                        id
                        text
                        childThread(input: { sort: NEWEST }) {
                            items {
                                id
                                text
                            }
                        }
                    }
                }
            }
        }
    }
}`;

export const getUserProfileCommentsQuery = `
query CommentsQueries ($userId: ID!) {
    commentsQueries {
        ByUser(input: { userID: $userId }) {
            paginationInfo {
                ... on PaginationByPage {
                    lastPage
                }
            }
            items {
                id
                text
                parentComment {
                    id
                    text
                }
                parentTitle {
                    defaultValue
                }
            }
        }
    }
}
`;

export const getReactionCommentsInNewsQuery = `
query GetReactionCommentsInNews($id: ID!) {
    newsQueries {
        get(input: { id: $id }) {
            id
            topLevelComments(input: { sort: BEST, pagination: { ByCursor: { first: 3 } } }) {
                items {
                    id
                    objectClass
                    reactions {
                        userReaction {
                            objectClass
                            objectID
                            reactionType
                        }
                        likeCount
                        dislikeCount
                    }
                    childThread(input: { sort: OLDEST, pagination: { ByCursor: { first: 3 } } }) {
                        items {
                            id
                            objectClass
                            reactions {
                                userReaction {
                                    objectClass
                                    objectID
                                    reactionType
                                }
                                likeCount
                                dislikeCount
                            }
                        }
                    }
                }
                paginationInfo {
                    ... on PaginationByCursor {
                        totalItemsCount
                        endCursor
                    }
                }
            }
        }
    }
}
`;

export const getUserCommentsQuery = `
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
    __typename
}
fragment blogPostDescription on BodyTopElement {
    value {
        ... on BodyParagraph {
            elements {
                value {
                    ... on BodyText {
                        text
                        __typename
                    }
                    __typename
                }
                __typename
            }
            __typename
        }
        __typename
    }
    __typename
}
fragment localizedBlogPostDescription on LocalizedSB {
    en {
        ...blogPostDescription
        __typename
    }
    es {
        ...blogPostDescription
        __typename
    }
    de {
        ...blogPostDescription
        __typename
    }
    it {
        ...blogPostDescription
        __typename
    }
    fr {
        ...blogPostDescription
        __typename
    }
    ar {
        ...blogPostDescription
        __typename
    }
    __typename
}
query getUserComments(
    $id: ID!
    $page: Int = 1
    $pageSize: Int = 10
    $lang: LanguageAdminID!
    $countryCode: CountryID!
) {
    commentsQueries {
        ByUser(
            input: {
                userID: $id
                pagination: { ByPage: { page: $page, pageSize: $pageSize } }
            }
        ) {
            items {
                id
                text
                created
                objectClass
                application
                language
                reactions {
                    likeCount
                    dislikeCount
                    __typename
                }
                isReplyToTopLevelComment
                parentComment {
                    text
                    isDeleted
                    user {
                        id
                        name
                        __typename
                    }
                    __typename
                }
                parentObject {
                    __typename
                    ... on BetReview {
                        id
                        score
                        betPlatformType
                        likesDifference
                        user {
                            id
                            name
                            __typename
                        }
                        parentObject {
                            ... on BookieMini {
                                id
                                hru
                                defaultName
                                isBanned(input: { countryId: $countryCode, langAdmId: $lang })
                                __typename
                            }
                            ... on CasinoMini {
                                id
                                hru
                                defaultName
                                isBanned(input: { countryId: $countryCode, langAdmId: $lang })
                                __typename
                            }
                            __typename
                        }
                        __typename
                    }
                    ... on Post {
                        id
                        hru
                        title {
                            defaultValue
                            ...localizedString
                            __typename
                        }
                        structuredBody {
                            ...localizedBlogPostDescription
                            __typename
                        }
                        blog {
                            id
                            hru
                            __typename
                        }
                        publicationTime
                        application
                        mainSport {
                            id
                            path
                            __typename
                        }
                        __typename
                    }
                    ... on News {
                        id
                        hru
                        newsTitle: title {
                            defaultValue
                            ...localizedString
                            __typename
                        }
                        structuredBody {
                            ...localizedBlogPostDescription
                            __typename
                        }
                        publicationTime
                        application
                        mainSport {
                            id
                            path
                            __typename
                        }
                        __typename
                    }
                    ... on CustomPoll {
                        id
                        hru
                        title {
                            defaultValue
                            ...localizedString
                            __typename
                        }
                        mainSport {
                            id
                            path
                            __typename
                        }
                        publicationTime
                        __typename
                    }
                }
                __typename
            }
            paginationInfo {
                ... on PaginationByPage {
                    hasNextPage
                    totalItemsCount
                    __typename
                }
                __typename
            }
            __typename
        }
        __typename
    }
}
`;

export const GetUserCommentsQuery = `
query GetUserComments($userId: ID!) {
    commentsQueries {
        ByUser(
            input: {
                pagination: { ByPage: { page: 10, pageSize: 20 } }
                userID: $userId
            }
        ) {
            items {
                id
                created
                isDeleted
                user {
                    __typename
                    ...UserShortDataFragment
                }
                text
                reactions {
                    dislikeCount
                    likeCount
                }
                parentComment {
                    text
                    isDeleted
                    user {
                        __typename
                        ...UserShortDataFragment
                    }
                }
                news: parentObject {
                    __typename
                    ... on News {
                        id
                        title {
                            defaultValue
                        }
                    }
                }
                post: parentObject {
                    __typename
                    ... on Post {
                        id
                        title {
                            defaultValue
                        }
                    }
                }
                poll: parentObject {
                    __typename
                    ... on CustomPoll {
                        id
                        title {
                            defaultValue
                        }
                    }
                }
            }
            paginationInfo {
                __typename
                ... on PaginationByPage {
                    hasNextPage
                }
            }
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
`;

export const ProfileCommentsTabQuery = `query ProfileCommentsTab($userId: ID!) {
    commentsQueries {
        __typename
        ByUser(
            input: { userID: $userId, pagination: { ByPage: { page: 1, pageSize: 20 } } }
        ) {
            __typename
            items {
                __typename
                ...ProfileCommentsTabElement
            }
            paginationInfo {
                __typename
                ... on PaginationByPage {
                    currentPage
                    hasNextPage
                }
            }
        }
    }
}
fragment LocalizedStringFragment on LocalizedString {
    __typename
    defaultValue
}
fragment ProfileCommentsTabElement on Comment {
    __typename
    id
    application
    parentComment {
        __typename
        id
        user {
            __typename
            name
            id
        }
        text
        isDeleted
    }
    isDeleted
    text
    threadId
    reactions {
        __typename
        likeCount
        dislikeCount
    }
    user {
        __typename
        id
        name
        hasActiveSubscription
        avatar {
            __typename
            url
        }
    }
    created
    parentObject {
        __typename
        ... on News {
            id
            newsTitle: title {
                __typename
                ...LocalizedStringFragment
            }
        }
        ... on Post {
            id
            postTitle: title {
                __typename
                ...LocalizedStringFragment
            }
        }
        ... on CustomPoll {
            id
            pollTitle: title {
                __typename
                ...LocalizedStringFragment
            }
        }
    }
}`;

export const getBestCommentsQuery = `query getBestComments($period: PublishedPeriod!, $sportId: SportID) {
    commentsQueries {
        feedPopular(input: { limit: 5, period: $period, rating: 10, sport: $sportId }) {
            items {
                id
                application
                text
                reactions {
                    likeCount
                    dislikeCount
                    __typename
                }
                user {
                    id
                    name
                    avatar {
                        webp(height: 60, width: 60, quality: 80)
                        __typename
                    }
                    __typename
                }
                parentObject {
                    __typename
                    ... on News {
                        id
                        hru
                        newsTitle: title {
                            defaultValue
                            __typename
                        }
                        mainSport {
                            id
                            path
                            name {
                                defaultValue
                                __typename
                            }
                            __typename
                        }
                        __typename
                    }
                    ... on Post {
                        id
                        hru
                        title {
                            defaultValue
                            __typename
                        }
                        mainSport {
                            id
                            path
                            name {
                                defaultValue
                                __typename
                            }
                            __typename
                        }
                        __typename
                    }
                    ... on CustomPoll {
                        id
                        hru
                        title {
                            defaultValue
                            __typename
                        }
                        mainSport {
                            id
                            path
                            name {
                                defaultValue
                                __typename
                            }
                            __typename
                        }
                        __typename
                    }
                }
                __typename
            }
            __typename
        }
        __typename
    }
}
`;

export const GetPopularCommentsQuery = `query GetPopularComments($sportId: SportID) {
    commentsQueries {
        commentsByDay: feedPopular(
            input: { rating: 9, limit: 5, period: DAY, sport: $sportId }
        ) {
            __typename
            ...PopularCommentsFragment
        }
        commentsByWeek: feedPopular(
            input: { rating: 9, limit: 5, period: WEEK, sport: $sportId }
        ) {
            __typename
            ...PopularCommentsFragment
        }
    }
    adminQueries {
        configQueries {
            __typename
            ...SuperTagsFragment
        }
    }
}
fragment ReactionsFragment on ObjectReactions {
    likeCount
    dislikeCount
    userReaction {
        reactionType
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
fragment PopularCommentsFragment on PopularCommentsFeed {
    items {
        id
        text
        application
        parentTitle {
            defaultValue
        }
        parentObject {
            __typename
            ... on Post {
                id
                mainSport {
                    id
                }
            }
            ... on News {
                id
                mainSport {
                    id
                }
            }
        }
        reactions {
            __typename
            ...ReactionsFragment
        }
        user {
            __typename
            ...UserShortDataFragment
        }
    }
}
fragment SuperTagsFragment on ConfigAdminQueries {
    superTags {
        colorDark
        colorLight
        mobileAppConfig {
            appURL
            logoURL
            id
            name
            tag {
                id
                title {
                    defaultValue
                }
                logo {
                    url
                }
            }
        }
    }
}`;

export const CommentTopLevelFieldsQuery = `fragment CommentTopLevelFields on Comment {
    id
    text
    created
    threadId
    isDeleted
    edited
    isReplyToTopLevelComment
    objectClass
    objectId
    user {
        id
        name
        avatar {
            url
        }
        roles {
            ID
        }
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
    parentComment {
        id
        isDeleted
        text
        created
        user {
            id
            name
        }
        reactions {
            likeCount
            dislikeCount
        }
    }
    threadComment {
        id
        user {
            id
            name
        }
    }
}
fragment CommentChildItemFields on Comment {
    id
    text
    created
    threadId
    isDeleted
    edited
    isReplyToTopLevelComment
    objectClass
    objectId
    threadCommentsCount
    user {
        id
        name
        avatar {
            url
        }
        roles {
            ID
        }
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
    parentComment {
        id
        isDeleted
        text
        created
        user {
            id
            name
        }
    }
    threadComment {
        id
        user {
            id
            name
        }
    }
}
fragment CommentFragmentContentQueries on Comment {
    ...CommentTopLevelFields
    parentComment {
        id
        isDeleted
        user {
            id
            name
        }
    }
    childThread(
        input: { sort: OLDEST, pagination: { ByCursor: { first: $childThreadSize } } }
    ) {
        items {
            ...CommentChildItemFields
        }
        paginationInfo {
            ... on PaginationByCursor {
                totalItemsCount
                hasNextPage
                endCursor
            }
        }
    }
}
query getComments(
    $objectClass: ObjectClass!
    $objectId: ID!
    $cursor: String
    $pageSize: Int = 100
    $childThreadSize: Int = 100
    $sort: CommentsSort = NEWEST
    $threadId: ID
) {
    commentsQueries {
        feed(
            input: {
                filter: {
                    objectClass: $objectClass
                    objectId: $objectId
                    threadId: $threadId
                }
                pagination: { ByCursor: { first: $pageSize, after: $cursor } }
                sort: $sort
            }
        ) {
            items {
                ...CommentFragmentContentQueries
            }
            paginationInfo {
                ... on PaginationByCursor {
                    totalItemsCount
                    hasNextPage
                    endCursor
                }
            }
        }
    }
}`;

export const getCommentsCountQuery = `
query PostQueries($id: ID!) {
  postQueries {
    get(input: { id: $id }) {
      commentsCount
    }
  }
}
`;