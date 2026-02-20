import React, { useState } from 'react';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductDetails from './ProductDetails';
import StickyBottomBar from './StickyBottomBar';

interface ProductPageProps {
    product: any; // Using any for flexibility with graphQL response structure, can tighten later
}

export default function ProductPage({ product }: ProductPageProps) {
    const variants = product.variants.edges.map((e: any) => e.node);
    // Default to first variant
    const [selectedVariant, setSelectedVariant] = useState(variants[0]);

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
    const mat = getMetafieldValue(product.shopifyMaterial) || getMetafieldValue(product.material);
    const col = getMetafieldValue(product.shopifyColor);
    const age = getMetafieldValue(product.shopifyAgeGroup);
    const gen = getMetafieldValue(product.shopifyGender);
    const des = getMetafieldValue(product.shopifyNecklaceDesign);
    const typ = getMetafieldValue(product.shopifyJewelryType);

    const details = {
        material: mat,
        weight: product.pesoReal?.value,
        width: product.anchoMm?.value,
        descriptionHtml: product.descriptionHtml,
        // Requested Fields from Taxonomy:
        vendor: product.vendor,
        tags: product.tags,
        // Try productCategory, then category, then new jewelryType, then productType
        productType: product.productCategory?.productTaxonomyNode?.name || product.category?.name || typ || product.productType,
        collections: product.collections?.edges?.map((e: any) => e.node.title),

        // New specific taxonomy fields
        color: col,
        ageGroup: age,
        gender: gen,
        design: des
    };

    // Images conversion
    const images = product.images.edges.map((e: any) => e.node);
    const featuredImage = images[0]?.url;

    return (
        <div className="pb-32 lg:pb-0"> {/* Padding for sticky bar */}
            {/* Main Grid: Gallery + Buy Box */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-16 items-start">

                {/* Left Col: Gallery (Sticky) */}
                <div className="w-full lg:sticky lg:top-20 lg:self-start">
                    <ProductGallery
                        images={images}
                        videoUrl={product.videoUrl?.value}
                    />
                </div>

                {/* Right Col: Info (Buy Box) + Details */}
                <div className="mt-8 lg:mt-0 px-4 lg:px-0 flex flex-col gap-8">
                    <ProductInfo
                        product={{ ...product, featuredImage: { url: featuredImage } }}
                        variants={variants}
                        selectedVariant={selectedVariant}
                        onVariantChange={setSelectedVariant}
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
