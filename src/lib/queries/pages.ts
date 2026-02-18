import { gql } from 'graphql-request';

export const GET_PAGE = gql`
  query getPage($handle: String!) {
    pageByHandle(handle: $handle) {
      id
      title
      body
      bodySummary
      seo {
        description
        title
      }
      createdAt
      updatedAt
    }
  }
`;
