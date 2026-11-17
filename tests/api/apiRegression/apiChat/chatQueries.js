export const getChatWidgetInfoQuery = `
query GetChatWidgetInfo($entityID: ID!) {
    chatQueries {
        getChatroomByEntityID(entityID: $entityID) {
            totalMessagesCount
            chattyUsers {
                user {
                    name
                    avatar {
                        webp(height: 60, width: 60, quality: 80)
                    }
                }
            }
        }
    }
}
`;

export const GetMatchDetailedChatWidgetQuery = `
query GetMatchDetailedChatWidget($entityID: ID!) {
    chatQueries {
        __typename
        getChatroomByEntityID(entityID: $entityID) {
            __typename
            unreadMessagesCount
            totalMessagesCount
            firstUnreadMessage {
                __typename
                id
            }
            chattyUsers {
                __typename
                user {
                    __typename
                    id
                    avatar {
                        __typename
                        url
                    }
                }
                messages
            }
        }
    }
}
`;

export const chatRoomListQuery = `
  query ChatQueries($appName: String!) {
    chatQueries {
      getChatroomList(appName: $appName) {
        chatroom {
          id
          type
          name
          entityID
          createdAt
        }
      }
    }
  }
`;

export const getMessageHistoryQuery = `
  query ChatQueries($chatID: ID!) {
    chatQueries {
      historyMessages(input: { chatID: $chatID, pagination: { } }) {
        items {
          id
          chatID
          text
        }
      }
    }
  }
`;

export const getChatroomByEntityIDQuery = `
query ChatQueries($entityID: ID!) {
chatQueries {
        getChatroomByEntityID(entityID: $entityID) {
            __typename
            ...ChatRoomFragment
        }
    }
}
fragment ChatMessageFragment on Message {
    id
    text
    createdAt
    isDeleted
    isRead
    user {
        id
        name
        avatar {
            url
        }
        hasActiveSubscription
    }
    parentMessage {
        id
        text
        isDeleted
        user {
            name
            hasActiveSubscription
        }
    }
}
fragment ChatRoomFragment on GetChatroomResolver {
    chatroom {
        id
        name
        isPinned
        logos {
            url
        }
    }
    chattyUsers {
        user {
            id
            avatar {
                url
            }
            name
            hasActiveSubscription
        }
    }
    firstUnreadMessage {
        __typename
        ...ChatMessageFragment
    }
    lastMessage {
        __typename
        ...ChatMessageFragment
    }
    unreadMessagesCount
}`;

export const getChatMessagesQuery = `
query GetChatMessages($chatID: ID!) {
    chatQueries {
        historyMessages(input: { chatID: $chatID }) {
            items {
                __typename
                ...ChatMessageFragment
            }
            pagination {
                __typename
                ...PaginationByCursorFragment
            }
        }
    }
}
fragment ChatMessageFragment on Message {
    id
    text
    createdAt
    isDeleted
    isRead
    user {
        id
        name
        avatar {
            url
        }
        hasActiveSubscription
    }
    parentMessage {
        id
        text
        isDeleted
        user {
            name
            hasActiveSubscription
        }
    }
}
fragment PaginationByCursorFragment on PaginationByCursor {
    endCursor
    startCursor
    totalItemsCount
    hasNextPage
    hasPrevPage
}
`;

export const chatListQuery = `
    query ChatList($appName: String!) {
    chatQueries {
        __typename
        getChatroomList(appName: $appName) {
            __typename
            ...ChatPreviewCardFragment
        }
    }
}
fragment ChatPreviewCardFragment on GetChatroomResolver {
    __typename
    firstUnreadMessage {
        __typename
        id
        createdAt
        isRead
    }
    lastMessage {
        __typename
        id
        createdAt
        text
        user {
            __typename
            name
        }
        isRead
    }
    chatroom {
        __typename
        name
        id
        type
        isPinned
        logos {
            __typename
            url
        }
    }
}
`;

export const getChatsQuery = `
query GetChats($appName: String!) {
    chatQueries {
        getChatroomList(appName: $appName) {
            __typename
            ...ChatRoomFragment
        }
    }
}
fragment ChatMessageFragment on Message {
    id
    text
    createdAt
    isDeleted
    isRead
    user {
        id
        name
        avatar {
            url
        }
        hasActiveSubscription
    }
    parentMessage {
        id
        text
        isDeleted
        user {
            name
            hasActiveSubscription
        }
    }
}
fragment ChatRoomFragment on GetChatroomResolver {
    chatroom {
        id
        name
        isPinned
        logos {
            url
        }
    }
    chattyUsers {
        user {
            id
            avatar {
                url
            }
            name
            hasActiveSubscription
        }
    }
    firstUnreadMessage {
        __typename
        ...ChatMessageFragment
    }
    lastMessage {
        __typename
        ...ChatMessageFragment
    }
    unreadMessagesCount
}`;

export const GetChatRoomQuery = `
query GetChatRoom($id: ID!) {
    chatQueries {
        getChatroom(id: $id) {
            __typename
            ...ChatRoomFragment
        }
    }
}
fragment ChatMessageFragment on Message {
    id
    text
    createdAt
    isDeleted
    isRead
    user {
        id
        name
        avatar {
            url
        }
        hasActiveSubscription
    }
    parentMessage {
        id
        text
        isDeleted
        user {
            name
            hasActiveSubscription
        }
    }
}
fragment ChatRoomFragment on GetChatroomResolver {
    chatroom {
        id
        name
        isPinned
        logos {
            url
        }
    }
    chattyUsers {
        user {
            id
            avatar {
                url
            }
            name
            hasActiveSubscription
        }
    }
    firstUnreadMessage {
        __typename
        ...ChatMessageFragment
    }
    lastMessage {
        __typename
        ...ChatMessageFragment
    }
    unreadMessagesCount
}
`;

export const ChatroomDetailHistoryUpwardsQuery = `
query ChatroomDetailHistoryUpwards($chatId: ID!, $cursor: String) {
    chatQueries {
        __typename
        getChatroom(id: $chatId) {
            __typename
            chatroom {
                __typename
                name
            }
        }
        historyMessages(
            input: { chatID: $chatId, pagination: { ByCursor: { first: 20, after: $cursor } } }
        ) {
            __typename
            ...ChatroomDetailContentFragment
        }
    }
}
fragment ChatMessageCellFragment on Message {
    __typename
    id
    isRead
    isDeleted
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
    parentMessage {
        __typename
        id
        text
        isDeleted
        user {
            __typename
            hasActiveSubscription
            name
        }
    }
    createdAt
    text
}
fragment ChatroomDetailContentFragment on HistoryMessageResolver {
    __typename
    items {
        __typename
        ...ChatMessageCellFragment
    }
    pagination {
        __typename
        ... on PaginationByCursor {
            startCursor
            endCursor
            hasNextPage
            hasPrevPage
        }
    }
}
`;

export const GetChatMessagesByAnchorIdQuery = `
    query GetChatMessagesByAnchorId($input: MiddleMessagesInput!) {
    chatQueries {
        middleMessages(input: $input) {
            items {
                __typename
                ...ChatMessageFragment
            }
            pagination {
                __typename
                ...PaginationByCursorFragment
            }
        }
    }
}
fragment ChatMessageFragment on Message {
    id
    text
    createdAt
    isDeleted
    isRead
    user {
        id
        name
        avatar {
            url
        }
        hasActiveSubscription
    }
    parentMessage {
        id
        text
        isDeleted
        user {
            name
            hasActiveSubscription
        }
    }
}
fragment PaginationByCursorFragment on PaginationByCursor {
    endCursor
    startCursor
    totalItemsCount
    hasNextPage
    hasPrevPage
}
`;

export const getChatUnreadMessagesCountQuery = `query GetChatUnreadMessagesCount($entityID: ID!) {
    chatQueries {
        getChatroomByEntityID(entityID: $entityID) {
            totalMessagesCount
            unreadMessagesCount
            __typename
        }
        __typename
    }
}`;

export const getChatListUnreadMessagesQuery = `
query ChatListUnreadMessages($appName: String!) {
    chatQueries {
        __typename
        getChatroomList(appName: $appName) {
            __typename
            firstUnreadMessage {
                __typename
                id
            }
        }
    }
}
`;

export const getChatByEntityIdQuery = `
query ChatByEntityId ($entityID: ID!) {
    chatQueries {
        __typename
        getChatroomByEntityID(entityID:$entityID) {
            __typename
            firstUnreadMessage {
                __typename
                id
                isRead
            }
            chatroom {
                __typename
                id
            }
        }
    }
}
`;

export const getChatMiddleMessagesQuery = `
query GetChatMiddleMessages(
    $id: ID!
    $chatID: ID!
) {
    chatQueries {
        middleMessages(
            input: {
                id: $id
                chatID: $chatID
                afterCount: 0
                beforeCount: 10
            }
        ) {
            items {
                id
                text
                isRead
                isDeleted
                createdAt
                user {
                    id
                    name
                    avatar {
                        webp(height: 60, width: 60, quality: 100)
                    }
                }
                parentMessage {
                    id
                    text
                    isRead
                    isDeleted
                    createdAt
                    user {
                        id
                        name
                        avatar {
                            webp(height: 60, width: 60, quality: 100)
                        }
                    }
                }
            }
        }
    }
}
`;

export const getChatroomDetailMiddleQuery = `
query ChatroomDetailMiddle($chatId: ID!, $middleId: ID!) {
    chatQueries {
        __typename
        getChatroom(id: $chatId) {
            __typename
            chatroom {
                __typename
                name
            }
        }
        middleMessages(
            input: { id: $middleId, chatID: $chatId, beforeCount: 10, afterCount: 10 }
        ) {
            __typename
            items {
                __typename
                ...ChatMessageCellFragment
            }
            pagination {
                __typename
                ... on PaginationByCursor {
                    startCursor
                    endCursor
                    hasNextPage
                    hasPrevPage
                }
            }
        }
    }
}
fragment ChatMessageCellFragment on Message {
    __typename
    id
    isRead
    isDeleted
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
    parentMessage {
        __typename
        id
        text
        isDeleted
        user {
            __typename
            hasActiveSubscription
            name
        }
    }
    createdAt
    text
}
`;