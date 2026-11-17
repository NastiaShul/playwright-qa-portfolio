export const createChatroomMutation = `
  mutation AdminMutations($input: CreateChatroomInput!) {
    adminMutations {
      chatMutations {
        createChatroom(input: $input) {
          type
          name
          entityID
          isPinned
          createdAt
          appName
          id
        }
      }
    }
  }
`;

export const deleteChatroomMutation = `
  mutation AdminMutations($id: ID!) {
    adminMutations {
      chatMutations {
        deleteChatroom(id: $id)
      }
    }
  }
`;

export const createMessageMutation = `
  mutation ChatMutations($chatID: ID!, $text: String!) {
    chatMutations {
      createMessage(input: { chatID: $chatID, text: $text }) {
        id
        chatID
        text
      }
    }
  }
`;

export const deleteMessageMutation = `
  mutation ChatMutations($id: ID!) {
    chatMutations {
      deleteMessage(id: $id)
    }
  }
`;