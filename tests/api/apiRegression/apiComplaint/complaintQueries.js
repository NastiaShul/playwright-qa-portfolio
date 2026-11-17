export const complaintsListQuery = `
query ComplaintsQueries($objectClass: ObjectClass!) {
    complaintsQueries {
        feed(
            input: {
                objectClass: $objectClass
                status: OPEN
                pagination: { first: 50 }
                order: LAST_COMPLAINT_DESC
            }
        ) {
            list {
                id
                status
                text
                user {
                    id
                    name
                    roles {
                        ID
                    }
                }
            }
        }
    }
}`;