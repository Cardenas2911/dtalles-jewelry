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
        sku
        quantityAvailable
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
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
            sku
            availableForSale
            quantityAvailable
            price {
              amount
              currencyCode
            }
            compareAtPrice {
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
      # Try 'category' field (Newer API)
      category {
        name
      }
      # Dump ALL metafields to find keys
      allMetafields: metafields(first: 50) {
        edges {
          node {
            namespace
            key
            value
          }
        }
      }
      # Candidates (Keep them just in case)
      material: metafield(namespace: "custom", key: "material") {
        value
        type
      }
      # Shopify Taxonomy Metafields (Metaobjects)
      shopifyColor: metafield(namespace: "shopify", key: "color-pattern") {
        value
        reference {
          ... on Metaobject {
            fields {
              key
              value
            }
          }
        }
        references(first: 10) {
          nodes {
            ... on Metaobject {
              fields {
                key
                value
              }
            }
          }
        }
      }
      shopifyAgeGroup: metafield(namespace: "shopify", key: "age-group") {
        value
        reference {
          ... on Metaobject {
            fields {
              key
              value
            }
          }
        }
        references(first: 10) {
          nodes {
            ... on Metaobject {
              fields {
                key
                value
              }
            }
          }
        }
      }
      shopifyGender: metafield(namespace: "shopify", key: "target-gender") {
        value
        reference {
          ... on Metaobject {
            fields {
              key
              value
            }
          }
        }
        references(first: 10) {
          nodes {
            ... on Metaobject {
              fields {
                key
                value
              }
            }
          }
        }
      }
      shopifyMaterial: metafield(namespace: "shopify", key: "jewelry-material") {
        value
        reference {
          ... on Metaobject {
            fields {
              key
              value
            }
          }
        }
        references(first: 10) {
          nodes {
            ... on Metaobject {
              fields {
                key
                value
              }
            }
          }
        }
      }
      shopifyJewelryType: metafield(namespace: "shopify", key: "jewelry-type") {
        value
        reference {
          ... on Metaobject {
            fields {
              key
              value
            }
          }
        }
        references(first: 10) {
          nodes {
            ... on Metaobject {
              fields {
                key
                value
              }
            }
          }
        }
      }
      shopifyNecklaceDesign: metafield(namespace: "shopify", key: "necklace-design") {
        value
        reference {
          ... on Metaobject {
            fields {
              key
              value
            }
          }
        }
        references(first: 10) {
          nodes {
            ... on Metaobject {
              fields {
                key
                value
              }
            }
          }
        }
      }
      
      # Legacy/Custom Candidates (Fallback)
      material: metafield(namespace: "custom", key: "material") {
        value
        type
      }
      videoUrl: metafield(namespace: "custom", key: "video_url") {
        value
        type
      }
      collections(first: 5) {
        edges {
          node {
            title
            handle
          }
        }
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
