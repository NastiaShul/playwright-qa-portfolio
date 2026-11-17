export const createComplaintMutation = `
mutation ComplaintsMutations($id: ID!, $parentId: ID, $objectClass: ObjectClass!, $parentObjectClass: ObjectClass!) {
    complaintsMutations {
        createComplaint(
            input: {
                objectID: $id
                objectClass: $objectClass
                parentObjectID: $parentId
                parentObjectClass: $parentObjectClass
                type: REPORT
            }
        ) {
            id
            status
            text
        }
    }
}`;