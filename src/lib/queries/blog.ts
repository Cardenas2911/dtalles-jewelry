import { gql } from 'graphql-request';

export const GET_BLOG_JOBS = gql`
  query getBlogArticles($first: Int = 10) {
    articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
      edges {
        node {
          id
          title
          handle
          publishedAt
          image {
            url
            altText
            width
            height
          }
          authorV2 {
            name
          }
          excerpt
        }
      }
    }
  }
`;

// Note: Shopify usually groups articles under a specific Blog ID/Handle. 
// A generic "articles" query might fetch from all blogs or need a blog handle.
// Correct approach for a specific blog (e.g. "News"):

export const GET_ARTICLES_BY_BLOG = gql`
  query getArticlesByBlog($handle: String!, $first: Int = 12) {
    blog(handle: $handle) {
      title
      articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
        edges {
          node {
            id
            title
            handle
            publishedAt
            image {
              url
              altText
              width
              height
            }
            authorV2 {
              name
            }
            excerpt
          }
        }
      }
    }
  }
`;

export const GET_ARTICLE_BY_HANDLE = gql`
  query getArticle($handle: String!, $blogHandle: String!) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $handle) {
        id
        title
        contentHtml
        publishedAt
        image {
          url
          altText
          width
          height
        }
        authorV2 {
          name
        }
        seo {
          description
          title
        }
      }
    }
  }
`;
