import React, { useState } from 'react';

interface ProductDetailsProps {
    details: {
        material?: string;
        weight?: string;
        width?: string;
        descriptionHtml: string;
        // New Fields
        vendor?: string;
        tags?: string[];
        productType?: string;
        collections?: string[];
        // Taxonomy Extra Fields
        color?: string;
        ageGroup?: string;
        gender?: string;
        design?: string;
        allMetafields?: any[];
    }
}

export default function ProductDetails({ details }: ProductDetailsProps) {
    const [openSection, setOpenSection] = useState<string | null>('specs');

    const toggle = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className="border-t border-white/10 pt-6">
            <h2 className="text-lg font-serif text-[#FAFAF5] mb-6 italic">Transparencia en los Detalles</h2>

            <div className="max-w-3xl mx-auto flex flex-col divide-y divide-white/10">

                {/* 1. Especificaciones Técnicas (Specs) */}
                <div className="group">
                    <button
                        onClick={() => toggle('specs')}
                        className="w-full py-6 flex justify-between items-center text-left hover:text-[#d4af37] transition-colors"
                    >
                        <span className="text-sm font-bold uppercase tracking-widest text-[#FAFAF5]">Ficha Técnica</span>
                        <span className={`material-symbols-outlined transition-transform duration-300 ${openSection === 'specs' ? 'rotate-180 text-[#d4af37]' : 'text-gray-500'}`}>expand_more</span>
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === 'specs' ? 'max-h-[800px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-sm">
                            {details.vendor && (
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs uppercase mb-1">PROVEEDOR</span>
                                    <span className="text-white font-medium">{details.vendor}</span>
                                </div>
                            )}
                            {details.collections && details.collections.length > 0 && (
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs uppercase mb-1">COLECCIÓN</span>
                                    <span className="text-white font-medium">
                                        {details.collections.join(', ')}
                                    </span>
                                </div>
                            )}
                            {details.productType && (
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs uppercase mb-1">CATEGORÍA</span>
                                    <span className="text-white font-medium">{details.productType}</span>
                                </div>
                            )}
                            {/* Taxonomy specific fields */}
                            {details.design && (
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs uppercase mb-1">DISEÑO</span>
                                    <span className="text-white font-medium">{details.design}</span>
                                </div>
                            )}
                            {details.color && (
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs uppercase mb-1">COLOR</span>
                                    <span className="text-white font-medium">{details.color}</span>
                                </div>
                            )}
                            {details.gender && (
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs uppercase mb-1">GÉNERO OBJETIVO</span>
                                    <span className="text-white font-medium">{details.gender}</span>
                                </div>
                            )}
                            {details.ageGroup && (
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs uppercase mb-1">GRUPO DE EDAD</span>
                                    <span className="text-white font-medium">{details.ageGroup}</span>
                                </div>
                            )}
                            {details.material && (
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs uppercase mb-1">MATERIAL</span>
                                    <span className="text-white font-medium">{details.material}</span>
                                </div>
                            )}
                            {details.weight && (
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs uppercase mb-1">PESO APROX.</span>
                                    <span className="text-white font-medium">{details.weight} g</span>
                                </div>
                            )}
                            {details.width && (
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs uppercase mb-1">ANCHO</span>
                                    <span className="text-white font-medium">{details.width} mm</span>
                                </div>
                            )}

                            {/* Origin Removed as requested */}

                            {details.tags && details.tags.length > 0 && (
                                <div className="flex flex-col col-span-2">
                                    <span className="text-gray-500 text-xs uppercase mb-2">ETIQUETAS</span>
                                    <div className="flex flex-wrap gap-2">
                                        {details.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Preguntas Frecuentes (Educación) */}
                <div className="group">
                    <button
                        onClick={() => toggle('faq')}
                        className="w-full py-6 flex justify-between items-center text-left hover:text-[#d4af37] transition-colors"
                    >
                        <span className="text-sm font-bold uppercase tracking-widest text-[#FAFAF5]">Preguntas Frecuentes</span>
                        <span className={`material-symbols-outlined transition-transform duration-300 ${openSection === 'faq' ? 'rotate-180 text-[#d4af37]' : 'text-gray-500'}`}>expand_more</span>
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === 'faq' ? 'max-h-[800px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                        <div className="space-y-6 text-sm text-gray-400 font-light leading-relaxed">
                            <div>
                                <h4 className="text-white font-medium mb-2">¿Es oro sólido real?</h4>
                                <p>Sí. En DTalles solo vendemos oro 10k y 14k garantizado. No vendemos chapado (gold plating) ni "oro laminado". Tu joya es una inversión real que mantiene su valor.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-medium mb-2">¿Cómo sé mi talla?</h4>
                                <p>Para cadenas: 20" y 22" son las medidas estándar para hombre. Para anillos, recomendamos medir el diámetro interior de un anillo que ya uses o visitar una joyería local para una medición exacta.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-medium mb-2">Envíos y Devoluciones</h4>
                                <p>Enviamos asegurado a todo USA en 2-4 días hábiles. Si no te convence, tienes 30 días para devolverlo sin preguntas (la pieza debe estar intacta).</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description HTML fallback if specific description exists */}
            {details.descriptionHtml ? (
                <div className="mt-8 max-w-3xl mx-auto px-4 md:px-0">
                    <div className="prose prose-sm prose-invert text-gray-400 max-w-none overflow-x-auto
                        [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg
                        [&_iframe]:max-w-full [&_table]:w-full [&_table]:block [&_table]:overflow-x-auto"
                        dangerouslySetInnerHTML={{ __html: details.descriptionHtml }}
                    />
                </div>
            ) : null}

        </div>
    );
}
