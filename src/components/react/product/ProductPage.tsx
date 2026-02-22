import React, { useState, useEffect } from 'react';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductDetails from './ProductDetails';
import StickyBottomBar from './StickyBottomBar';
import { fetchLiveProductData, type LiveProductData } from '../../../lib/storefrontLive';

interface ProductPageProps {
    product: any; // Using any for flexibility with graphQL response structure, can tighten later
}

export default function ProductPage({ product }: ProductPageProps) {
    const initialVariants = product.variants.edges.map((e: any) => e.node);

    // Datos en vivo desde Shopify (se actualizan sin rebuild)
    const [liveProduct, setLiveProduct] = useState<LiveProductData | null>(null);
    const [livePriceLoading, setLivePriceLoading] = useState(true);

    const variants = liveProduct?.variants ?? initialVariants;

    // Estado base para la selección del usuario. Inicialmente apunta la primera variante.
    const [selectedVariant, setSelectedVariant] = useState(initialVariants[0]);

    useEffect(() => {
        if (!product?.id) {
            setLivePriceLoading(false);
            return;
        }
        setLivePriceLoading(true);
        fetchLiveProductData(product.id).then((fetched) => {
            if (fetched) {
                setLiveProduct(fetched);
            }
            setLivePriceLoading(false);
        });
    }, [product.id]);

    // Cuando llegan nuevas variantes vivas, buscar la equivalente (por título o SKU) para asegurar match total
    useEffect(() => {
        if (liveProduct?.variants) {
            // Emparejar de forma segura usando el título de la variante ("Talla 10", "Default Title", etc) o SKU
            // Esto esquiva la pesadilla de las IDs de Shopify (numéricas vs Base64 vs gid://).
            const matchingLiveVariant = liveProduct.variants.find(
                (lv: any) => lv.title === selectedVariant.title || (lv.sku && lv.sku === selectedVariant.sku)
            );

            if (matchingLiveVariant) {
                setSelectedVariant(matchingLiveVariant);
            }
        }
    }, [liveProduct]);

    const handleVariantChange = (variant: any) => {
        setSelectedVariant(variant);
    };

    // Helper to extract human-readable value from metaobject or simple field
    const getMetafieldValue = (field: any) => {
        if (!field) return undefined;

        // Function that extracts label/name from a single metaobject node
        const extractFromNode = (node: any) => {
            if (node && node.fields) {
                const labelField = node.fields.find((f: any) => f.key === 'label' || f.key === 'name');
                if (labelField) return labelField.value;
                if (node.fields.length > 0) return node.fields[0].value;
            }
            return null;
        };

        // Case 1: Single Reference (Metaobject)
        if (field.reference) {
            const val = extractFromNode(field.reference);
            if (val) return val;
        }

        // Case 2: Multiple References (List of Metaobjects)
        if (field.references && field.references.nodes && field.references.nodes.length > 0) {
            const values = field.references.nodes.map(extractFromNode).filter(Boolean);
            if (values.length > 0) return values.join(', ');
        }

        // Case 3: Parse JSON String (often GID lists are stored as JSON strings if raw)
        if (field.value && (field.value.startsWith('[') || field.value.startsWith('{'))) {
            try {
                const parsed = JSON.parse(field.value);
                if (Array.isArray(parsed)) return parsed.join(', ');
            } catch (e) {
                // ignore
            }
        }

        // Fallback: If it's a GID string (starts with gid://), return generic fallback or empty
        // We don't want to show raw GIDs to the user
        if (typeof field.value === 'string' && field.value.startsWith('gid://')) {
            return undefined;
        }

        return field.value;
    };

    // Prepare details object from metafields
    // Taxonomía Check: Priority to specific jewelry fields (Shopify Namespace), fallback to generic

    // Extract values using helper
    const getField = (key: keyof LiveProductData) => {
        // Usa el valor vivo si existe
        if (liveProduct && liveProduct[key] !== undefined) {
            return liveProduct[key];
        }
        // Si no, usa el estático inicial
        return product[key];
    };

    const mat = getMetafieldValue(getField('shopifyMaterial')) || getMetafieldValue(getField('material'));
    const col = getMetafieldValue(getField('shopifyColor'));
    const age = getMetafieldValue(getField('shopifyAgeGroup'));
    const gen = getMetafieldValue(getField('shopifyGender'));
    const des = getMetafieldValue(getField('shopifyNecklaceDesign'));
    const typ = getMetafieldValue(getField('shopifyJewelryType'));

    const vendor = getField('vendor');
    const tags = getField('tags');
    const descriptionHtml = getField('descriptionHtml');
    const productTypeLive = getField('productType');

    // Priority on taxonomy fields
    const productType = product.productCategory?.productTaxonomyNode?.name || product.category?.name || typ || productTypeLive;

    const details = {
        material: mat,
        weight: getField('pesoReal')?.value,
        width: getField('anchoMm')?.value,
        descriptionHtml: descriptionHtml,
        // Requested Fields from Taxonomy:
        vendor: vendor,
        tags: tags,
        // Try productCategory, then category, then new jewelryType, then productType
        productType: productType,
        collections: product.collections?.edges?.map((e: any) => e.node.title),

        // New specific taxonomy fields
        color: col,
        ageGroup: age,
        gender: gen,
        design: des
    };

    // Product Title
    const title = getField('title') || product.title;

    // Images conversion
    const images = product.images.edges.map((e: any) => e.node);
    const featuredImage = images[0]?.url;

    return (
        <div className="pb-32 lg:pb-0"> {/* Padding for sticky bar */}
            {/* Main Grid: Gallery + Buy Box */}
            <div className="flex flex-col lg:grid lg:grid-cols-[40%_60%] lg:gap-16 items-start">

                {/* Left Col: Gallery (Sticky) */}
                <div className="w-full lg:max-w-[500px] lg:mx-auto lg:sticky lg:top-[300px] lg:self-start max-h-[calc(100vh-320px)] overflow-y-auto hide-scrollbar">
                    <ProductGallery
                        images={images}
                        videoUrl={product.videoUrl?.value}
                    />
                </div>

                {/* Right Col: Info (Buy Box) + Details */}
                <div className="mt-8 lg:mt-0 px-4 lg:px-0 flex flex-col gap-8">
                    <ProductInfo
                        product={{ ...product, title: title, featuredImage: { url: featuredImage } }}
                        variants={variants}
                        selectedVariant={selectedVariant}
                        onVariantChange={handleVariantChange}
                        livePriceLoading={livePriceLoading}
                    />

                    <ProductDetails details={details} />
                </div>
            </div>

            {/* Below Fold: Details - MOVED UP */}

            {/* Mobile Sticky Bar - REMOVED (Now handled internally by ProductInfo -> StickyAddToCart) */}
            {/* <StickyBottomBar ... /> */}
        </div>
    );
}
