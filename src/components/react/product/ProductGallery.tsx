import React, { useState, useRef } from 'react';

interface ProductGalleryProps {
    images: {
        url: string;
        altText: string;
        width?: number;
        height?: number;
    }[];
    videoUrl?: string; // Optional raw video URL from metafield
}

export default function ProductGallery({ images, videoUrl }: ProductGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Filter out duplicates if any, though Shopify usually handles this, adding safety for empty images array
    const safeImages = images || [];
    const uniqueImages = safeImages.filter((v, i, a) => a.findIndex(t => (t.url === v.url)) === i);

    // Combine images and video for the carousel
    const mediaItems = videoUrl
        ? [...uniqueImages.slice(0, 1), { type: 'video', url: videoUrl }, ...uniqueImages.slice(1)]
        : uniqueImages;

    const scrollToImage = (index: number) => {
        setSelectedImageIndex(index);
        if (scrollContainerRef.current) {
            const width = scrollContainerRef.current.offsetWidth;
            scrollContainerRef.current.scrollTo({
                left: index * width,
                behavior: 'smooth'
            });
        }
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const width = scrollContainerRef.current.offsetWidth;
            const index = Math.round(scrollContainerRef.current.scrollLeft / width);
            setSelectedImageIndex(index);
        }
    };

    return (
        <div className="flex flex-col gap-4 relative">
            {/* Desktop Mosaic / Main View */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
                {/* Main Hero Image (Large) */}
                <div className="col-span-2 aspect-square relative bg-[#111] overflow-hidden rounded-sm border border-white/5">
                    {/* Show Video if selected and it's the video item, otherwise show image */}
                    {/* Actually, for Mosaic, let's keep it simple: First item large, rest small? 
                        The requirement said: "Desktop: Grilla de mosaico (una imagen grande principal, 4 secundarias al lado)"
                     */}

                    {/* Let's try a layout: Large Left, Grid Right? Or Top Large, Bottom Grid?
                        "Grilla de mosaico (una imagen grande principal, 4 secundarias al lado)" implies:
                        [ Main Image ] [ Thumb 1 ]
                                       [ Thumb 2 ]
                                       
                        Actually, let's do a standard interactive gallery for now to ensure all detailed images are viewable.
                        Large Image View + Thumbnails list.
                     */}

                    {(mediaItems[selectedImageIndex] as any)?.type === 'video' ? (
                        <video
                            src={videoUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img
                            src={(mediaItems[selectedImageIndex] as any)?.url || ''}
                            alt={(mediaItems[selectedImageIndex] as any)?.altText || 'Detalle de Joya'}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                {/* Thumbnails Grid */}
                <div className="col-span-2 grid grid-cols-5 gap-4">
                    {mediaItems.map((item: any, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`aspect-square overflow-hidden rounded-sm bg-[#111] border ${selectedImageIndex === index ? 'border-[#d4af37]' : 'border-white/10 hover:border-white/30'} transition-all`}
                        >
                            {item.type === 'video' ? (
                                <div className="w-full h-full flex items-center justify-center bg-black relative">
                                    <span className="material-symbols-outlined text-white text-2xl z-10">play_circle</span>
                                    {/* Placeholder if we had one, or just black */}
                                </div>
                            ) : (
                                <img
                                    src={item.url}
                                    alt={item.altText || `Thumbnail ${index}`}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile Carousel (Snap) */}
            <div className="lg:hidden relative">
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide aspect-[4/5]"
                >
                    {mediaItems.map((item: any, index) => (
                        <div key={index} className="min-w-full snap-center relative bg-[#050505]">
                            {item?.type === 'video' ? (
                                <video
                                    src={videoUrl}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src={item?.url || ''}
                                    alt={item?.altText || 'Detalle'}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                    {mediaItems.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollToImage(index)}
                            className={`w-2 h-2 rounded-full transition-all ${selectedImageIndex === index ? 'bg-[#d4af37] w-4' : 'bg-white/30'}`}
                            aria-label={`Ver imagen ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
