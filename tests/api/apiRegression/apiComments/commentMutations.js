export const createComment = `
mutation CommentsMutations(
    $commentText: String!,
    $objectId: ID!,
    $objectClass: ObjectClass!,
    $userId: ID,
    $appName: String
) {
    commentsMutations {
        create(
            input: {
                text: $commentText,
                objectId: $objectId,
                objectClass: $objectClass,
                userId: $userId,
                appName: $appName
            }
        ) {
            id
            objectClass
            objectId
            text
            user {
                id
                name
            }
        }
    }
}
`;

export const createReply = `mutation CommentsMutations($commentText: String!, $objectId: ID!, $objectClass: ObjectClass!, $parentId: ID!) {
    commentsMutations {
        create(input: { text: $commentText, objectId: $objectId, objectClass: $objectClass, parentId: $parentId }) {
            id
            objectClass
            objectId
            text
            threadId
        }
    }
}`;

export const editComment = `mutation CommentsMutations ($commentID: ID!, $editCommentText: String!, $objectId: ID!, $objectClass: ObjectClass!) {
    commentsMutations {
        editText(
            input: {
                commentID: $commentID
                text: $editCommentText
                parentObjectID: $objectId
                parentObjectClass: $objectClass
            }
        ) {
            id
            objectClass
            objectId
            text
            parentObject {
                ... on News {
                    id
                }
            }
        }
    }
}`;

export const deleteComment = `mutation CommentsMutations($commentID: ID!, $parentObjectID: ID!, $parentObjectClass: ObjectClass!) {
    commentsMutations {
        delete(
            input: { 
                commentID: $commentID, 
                parentObjectID: $parentObjectID, 
                parentObjectClass: $parentObjectClass 
            }
        ) {
            id
            isDeleted
        }
    }
}`;

export const adminDeleteComment = `
mutation AdminMutations(
    $commentID: ID!
    $parentObjectID: ID!
    $parentObjectClass: ObjectClass!
) {
    adminMutations {
        commentsMutations {
            delete(input: { ID: $commentID, ParentObjectClass: $parentObjectClass, ParentObjectID: $parentObjectID})
        }
    }
}
`;