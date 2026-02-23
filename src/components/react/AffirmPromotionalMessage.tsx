import React, { useEffect, useRef } from 'react';

interface AffirmPromotionalMessageProps {
    price?: number;
    pageType?: 'product' | 'cart';
    className?: string;
}

export default function AffirmPromotionalMessage({
    price,
    pageType = 'product',
    className = ''
}: AffirmPromotionalMessageProps) {
    const containerRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        // Si la librería de Affirm global está disponible, refrescamos el widget
        // Esto es crucial para SPA o componentes React donde el DOM o el precio cambian sin recargar
        const w = window as any;
        if (typeof w !== 'undefined' && w.affirm && w.affirm.ui) {
            w.affirm.ui.refresh();
        }
    }, [price]); // Vigila los cambios en `price` (ej: cuando el usuario cambia de variante o de cantidad)

    // Affirm requiere que el monto esté en centavos (ej: $10.00 = 1000)
    const amountInCents = price ? Math.round(price * 100) : undefined;

    // Si no hay precio (ej. cargando) no mostramos el div,
    // O podemos mostrarlo y Affirm simplemente no lo renderizará si no hay data-amount válido
    if (price === undefined) return null;

    return (
        <div className={`mt-2 mb-4 text-[13px] text-gray-300 min-h-[1.5rem] align-middle ${className}`}>
            <p
                ref={containerRef}
                className="affirm-as-low-as"
                data-page-type={pageType}
                data-amount={amountInCents}
            ></p>
        </div>
    );
}
