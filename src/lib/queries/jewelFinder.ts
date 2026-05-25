import { gql } from 'graphql-request';

export const FINDER_PRODUCT_FRAGMENT = gql`
  fragment FinderProductFragment on Product {
    id
    title
    handle
    availableForSale
    productType
    tags
    priceRange {
      minVariantPrice { amount currencyCode }
    }
    featuredImage { url altText width height }
    images(first: 2) {
      edges { node { url altText width height } }
    }
    variants(first: 1) {
      edges {
        node {
          id
          quantityAvailable
          compareAtPrice { amount currencyCode }
        }
      }
    }
  }
`;

export const FINDER_QUERY_BY_COLLECTION = gql`
  query finderByCollection(
    $collectionHandle: String!
    $first: Int!
    $filters: [ProductFilter!]
    $language: LanguageCode
  ) @inContext(language: $language) {
    collection(handle: $collectionHandle) {
      products(first: $first, filters: $filters, sortKey: BEST_SELLING) {
        edges { node { ...FinderProductFragment } }
      }
    }
  }
  ${FINDER_PRODUCT_FRAGMENT}
`;

export const FINDER_QUERY_GLOBAL = gql`
  query finderGlobal(
    $productQuery: String!
    $first: Int!
    $language: LanguageCode
  ) @inContext(language: $language) {
    products(first: $first, query: $productQuery, sortKey: BEST_SELLING) {
      edges { node { ...FinderProductFragment } }
    }
  }
  ${FINDER_PRODUCT_FRAGMENT}
`;
