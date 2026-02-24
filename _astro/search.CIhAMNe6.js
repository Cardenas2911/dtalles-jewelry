import{g as e}from"./gql.BxQgxVmM.js";const t=e`
  query searchProducts($query: String!, $first: Int = 10) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
          }
          variants(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`;export{t as S};
