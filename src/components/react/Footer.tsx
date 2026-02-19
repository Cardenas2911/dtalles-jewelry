import React, { useState } from 'react';
import { resolvePath } from '../../utils/paths';

export default function Footer() {
    // Accordion State para movil
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#050505] text-[#FAFAF5] w-full pt-24 pb-10 border-t border-[#d4af37]/20 relative overflow-hidden font-sans">

            {/* Linea dorada superior */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent"></div>

            <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">

                {/* 1. Newsletter Section */}
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-[#d4af37]/10 pb-16 mb-20 gap-10">
                    <div className="max-w-xl">
                        <span className="text-[#d4af37] font-bold text-xs uppercase tracking-[0.2em] mb-4 block">The Gold Circle</span>
                        <h2 className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">
                            Únete a la lista exclusiva.
                        </h2>
                        <p className="text-gray-400 font-light text-sm md:text-base max-w-md leading-relaxed">
                            Recibe acceso anticipado a nuevas colecciones, eventos privados en Miami y ofertas reservadas solo para miembros.
                        </p>
                    </div>

                    <form className="w-full md:max-w-md flex flex-col gap-4">
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="Tu correo electrónico"
                                className="w-full bg-transparent border-b border-gray-700 py-4 text-[#FAFAF5] placeholder-gray-600 focus:outline-none focus:border-[#d4af37] transition-all duration-500 text-lg font-light group-hover:border-gray-500"
                                required
                            />
                            <button
                                type="submit"
                                className="absolute right-0 top-4 text-[#d4af37] hover:text-white transition-colors duration-300"
                                aria-label="Suscribirse"
                            >
                                <span className="material-symbols-outlined text-2xl transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="privacy"
                                className="w-4 h-4 rounded-sm border-gray-700 bg-transparent text-[#d4af37] focus:ring-[#d4af37] focus:ring-offset-black"
                            />
                            <label htmlFor="privacy" className="text-[10px] text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-300 transition-colors">
                                Acepto la política de privacidad
                            </label>
                        </div>
                    </form>
                </div>

                {/* 2. Main Navigation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16 mb-24">

                    {/* Col 1: Brand & Social */}
                    <div className="space-y-8">
                        <a href={resolvePath('/')} className="block w-fit">
                            <img
                                src={resolvePath('/images/Logo.webp')}
                                alt="Dtalles Jewelry"
                                className="h-16 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                            />
                        </a>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-light">
                            Elevando el estándar del oro en Miami. Joyería fina garantizada para los momentos que importan.
                        </p>

                        {/* Iconos de redes sociales con SVG de marca */}
                        <div className="flex gap-3">
                            <SocialLink href="https://www.instagram.com/dtalles_jewelry/" label="Instagram" brandColor="#E1306C">
                                {/* Instagram SVG */}
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px]">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </SocialLink>

                            <SocialLink href="https://www.facebook.com/dtalles.jewelry" label="Facebook" brandColor="#1877F2">
                                {/* Facebook SVG */}
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px]">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </SocialLink>

                            <SocialLink href="https://wa.me/17867644952?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20sus%20joyas" label="WhatsApp" brandColor="#25D366">
                                {/* WhatsApp SVG */}
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px]">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </SocialLink>

                            <SocialLink href="#" label="TikTok (próximamente)" brandColor="#ffffff">
                                {/* TikTok SVG */}
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px]">
                                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.83 1.54V6.77a4.85 4.85 0 01-1.06-.08z" />
                                </svg>
                            </SocialLink>
                        </div>

                        {/* WhatsApp CTA con número */}
                        <a
                            href="https://wa.me/17867644952?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20sus%20joyas"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2.5 text-sm text-gray-400 hover:text-[#25D366] transition-colors duration-300 group"
                        >
                            <span className="w-7 h-7 rounded-full bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
                                <svg viewBox="0 0 24 24" fill="#25D366" className="w-3.5 h-3.5">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </span>
                            +1 (786) 764-4952
                        </a>
                    </div>

                    {/* Col 2: EXPLORAR (Shop) */}
                    <div>
                        <FooterHeading
                            title="Explorar"
                            isOpen={openSection === 'shop'}
                            onClick={() => toggleSection('shop')}
                        />
                        <ul className={`space-y-4 overflow-hidden transition-all duration-500 ${openSection === 'shop' ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0 md:max-h-full md:opacity-100 md:mt-0'}`}>
                            <FooterLink href={resolvePath('/coleccion/nuevo')} label="Lo Nuevo" isNew={true} />
                            <FooterLink href={resolvePath('/coleccion/best-sellers')} label="Más Vendidos" />
                            <FooterLink href={resolvePath('/mujer')} label="Joyería para Ella" />
                            <FooterLink href={resolvePath('/hombre')} label="Joyería para Él" />
                            <FooterLink href={resolvePath('/ninos')} label="Niños & Bebés" />
                            <FooterLink href={resolvePath('/coleccion/religiosa')} label="Colección Religiosa" />
                            <FooterLink href={resolvePath('/guia-regalos')} label="Guía de Regalos" />
                        </ul>
                    </div>

                    {/* Col 3: Atención al Cliente */}
                    <div>
                        <FooterHeading
                            title="Atención al Cliente"
                            isOpen={openSection === 'support'}
                            onClick={() => toggleSection('support')}
                        />
                        <ul className={`space-y-4 overflow-hidden transition-all duration-500 ${openSection === 'support' ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0 md:max-h-full md:opacity-100 md:mt-0'}`}>
                            <FooterLink href={resolvePath('/rastrear')} label="Rastrear mi Orden" highlight={true} />
                            <FooterLink href={resolvePath('/envios')} label="Envíos y Entregas" />
                            <FooterLink href={resolvePath('/devoluciones')} label="Cambios y Devoluciones" />
                            <FooterLink href={resolvePath('/garantia')} label="Garantía de Por Vida" />
                            <FooterLink href={resolvePath('/guia-tallas')} label="Guía de Tallas" />
                            <FooterLink href={resolvePath('/cuidado-joyas')} label="Cuidado de tus Joyas" />
                            <FooterLink href={resolvePath('/faq')} label="Preguntas Frecuentes" />
                        </ul>
                    </div>

                    {/* Col 4: Mundo DTalles */}
                    <div>
                        <FooterHeading
                            title="Mundo DTalles"
                            isOpen={openSection === 'company'}
                            onClick={() => toggleSection('company')}
                        />
                        <ul className={`space-y-4 overflow-hidden transition-all duration-500 ${openSection === 'company' ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0 md:max-h-full md:opacity-100 md:mt-0'}`}>
                            <FooterLink href={resolvePath('/nosotros')} label="Nuestra Historia" />
                            <FooterLink href={resolvePath('/servicios/vender-oro')} label="Vender Oro" highlight={true} />
                            <FooterLink href={resolvePath('/blog')} label="El Blog de Joyería" />
                            <FooterLink href={resolvePath('/contacto')} label="Contáctanos" />
                            <li className="pt-4 border-t border-white/5 mt-4">
                                <p className="text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">Showroom Miami</p>
                                <p className="text-gray-400 text-sm font-light">
                                    3949 NW 7th St d<br />
                                    Miami, FL 33126
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 3. Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-[#d4af37]/10">
                    <div className="flex flex-wrap justify-center gap-8 text-[11px] text-gray-500 uppercase tracking-widest font-medium">
                        <span>&copy; {currentYear} Dtalles Jewelry</span>
                        <a href={resolvePath('/politicas')} className="hover:text-white transition-colors">Privacidad</a>
                        <a href={resolvePath('/terminos')} className="hover:text-white transition-colors">Términos</a>
                        <a href={resolvePath('/accesibilidad')} className="hover:text-white transition-colors">Accesibilidad</a>
                    </div>

                    {/* Métodos de pago */}
                    <div className="flex gap-3 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="h-6 px-2 border border-white/10 rounded flex items-center justify-center bg-white/5 text-[8px] text-white">VISA</div>
                        <div className="h-6 px-2 border border-white/10 rounded flex items-center justify-center bg-white/5 text-[8px] text-white">MASTERCARD</div>
                        <div className="h-6 px-2 border border-white/10 rounded flex items-center justify-center bg-white/5 text-[8px] text-white">AMEX</div>
                        <div className="h-6 px-2 border border-white/10 rounded flex items-center justify-center bg-white/5 text-[8px] text-white">PAYPAL</div>
                        <div className="h-6 px-2 border border-white/10 rounded flex items-center justify-center bg-white/5 text-[8px] text-white">AFFIRM</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// ----------------------------------------------------------------------
// HELPER COMPONENTS
// ----------------------------------------------------------------------

function FooterHeading({ title, isOpen, onClick }: { title: string, isOpen: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full flex justify-between items-center md:cursor-default group"
        >
            <h3 className="text-[#d4af37] font-serif text-lg tracking-wide">{title}</h3>
            <span className={`material-symbols-outlined text-[#d4af37] md:hidden transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                expand_more
            </span>
        </button>
    );
}

function FooterLink({ href, label, isNew, highlight }: { href: string, label: string, isNew?: boolean, highlight?: boolean }) {
    return (
        <li>
            <a
                href={href}
                className={`group flex items-center gap-2 text-sm font-light transition-all duration-300 transform hover:translate-x-2
                    ${highlight ? 'text-white font-medium' : 'text-gray-400 hover:text-[#d4af37]'}`}
            >
                {highlight && <span className="w-1 h-1 rounded-full bg-[#d4af37]"></span>}
                {label}
                {isNew && (
                    <span className="text-[9px] font-bold text-black bg-[#d4af37] px-1.5 py-0.5 rounded ml-2">NEW</span>
                )}
            </a>
        </li>
    );
}

// Icono de red social con SVG y hover en color de marca
function SocialLink({ href, label, brandColor, children }: {
    href: string;
    label: string;
    brandColor: string;
    children: React.ReactNode;
}) {
    const [hovered, setHovered] = useState(false);
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300"
            style={{
                borderColor: hovered ? brandColor : 'rgba(255,255,255,0.12)',
                backgroundColor: hovered ? brandColor : 'transparent',
                color: hovered ? '#fff' : '#9ca3af',
                transform: hovered ? 'scale(1.1)' : 'scale(1)',
            }}
        >
            {children}
        </a>
    );
}
