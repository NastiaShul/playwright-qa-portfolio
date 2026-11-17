export const getAllThreadsQuery = `
  query ThreadQueries {
    threadQueries {
      feed(input: { pagination: { ByCursor: { last: 50 } } }) {
        items {
          id
        }
      }
    }
  }
`;
