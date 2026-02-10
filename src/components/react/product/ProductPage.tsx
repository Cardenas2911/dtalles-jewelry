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

    // Prepare details object from metafields
    const details = {
        material: product.material?.value,
        weight: product.pesoReal?.value,
        width: product.anchoMm?.value,
        origin: product.origen?.value,
        descriptionHtml: product.descriptionHtml
    };

    // Images conversion
    const images = product.images.edges.map((e: any) => e.node);
    const featuredImage = images[0]?.url;

    return (
        <div className="pb-32"> {/* Padding for sticky bar */}
            {/* Main Grid: Gallery + Buy Box */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-16 items-start">

                {/* Left Col: Gallery */}
                <div className="w-full">
                    <ProductGallery
                        images={images}
                        videoUrl={product.videoUrl?.value}
                    />
                </div>

                {/* Right Col: Info (Buy Box) */}
                <div className="mt-8 lg:mt-0 px-4 lg:px-0">
                    <ProductInfo
                        product={product}
                        variants={variants}
                        selectedVariant={selectedVariant}
                        onVariantChange={setSelectedVariant}
                    />
                </div>
            </div>

            {/* Below Fold: Details */}
            <div className="px-4 lg:px-0 mt-16">
                <ProductDetails details={details} />
            </div>

            {/* Mobile Sticky Bar */}
            <StickyBottomBar
                product={product}
                selectedVariant={selectedVariant}
                featuredImage={featuredImage}
            />
        </div>
    );
}
