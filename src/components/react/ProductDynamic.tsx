import { useState, useEffect } from 'react';
import { clientStorefrontQuery } from '../../lib/shopify';
import ProductPage from './product/ProductPage';

export default function ProductDynamic() {
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<any>(null);
    const [error, setError] = useState(false);
    const [lang, setLang] = useState<'es' | 'en'>('es');

    useEffect(() => {
        const pathParts = window.location.pathname.split('/');
        const currentLang = pathParts.includes('en') ? 'en' : 'es';
        setLang(currentLang);

        const fetchProduct = async () => {

            try {
                // Extract handle from URL: /producto/handle-name
                const pathParts = window.location.pathname.split('/');
                let handle = pathParts[pathParts.length - 1];
                if (!handle) handle = pathParts[pathParts.length - 2];

                if (!handle) {
                    setError(true);
                    setLoading(false);
                    return;
                }

                console.log("Intentando cargar producto dinámicamente:", handle);

                const GET_PRODUCT_BY_HANDLE = `
                query getProductByHandle($handle: String!, $language: LanguageCode) @inContext(language: $language) {
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
                }`;

                // Usando clientStorefrontQuery para respetar el idioma activo (ES/EN)
                const response: any = await clientStorefrontQuery(GET_PRODUCT_BY_HANDLE, { handle });

                if (response?.product) {
                    setProduct(response.product);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !product) {
        return null; // Parent 404 will show default error
    }

    return (
        <div className="animate-fade-in relative pt-32 lg:pt-40">
            <div className="absolute top-28 left-0 w-full z-50 bg-[#d4af37]/90 text-black text-center text-xs font-bold py-1 uppercase tracking-widest pointer-events-none">
                {lang === 'en' ? 'Newly Arrived Product (Dynamic Fetch)' : 'Producto Recién Llegado (Carga Dinámica)'}
            </div>
            {/* Render full Product Page Component */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ProductPage product={product} lang={lang} />
            </div>
        </div>
    );
}
