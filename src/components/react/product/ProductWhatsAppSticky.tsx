import React, { useState, useEffect } from 'react';

interface ProductWhatsAppStickyProps {
    productTitle: string;
    productUrl: string;
}

export default function ProductWhatsAppSticky({ productTitle, productUrl }: ProductWhatsAppStickyProps) {
    const [timeLeft, setTimeLeft] = useState<{ hours: string, minutes: string, seconds: string } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const cutoff = new Date();
            cutoff.setHours(16, 0, 0, 0);

            if (now > cutoff) {
                cutoff.setDate(cutoff.getDate() + 1);
            }

            const difference = cutoff.getTime() - now.getTime();
            const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const m = Math.floor((difference / 1000 / 60) % 60);
            const s = Math.floor((difference / 1000) % 60);

            setTimeLeft({
                hours: h.toString().padStart(2, '0'),
                minutes: m.toString().padStart(2, '0'),
                seconds: s.toString().padStart(2, '0')
            });
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();
        return () => clearInterval(timer);
    }, []);

    const whatsappNumber = "17867644952";
    const message = encodeURIComponent(`¡Hola! 👋 Me interesa este producto: ${productTitle}\nLink: ${productUrl}`);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

    return (
        <div className="fixed top-16 lg:top-[112px] left-0 w-full z-30 px-4 py-0.5 pointer-events-none flex flex-col gap-0">
            <div className="max-w-7xl mx-auto w-full flex flex-col gap-0">

                {/* Botón WhatsApp Premium */}
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto flex items-center justify-between w-full bg-gradient-to-r from-[#25D366] via-[#2be06e] to-[#25D366] px-4 py-3 lg:p-5 rounded-t-2xl rounded-b-none shadow-[0_4px_15px_rgba(37,211,102,0.3)] border border-white/20 animate-pulse-glow relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="bg-white rounded-full p-1.5 shadow-lg">
                            <svg viewBox="0 0 24 24" fill="#25D366" className="w-6 h-6">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-black text-[10px] font-bold uppercase tracking-widest leading-none mb-1">
                                ¡Consulta en Vivo!
                            </p>
                            <p className="text-black text-sm font-black italic tracking-tight leading-none">
                                CHAT CON EXPERTO MIAMI
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center relative z-10">
                        <span className="text-black font-bold text-xs bg-white/30 px-3 py-1 rounded-full backdrop-blur-md border border-white/40 group-hover:bg-white/50 transition-colors">
                            CONECTAR
                        </span>
                        <span className="material-symbols-outlined text-black ml-2 animate-bounce-horizontal">arrow_forward</span>
                    </div>

                    <style dangerouslySetInnerHTML={{
                        __html: `
                        @keyframes pulse-glow {
                            0%, 100% { box-shadow: 0 0 20px rgba(37,211,102,0.4); }
                            50% { box-shadow: 0 0 40px rgba(37,211,102,0.7); }
                        }
                        @keyframes shimmer {
                            0% { transform: translateX(-100%); }
                            100% { transform: translateX(100%); }
                        }
                        @keyframes bounce-horizontal {
                            0%, 100% { transform: translateX(0); }
                            50% { transform: translateX(4px); }
                        }
                        .animate-pulse-glow { animation: pulse-glow 2s infinite ease-in-out; }
                        .animate-shimmer { animation: shimmer 2.5s infinite linear; }
                        .animate-bounce-horizontal { animation: bounce-horizontal 1s infinite ease-in-out; }
                    `}} />
                </a>

                {/* Contador de Urgencia Fijo */}
                {timeLeft && (
                    <div className="pointer-events-auto w-full bg-black/80 backdrop-blur-md border border-[#d4af37]/30 border-t-0 rounded-b-xl px-4 py-1.5 flex items-center justify-between shadow-[0_4px_15px_rgba(0,0,0,0.5)] animate-fade-in">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#d4af37] text-sm animate-pulse">schedule</span>
                            <span className="text-[10px] lg:text-xs text-white font-bold uppercase tracking-wider">Envío Hoy Mismo</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] text-gray-400 uppercase hidden sm:inline">Ordena en:</span>
                            <div className="flex items-center gap-1.5 font-mono">
                                <span className="bg-[#d4af37] text-black px-1.5 py-0.5 rounded text-xs font-black">{timeLeft.hours}</span>
                                <span className="text-[#d4af37] font-bold">:</span>
                                <span className="bg-[#d4af37] text-black px-1.5 py-0.5 rounded text-xs font-black">{timeLeft.minutes}</span>
                                <span className="text-[#d4af37] font-bold">:</span>
                                <span className="bg-[#d4af37] text-black px-1.5 py-0.5 rounded text-xs font-black animate-pulse-slow">{timeLeft.seconds}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
