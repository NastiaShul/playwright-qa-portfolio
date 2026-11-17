export const createBlogMutation = `
    mutation BlogMutations ($title: String!, $description: String!) {
    blogMutations {
        createBlog(input: { title: $title, description: $description }) {
            id
            title
            description
            hru
        }
    }
}
`;

export const deleteBlogMutation = `
  mutation BlogMutations($blogId: ID!) {
    blogMutations {
      deleteBlog(id: $blogId)
    }
  }
`;

export const updateBlogMutation = `
  mutation BlogMutations($id: ID!, $title: String, $description: String, $hru: String) {
    blogMutations {
      updateBlog(input: { id: $id, title: $title, description: $description, hru: $hru }) {
        id
        title
        description
        hru
      }
    }
  }
`;