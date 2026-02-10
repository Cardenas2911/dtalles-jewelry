import React, { useState } from 'react';

interface ProductDetailsProps {
    details: {
        material?: string;
        weight?: string;
        width?: string;
        origin?: string;
        descriptionHtml: string;
    }
}

export default function ProductDetails({ details }: ProductDetailsProps) {
    const [openSection, setOpenSection] = useState<string | null>('specs');

    const toggle = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className="mt-16 border-t border-white/10">
            <h2 className="text-xl font-serif text-[#FAFAF5] py-8 text-center italic">Transparencia en los Detalles</h2>

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

                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === 'specs' ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-xs uppercase mb-1">Material</span>
                                <span className="text-white font-medium">{details.material || 'Oro 14k Garantizado'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-xs uppercase mb-1">Peso Aprox.</span>
                                <span className="text-white font-medium">{details.weight ? `${details.weight} g` : 'Variable según talla'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-xs uppercase mb-1">Ancho</span>
                                <span className="text-white font-medium">{details.width ? `${details.width} mm` : 'N/A'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-xs uppercase mb-1">Origen</span>
                                <span className="text-white font-medium">{details.origin || 'Italia / Miami'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-xs uppercase mb-1">Cierre</span>
                                <span className="text-white font-medium">Caja de Seguridad / Langosta</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-xs uppercase mb-1">Garantía</span>
                                <span className="text-white font-medium">De por vida en metal</span>
                            </div>
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
            {details.descriptionHtml && (
                <div className="mt-8 max-w-3xl mx-auto prose prose-sm prose-invert text-gray-500">
                    <div dangerouslySetInnerHTML={{ __html: details.descriptionHtml }} />
                </div>
            )}
        </div>
    );
}
