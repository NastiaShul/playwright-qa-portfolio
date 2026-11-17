export const createThreadMutatuion = `
  mutation CreateThread($structuredBody: String!, $blogID: ID, $tagIDs: [ID!]) {
    threadMutations {
      create(input: {structuredBody: $structuredBody, blogID: $blogID, tagIDs: $tagIDs})
    }
  }
`;