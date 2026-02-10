import { gql } from 'graphql-request';

export const ALL_PRODUCTS_QUERY = gql`
  query AllProducts($first: Int!, $cursor: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, after: $cursor, sortKey: $sortKey, reverse: $reverse) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          id
          title
          handle
          description
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
            width
            height
          }
          variants(first: 1) {
            edges {
              node {
                id
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
          productType
          tags
        }
      }
    }
  }
`;
