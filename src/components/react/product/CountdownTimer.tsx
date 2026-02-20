import React, { useState, useEffect } from 'react';

export default function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState<{ hours: string, minutes: string, seconds: string } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            // Corte de envío a las 4:00 PM (16:00) hora local del servidor/usuario
            // Para joyería en USA/Miami, suele ser 4 PM EST
            const cutoff = new Date();
            cutoff.setHours(16, 0, 0, 0);

            // Si ya pasó las 4 PM, el próximo corte es mañana a las 4 PM
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
        calculateTimeLeft(); // Primera ejecución inmediata

        return () => clearInterval(timer);
    }, []);

    if (!timeLeft) return null;

    return (
        <div className="mb-6 p-4 bg-[#d4af37]/5 border border-[#d4af37]/20 rounded-lg animate-fade-in">
            <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#d4af37] animate-pulse">schedule</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <p className="text-[11px] uppercase tracking-wider text-[#d4af37] font-bold mb-1">
                        Envío Hoy Mismo
                    </p>
                    <p className="text-xs text-gray-400 font-medium">
                        Ordena en los próximos:
                    </p>
                </div>

                {/* Counter */}
                <div className="flex gap-2">
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-mono font-bold text-white bg-black/40 px-2 rounded border border-white/5">{timeLeft.hours}</span>
                        <span className="text-[8px] uppercase text-gray-500 mt-1">Hrs</span>
                    </div>
                    <span className="text-lg font-bold text-[#d4af37] pt-0.5">:</span>
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-mono font-bold text-white bg-black/40 px-2 rounded border border-white/5">{timeLeft.minutes}</span>
                        <span className="text-[8px] uppercase text-gray-500 mt-1">Min</span>
                    </div>
                    <span className="text-lg font-bold text-[#d4af37] pt-0.5">:</span>
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-mono font-bold text-white bg-black/40 px-2 rounded border border-white/5 animate-pulse">{timeLeft.seconds}</span>
                        <span className="text-[8px] uppercase text-gray-500 mt-1">Seg</span>
                    </div>
                </div>
            </div>

            <div className="mt-3 flex items-center gap-2 py-2 px-3 bg-black/20 rounded border-t border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]"></span>
                <span className="text-[10px] text-gray-300">
                    Tu joya será procesada con <strong>prioridad VIP</strong> hoy.
                </span>
            </div>
        </div>
    );
}
