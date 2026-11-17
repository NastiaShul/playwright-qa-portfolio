export const addBookmark = `
mutation BookmarkMutations ($objectClass: ObjectClass!
    $objectID: ID!) {
    bookmarkMutations {
        addBookmark(input: { objectClass: $objectClass, objectID: $objectID }) {
            success
        }
    }
}
`;

export const removeBookmark = `
mutation BookmarkMutations ($objectClass: ObjectClass!
    $objectID: ID!) {
    bookmarkMutations {
        removeBookmark(input: { objectClass: $objectClass, objectID: $objectID }) {
            success
        }
    }
}
`;