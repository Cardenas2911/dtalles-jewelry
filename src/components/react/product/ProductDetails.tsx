import React, { useState } from 'react';
import { getTranslationFunctionForLang } from '../../../i18n/utils';
import { tagTranslations } from '../../../i18n/ui';

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
    };
    lang?: 'es' | 'en';
}

export default function ProductDetails({ details, lang = 'es' }: ProductDetailsProps) {
    const [openSection, setOpenSection] = useState<string | null>('specs');
    const t = getTranslationFunctionForLang(lang);

    const toggle = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className="border-t border-white/10 pt-6">
            <h2 className="text-lg font-serif text-[#FAFAF5] mb-6 italic">{t('details.transparencia')}</h2>

            <div className="max-w-3xl mx-auto flex flex-col divide-y divide-white/10">

                {/* 1. Especificaciones Técnicas (Specs) */}
                <div className="group">
                    <button
                        onClick={() => toggle('specs')}
                        className="w-full py-6 flex justify-between items-center text-left hover:text-[#d4af37] transition-colors"
                    >
                        <span className="text-sm font-bold uppercase tracking-widest text-[#FAFAF5]">{t('details.fichaTecnica')}</span>
                        <span className={`material-symbols-outlined transition-transform duration-300 ${openSection === 'specs' ? 'rotate-180 text-[#d4af37]' : 'text-gray-500'}`}>expand_more</span>
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === 'specs' ? 'max-h-[800px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-sm">
                            {details.vendor && (
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs uppercase mb-1">{t('details.proveedor')}</span>
                                    <span className="text-white font-medium">{details.vendor}</span>
                                </div>
                            )}
                            {details.collections && details.collections.length > 0 && (
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs uppercase mb-1">{t('details.coleccion')}</span>
                                    <span className="text-white font-medium">
                                        {details.collections.join(', ')}
                                    </span>
                                </div>
                            )}
                            {details.productType && (
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs uppercase mb-1">{t('details.categoria')}</span>
                                    <span className="text-white font-medium">{details.productType}</span>
                                </div>
                            )}
                            {/* Taxonomy specific fields */}
                            {details.design && (
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs uppercase mb-1">{t('details.diseno')}</span>
                                    <span className="text-white font-medium">{details.design}</span>
                                </div>
                            )}
                            {details.color && (
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs uppercase mb-1">{t('details.color')}</span>
                                    <span className="text-white font-medium">{details.color}</span>
                                </div>
                            )}
                            {details.gender && (
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs uppercase mb-1">{t('details.genero')}</span>
                                    <span className="text-white font-medium">{details.gender}</span>
                                </div>
                            )}
                            {details.ageGroup && (
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs uppercase mb-1">{t('details.edad')}</span>
                                    <span className="text-white font-medium">{details.ageGroup}</span>
                                </div>
                            )}
                            {details.material && (
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs uppercase mb-1">{t('details.material')}</span>
                                    <span className="text-white font-medium">{details.material}</span>
                                </div>
                            )}
                            {details.weight && (
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs uppercase mb-1">{t('details.peso')}</span>
                                    <span className="text-white font-medium">{details.weight} g</span>
                                </div>
                            )}
                            {details.width && (
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs uppercase mb-1">{t('details.ancho')}</span>
                                    <span className="text-white font-medium">{details.width} mm</span>
                                </div>
                            )}

                            {/* Origin Removed as requested */}

                            {details.tags && details.tags.length > 0 && (
                                <div className="flex flex-col col-span-2">
                                    <span className="text-gray-500 text-xs uppercase mb-2">{t('details.etiquetas')}</span>
                                    <div className="flex flex-wrap gap-2">
                                        {details.tags.map(tag => {
                                            const lowerTag = tag.toLowerCase();
                                            const translatedTag = tagTranslations[lang]?.[lowerTag] || tag;
                                            return (
                                                <span key={tag} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300">
                                                    {translatedTag}
                                                </span>
                                            );
                                        })}
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
                        <span className="text-sm font-bold uppercase tracking-widest text-[#FAFAF5]">{t('details.faqTitle')}</span>
                        <span className={`material-symbols-outlined transition-transform duration-300 ${openSection === 'faq' ? 'rotate-180 text-[#d4af37]' : 'text-gray-500'}`}>expand_more</span>
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === 'faq' ? 'max-h-[800px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                        <div className="space-y-6 text-sm text-gray-400 font-light leading-relaxed">
                            <div>
                                <h4 className="text-white font-medium mb-2">{t('details.faq1Title')}</h4>
                                <p>{t('details.faq1Body')}</p>
                            </div>
                            <div>
                                <h4 className="text-white font-medium mb-2">{t('details.faq2Title')}</h4>
                                <p>{t('details.faq2Body')}</p>
                            </div>
                            <div>
                                <h4 className="text-white font-medium mb-2">{t('details.faq3Title')}</h4>
                                <p>{t('details.faq3Body')}</p>
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
