import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

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
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const nextIndex = (selectedImageIndex + 1) % mediaItems.length;
        scrollToImage(nextIndex);
    };

    const handlePrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const prevIndex = (selectedImageIndex - 1 + mediaItems.length) % mediaItems.length;
        scrollToImage(prevIndex);
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const width = scrollContainerRef.current.offsetWidth;
            const index = Math.round(scrollContainerRef.current.scrollLeft / width);
            setSelectedImageIndex(index);
        }
    };

    // Keyboard navigation limits and event listeners
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isModalOpen) return;
            if (e.key === 'Escape') setIsModalOpen(false);
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };

        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isModalOpen, selectedImageIndex, mediaItems.length]);

    return (
        <div className="flex flex-col gap-4 relative">
            {/* Desktop Mosaic / Main View */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
                {/* Main Hero Image (Large) */}
                <div
                    className="col-span-2 aspect-square relative bg-[#111] overflow-hidden rounded-sm border border-white/5 group cursor-zoom-in"
                    onClick={() => setIsModalOpen(true)}
                >
                    {(mediaItems[selectedImageIndex] as any)?.type === 'video' ? (
                        <video
                            src={videoUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <img
                            src={(mediaItems[selectedImageIndex] as any)?.url || ''}
                            alt={(mediaItems[selectedImageIndex] as any)?.altText || 'Detalle de Joya'}
                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                        />
                    )}

                    <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 text-[#d4af37] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70 hover:scale-110 z-10 backdrop-blur-sm"
                        aria-label="Anterior imagen"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 text-[#d4af37] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70 hover:scale-110 z-10 backdrop-blur-sm"
                        aria-label="Siguiente imagen"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>

                {/* Thumbnails Grid */}
                <div className="col-span-2 grid grid-cols-5 gap-4">
                    {mediaItems.map((item: any, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`aspect-square overflow-hidden rounded-sm bg-[#111] border ${selectedImageIndex === index ? 'border-[#d4af37]' : 'border-white/10 hover:border-white/30'} transition-all hover:scale-[0.98] duration-300 transform-gpu`}
                        >
                            {item.type === 'video' ? (
                                <div className="w-full h-full flex items-center justify-center bg-black relative">
                                    <span className="material-symbols-outlined text-white/50 text-2xl z-10 transition-colors hover:text-white">play_circle</span>
                                </div>
                            ) : (
                                <img
                                    src={item.url}
                                    alt={item.altText || `Thumbnail ${index}`}
                                    className="w-full h-full object-contain"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile Carousel (Snap) */}
            <div className="lg:hidden relative group">
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide aspect-[4/5] relative"
                >
                    {mediaItems.map((item: any, index) => (
                        <div
                            key={index}
                            className="min-w-full snap-center relative bg-[#050505]"
                            onClick={() => setIsModalOpen(true)}
                        >
                            {item?.type === 'video' ? (
                                <video
                                    src={videoUrl}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <img
                                    src={item?.url || ''}
                                    alt={item?.altText || 'Detalle'}
                                    className="w-full h-full object-contain"
                                />
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-[#d4af37] rounded-full flex items-center justify-center z-10 backdrop-blur-sm shadow-md pointer-events-auto"
                    aria-label="Anterior"
                >
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-[#d4af37] rounded-full flex items-center justify-center z-10 backdrop-blur-sm shadow-md pointer-events-auto"
                    aria-label="Siguiente"
                >
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10 pointer-events-none">
                    {mediaItems.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => { e.stopPropagation(); scrollToImage(index); }}
                            className={`h-2 rounded-full transition-all pointer-events-auto ${selectedImageIndex === index ? 'bg-[#d4af37] w-4' : 'bg-white/30 w-2'}`}
                            aria-label={`Ver imagen ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* FULLSCREEN LIGHTBOX MODAL (RENDERED IN PORTAL TO BREAK Z-INDEX CONTEXT) */}
            {isModalOpen && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-md flex flex-col pointer-events-auto transition-all duration-300">
                    {/* Toolbar */}
                    <div className="absolute top-0 right-0 left-0 p-4 md:p-6 flex justify-between items-center z-50">
                        <div className="text-white/60 font-mono text-sm tracking-widest pl-2">
                            {selectedImageIndex + 1} / {mediaItems.length}
                        </div>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full"
                        >
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                    </div>

                    {/* Image Area */}
                    <div
                        className="flex-1 w-full h-full flex items-center justify-center p-0 md:p-16 relative"
                        onClick={() => setIsModalOpen(false)}
                    >
                        {(mediaItems[selectedImageIndex] as any)?.type === 'video' ? (
                            <video
                                src={videoUrl}
                                autoPlay
                                loop
                                controls
                                playsInline
                                className="w-full h-full max-h-[90vh] object-contain pointer-events-auto"
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <img
                                src={(mediaItems[selectedImageIndex] as any)?.url || ''}
                                alt="Zoomed view"
                                className="w-full h-full max-h-[90vh] object-contain select-none pointer-events-auto"
                                onClick={(e) => e.stopPropagation()}
                            />
                        )}
                    </div>

                    <button
                        onClick={handlePrev}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-[#d4af37]/70 hover:text-[#d4af37] transition-all hover:scale-110 z-50 bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-md"
                    >
                        <span className="material-symbols-outlined text-3xl">chevron_left</span>
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-[#d4af37]/70 hover:text-[#d4af37] transition-all hover:scale-110 z-50 bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-md"
                    >
                        <span className="material-symbols-outlined text-3xl">chevron_right</span>
                    </button>
                </div>, document.body
            )}
        </div>
    );
}
