import { gql } from 'graphql-request';

export const PRODUCT_FRAGMENT = gql`
  fragment ProductFragment on Product {
  id
  title
  handle
  productType
  tags
  availableForSale
  totalInventory
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
  images(first: 2) {
      edges {
        node {
        url
        altText
        width
        height
      }
    }
  }
  variants(first: 1) {
      edges {
        node {
        id
        quantityAvailable
      }
    }
  }
}
`;

export const GET_PRODUCTS_BY_COLLECTION = gql`
  query getProductsByCollection($handle: String!, $first: Int = 12) {
  collection(handle: $handle) {
    title
    products(first: $first) {
        edges {
          node {
            ...ProductFragment
        }
      }
    }
  }
}
  ${PRODUCT_FRAGMENT}
`;

export const GET_PRODUCT_DETAILS = gql`
  query getProductDetails($id: ID!) {
    product(id: $id) {
      id
      title
      handle
      descriptionHtml
      description
      tags
      productType
      availableForSale
      totalInventory
      vendor
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 20) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            quantityAvailable
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
      # Metafields for "The Jewel Box" Details
      pesoReal: metafield(namespace: "custom", key: "peso_real") {
        value
        type
      }
      anchoMm: metafield(namespace: "custom", key: "ancho_mm") {
        value
        type
      }
      material: metafield(namespace: "custom", key: "material") {
        value
        type
      }
      origen: metafield(namespace: "custom", key: "origen") {
        value
        type
      }
      videoUrl: metafield(namespace: "custom", key: "video_url") {
        value
        type
      }
    }
  }
`;

export const GET_MENU_COLLECTIONS = gql`
  query getMenuCollections {
  collections(first: 10, query: "title:Hombre OR title:Mujer OR title:Religiosa") {
      edges {
        node {
        id
        title
        handle
      }
    }
  }
  `;

export const GET_FEATURED_PRODUCTS = gql`
  query getFeaturedProducts($first: Int = 8) {
    products(first: $first) {
      edges {
        node {
          ...ProductFragment
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
  `;
