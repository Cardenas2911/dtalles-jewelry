import React, { useState } from 'react';

export default function Footer() {
    // Accordion State for Mobile
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const currentYear = new Date().getFullYear();

    // Payment Icons (Simple SVG placeholders or use a library if available)
    // Using simple text for now or inline SVGs for cleaner look.

    return (
        <footer className="bg-[#050505] text-[#FAFAF5] w-full pt-20 pb-10 border-t border-[#d4af37]/20 relative overflow-hidden font-sans">

            {/* JSON-LD Schema for Local SEO */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "JewelryStore",
                    "name": "Dtalles Jewelry",
                    "image": "https://dtallesjewelry.com/logo.png", // Update with real logo URL
                    "description": "Joyería fina en Miami especializada en Oro 14k, Cuban Links y piezas personalizadas.",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "123 Jewelry Way", // Update with real address
                        "addressLocality": "Miami",
                        "addressRegion": "FL",
                        "postalCode": "33132",
                        "addressCountry": "US"
                    },
                    "priceRange": "$$",
                    "openingHours": "Mo-Sa 10:00-19:00",
                    "telephone": "+13051234567" // Update real phone
                })
            }} />

            <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-20">

                {/* 1. Newsletter Section (Círculo Dorado) */}
                <div className="max-w-2xl mx-auto text-center mb-24">
                    <h2 className="text-[#d4af37] font-serif text-2xl md:text-3xl mb-3 tracking-wide">Únete al Círculo Dorado</h2>
                    <p className="text-gray-400 text-sm mb-8 font-light">Acceso anticipado a piezas únicas y ofertas privadas en Miami.</p>

                    <form className="flex flex-col items-center gap-4">
                        <div className="relative w-full max-w-md">
                            <input
                                type="email"
                                placeholder="Tu correo electrónico"
                                className="w-full bg-transparent border-b border-[#d4af37]/50 py-3 text-[#FAFAF5] placeholder-gray-600 focus:outline-none focus:border-[#d4af37] transition-colors text-center font-light"
                                required
                            />
                            <button
                                type="submit"
                                className="absolute right-0 top-3 text-[#d4af37] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Suscribirme
                            </button>
                        </div>

                        {/* Ethical Checkbox */}
                        <div className="flex items-start gap-2 mt-2">
                            <input
                                type="checkbox"
                                id="privacy"
                                className="mt-1 w-3 h-3 border border-gray-600 rounded-sm bg-transparent accent-[#d4af37] cursor-pointer"
                            />
                            <label htmlFor="privacy" className="text-[10px] text-gray-500 text-left leading-tight cursor-pointer select-none">
                                Acepto recibir comunicaciones de DTalles Jewelry. <br />
                                Respetamos tu privacidad. Sin spam.
                            </label>
                        </div>
                    </form>
                </div>

                {/* 2. Main Navigation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20 border-b border-[#d4af37]/10 pb-20">

                    {/* Col 1: Brand Identity */}
                    <div className="flex flex-col items-start">
                        {/* Logo Placeholder */}
                        <a href="/" className="mb-6 block">
                            <img
                                src="/images/Logo.webp"
                                alt="Dtalles Jewelry"
                                className="h-24 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                            />
                        </a>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs font-light">
                            Elevando el estándar del oro en Miami. Joyería fina garantizada para los momentos que importan.
                        </p>
                        {/* Social Icons */}
                        <div className="flex gap-6">
                            <a href="#" aria-label="Síguenos en Instagram" className="text-[#FAFAF5] hover:text-[#d4af37] transition-transform hover:-translate-y-1 duration-300">
                                <span className="material-symbols-outlined text-xl">thumb_up</span> {/* Placeholder for IG icon */}
                            </a>
                            <a href="#" aria-label="Síguenos en TikTok" className="text-[#FAFAF5] hover:text-[#d4af37] transition-transform hover:-translate-y-1 duration-300">
                                <span className="material-symbols-outlined text-xl">play_circle</span> {/* Placeholder for TikTok */}
                            </a>
                            <a href="#" aria-label="Contáctanos por WhatsApp" className="text-[#FAFAF5] hover:text-[#d4af37] transition-transform hover:-translate-y-1 duration-300">
                                <span className="material-symbols-outlined text-xl">chat</span> {/* Placeholder for WhatsApp */}
                            </a>
                        </div>
                    </div>

                    {/* Col 2: Collections (Accordion on Mobile) */}
                    <div>
                        <button
                            onClick={() => toggleSection('collections')}
                            className="w-full flex justify-between items-center md:cursor-auto"
                        >
                            <h3 className="text-[#d4af37] font-serif text-base uppercase tracking-widest mb-4 md:mb-6">Colecciones</h3>
                            <span className={`material-symbols-outlined md:!hidden text-[#d4af37] transition-transform ${openSection === 'collections' ? 'rotate-180' : ''}`}>expand_more</span>
                        </button>

                        <ul className={`space-y-3 overflow-hidden transition-all duration-300 md:max-h-full ${openSection === 'collections' ? 'max-h-96' : 'max-h-0'}`}>
                            <li><a href="/hombre" className="text-gray-300 hover:text-[#d4af37] hover:pl-2 transition-all duration-300 text-sm font-light block">Para Él (10k & 14k)</a></li>
                            <li><a href="/mujer" className="text-gray-300 hover:text-[#d4af37] hover:pl-2 transition-all duration-300 text-sm font-light block">Para Ella</a></li>
                            <li><a href="/hombre/cuban-links" className="text-gray-300 hover:text-[#d4af37] hover:pl-2 transition-all duration-300 text-sm font-light block">Cuban Links</a></li>
                            <li><a href="/coleccion/religiosa" className="text-gray-300 hover:text-[#d4af37] hover:pl-2 transition-all duration-300 text-sm font-light block">Religiosos</a></li>
                            <li><a href="/servicios/vender-oro" className="text-gray-300 hover:text-[#d4af37] hover:pl-2 transition-all duration-300 text-sm font-light block">Vender Oro</a></li>
                        </ul>
                    </div>

                    {/* Col 3: Assistance (Accordion on Mobile) */}
                    <div>
                        <button
                            onClick={() => toggleSection('assistance')}
                            className="w-full flex justify-between items-center md:cursor-auto"
                        >
                            <h3 className="text-[#d4af37] font-serif text-base uppercase tracking-widest mb-4 md:mb-6">Asistencia</h3>
                            <span className={`material-symbols-outlined md:!hidden text-[#d4af37] transition-transform ${openSection === 'assistance' ? 'rotate-180' : ''}`}>expand_more</span>
                        </button>

                        <ul className={`space-y-3 overflow-hidden transition-all duration-300 md:max-h-full ${openSection === 'assistance' ? 'max-h-96' : 'max-h-0'}`}>
                            <li><a href="/rastrear-orden" className="text-gray-300 hover:text-[#d4af37] hover:pl-2 transition-all duration-300 text-sm font-light block">Rastrear mi Orden</a></li>
                            <li><a href="/guia-tallas" className="text-gray-300 hover:text-[#d4af37] hover:pl-2 transition-all duration-300 text-sm font-light block">Guía de Tallas</a></li>
                            <li><a href="/devoluciones" className="text-gray-300 hover:text-[#d4af37] hover:pl-2 transition-all duration-300 text-sm font-light block">Política de Devolución</a></li>
                            <li><a href="/garantia" className="text-gray-300 hover:text-[#d4af37] hover:pl-2 transition-all duration-300 text-sm font-light block">Garantía de Por Vida</a></li>
                            <li><a href="/faq" className="text-gray-300 hover:text-[#d4af37] hover:pl-2 transition-all duration-300 text-sm font-light block">Preguntas Frecuentes</a></li>
                        </ul>
                    </div>

                    {/* Col 4: Contact (Always Visible) */}
                    <div>
                        <h3 className="text-[#d4af37] font-serif text-base uppercase tracking-widest mb-6">Visítanos</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4">
                                <span className="material-symbols-outlined text-[#d4af37] mt-1 text-lg">location_on</span>
                                <a href="https://maps.google.com/?q=Miami,FL" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#d4af37] transition-colors text-sm font-light leading-relaxed">
                                    123 Jewelry Way,<br />Miami, FL 33132
                                </a>
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-[#d4af37] text-lg">call</span>
                                <a href="tel:+13051234567" className="text-gray-300 hover:text-[#d4af37] transition-colors text-sm font-light">
                                    (305) 123-4567
                                </a>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="material-symbols-outlined text-[#d4af37] mt-1 text-lg">schedule</span>
                                <span className="text-gray-300 text-sm font-light leading-relaxed">
                                    Lunes a Sábado<br />10:00am - 7:00pm
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 3. Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-gray-500 uppercase tracking-widest">
                    {/* Copyright */}
                    <div className="order-2 md:order-1">
                        &copy; {currentYear} Dtalles Jewelry. Todos los derechos reservados.
                    </div>

                    {/* Legal Links */}
                    <div className="flex gap-6 order-1 md:order-2">
                        <a href="/legal/terms" className="hover:text-[#d4af37] transition-colors">Términos</a>
                        <a href="/legal/privacy" className="hover:text-[#d4af37] transition-colors">Privacidad</a>
                        <a href="/legal/accessibility" className="hover:text-[#d4af37] transition-colors">Accesibilidad</a>
                    </div>

                    {/* Payment Icons (Text for now to keep it sterile/fast, or SVGs) */}
                    <div className="flex gap-3 order-3 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Simple CSS placeholders for payment icons to keep it performant */}
                        <div className="w-8 h-5 border border-gray-700 rounded flex items-center justify-center text-[6px]">VISA</div>
                        <div className="w-8 h-5 border border-gray-700 rounded flex items-center justify-center text-[6px]">MC</div>
                        <div className="w-8 h-5 border border-gray-700 rounded flex items-center justify-center text-[6px]">AMEX</div>
                        <div className="w-8 h-5 border border-gray-700 rounded flex items-center justify-center text-[6px]">PAYPAL</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
