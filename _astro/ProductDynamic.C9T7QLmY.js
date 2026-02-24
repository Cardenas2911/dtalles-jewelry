import{j as t}from"./jsx-runtime.D_zvdyIk.js";import{r}from"./index.DiEladB3.js";import{c as f}from"./shopify.D29yEqNX.js";import u from"./ProductPage.CvWxZW6x.js";import"./cart.DLN6Tch6.js";import"./index.Dpt-qeBV.js";import"./index.daetGfa_.js";import"./PaymentIcons.B5hD3Hx-.js";import"./AffirmPromotionalMessage.D8TcFvn3.js";function P(){const[i,s]=r.useState(!0),[n,c]=r.useState(null),[d,o]=r.useState(!1);return r.useEffect(()=>{(async()=>{try{const e=window.location.pathname.split("/");let a=e[e.length-1];if(a||(a=e[e.length-2]),!a){o(!0),s(!1);return}console.log("Intentando cargar producto dinámicamente:",a);const l=await f.request(`
                query getProductByHandle($handle: String!) {
                    product(handle: $handle) {
                        id
                        title
                        handle
                        descriptionHtml
                        tags
                        productType
                        productCategory {
                            productTaxonomyNode {
                                name
                            }
                        }
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
                                    selectedOptions {
                                        name
                                        value
                                    }
                                }
                            }
                        }
                        # Metafields as requested
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
                }`,{handle:a});l?.product?c(l.product):o(!0)}catch(e){console.error(e),o(!0)}finally{s(!1)}})()},[]),i?t.jsx("div",{className:"flex justify-center items-center py-20 min-h-[50vh]",children:t.jsx("div",{className:"w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"})}):d||!n?null:t.jsxs("div",{className:"animate-fade-in relative pt-32 lg:pt-40",children:[t.jsx("div",{className:"absolute top-28 left-0 w-full z-50 bg-[#d4af37]/90 text-black text-center text-xs font-bold py-1 uppercase tracking-widest pointer-events-none",children:"Producto Recién Llegado (Carga Dinámica)"}),t.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:t.jsx(u,{product:n})})]})}export{P as default};
