import React from 'react';
import {
    Visa,
    Mastercard,
    Amex,
    Paypal,
    Shopify,
    Applepay,
    Googlepay,
    Affirm
} from 'react-pay-icons';

interface PaymentIconsProps {
    className?: string;
    iconClassName?: string;
}

export default function PaymentIcons({ className = "flex flex-wrap justify-center gap-2", iconClassName = "h-5 w-auto" }: PaymentIconsProps) {
    // Contenedor base para tarjeta - Mantenemos el mismo estilo para consistencia
    const CardWrapper = ({ children, bg = "bg-white" }: { children: React.ReactNode, bg?: string }) => (
        <div className={`${bg} h-7 w-11 rounded-[3px] flex items-center justify-center border border-white/10 shadow-sm overflow-hidden p-0.5`}>
            {children}
        </div>
    );

    // Style props for icons to fit properly in our wrapper
    const commonIconProps = {
        style: { width: '100%', height: '100%', display: 'block' },
        margin: 0 // some libraries add default margin
    };

    return (
        <div className={className}>
            {/* Visa */}
            <CardWrapper>
                <Visa {...commonIconProps} />
            </CardWrapper>

            {/* Mastercard */}
            <CardWrapper>
                <Mastercard {...commonIconProps} />
            </CardWrapper>

            {/* Amex */}
            <CardWrapper bg="bg-[#006FCF]">
                <Amex {...commonIconProps} />
            </CardWrapper>

            {/* PayPal */}
            <CardWrapper>
                <Paypal {...commonIconProps} />
            </CardWrapper>

            {/* Shop Pay (Using Shopify icon as fallback/primary) */}
            <CardWrapper bg="bg-[#5A31F4]">
                <Shopify {...commonIconProps} />
            </CardWrapper>

            {/* Apple Pay */}
            <CardWrapper>
                <Applepay {...commonIconProps} />
            </CardWrapper>

            {/* Google Pay */}
            <CardWrapper>
                <Googlepay {...commonIconProps} />
            </CardWrapper>

            {/* Affirm */}
            <CardWrapper>
                <Affirm {...commonIconProps} />
            </CardWrapper>
        </div>
    );
}
