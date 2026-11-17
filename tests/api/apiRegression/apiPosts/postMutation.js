export const createEmptyPostMutation = `
  mutation PostMutations {
    postMutations {
      createEmpty
    }
  }
`;

export const updatePostMutation = `
  mutation UpdatePost($post: PostUpdateInput!) {
    postMutations {
      update(input: $post) {
                updated {
          id
          title {
            defaultValue
          }
          blog {
            id
            title
          }
        }
      }
    }
  }
`;
