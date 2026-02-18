import { client } from './src/lib/shopify';
import { gql } from 'graphql-request';

const query = gql`
  query {
    collections(first: 20) {
      edges {
        node {
          title
          handle
          products(first: 1) {
            edges {
              node {
                title
              }
            }
          }
        }
      }
    }
  }
`;

async function test() {
    try {
        console.log("Consultando Shopify...");
        const data = await client.request(query);
        console.log("Colecciones encontradas:");
        data.collections.edges.forEach(edge => {
            console.log(`- Título: "${edge.node.title}" | Handle: "${edge.node.handle}" | Productos: ${edge.node.products.edges.length}`);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
