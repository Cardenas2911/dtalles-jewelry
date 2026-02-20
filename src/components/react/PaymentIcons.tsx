import React from 'react';

interface PaymentIconsProps {
    className?: string;
    iconClassName?: string;
}

export default function PaymentIcons({ className = "flex flex-wrap justify-center gap-2", iconClassName = "h-5" }: PaymentIconsProps) {
    // Contenedor base para tarjeta
    const CardWrapper = ({ children, bg = "bg-white" }: { children: React.ReactNode, bg?: string }) => (
        <div className={`${bg} h-8 w-12 rounded flex items-center justify-center border border-white/10 shadow-sm overflow-hidden p-1`}>
            {children}
        </div>
    );

    return (
        <div className={className}>
            {/* Visa */}
            <CardWrapper>
                <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/visa-319d545c6fd255c9aad5eeaad21fd6f7f7b4fdbdb1a35ce83b89cca12a187f00.svg" alt="Visa" className="w-full h-full object-contain" />
            </CardWrapper>

            {/* Mastercard */}
            <CardWrapper>
                <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/master-1730d647918f7230b7613c28ac63bfa5938c4cd80f38d72669d58c52f2a7b74f.svg" alt="Mastercard" className="w-full h-full object-contain" />
            </CardWrapper>

            {/* Amex */}
            <CardWrapper bg="bg-[#006FCF]">
                <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/american_express-2269c9bcf158e6599f7de8f6e2190b6f9ebb371a55f8c7da967e2343a486af20.svg" alt="American Express" className="w-full h-full object-contain" />
            </CardWrapper>

            {/* PayPal */}
            <CardWrapper>
                <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/paypal-49e4c1e03244b6d2038404cb39e01a61525a5609e900c7d425712e239017684d.svg" alt="PayPal" className="w-full h-full object-contain" />
            </CardWrapper>

            {/* Shop Pay */}
            <CardWrapper>
                <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/shop_pay-1906a241af161aed48f32463e264ab3da28471be8bd93a7e5898d975ab49af04.svg" alt="Shop Pay" className="w-full h-full object-contain" />
            </CardWrapper>

            {/* Apple Pay */}
            <CardWrapper>
                <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/apple_pay-f6db0077dc7c325b436ecbdcf254239100b35b70b1663bc7523d7c424901fa09.svg" alt="Apple Pay" className="w-full h-full object-contain" />
            </CardWrapper>

            {/* Google Pay */}
            <CardWrapper>
                <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/google_pay-c66a29c63facf2053bf69352982c958e9675cabea4f2f7cbb0821953c2c771ee.svg" alt="Google Pay" className="w-full h-full object-contain" />
            </CardWrapper>

            {/* Affirm */}
            <CardWrapper>
                <svg viewBox="0 0 42 16" className="w-full h-full object-contain" aria-label="Affirm">
                    <g fill="#000" fillRule="evenodd">
                        <path d="M7.8 0C3.5 0 0 3.6 0 8s3.5 8 7.8 8c4.3 0 7.8-3.6 7.8-8S12.1 0 7.8 0zm0 13.9C4.6 13.9 2 11.2 2 8s2.6-5.9 5.8-5.9c3.2 0 5.8 2.7 5.8 5.9s-2.6 5.9-5.8 5.9" />
                        <path d="M23.1 3.4h-2.1v9.3c0 .8.2 1.2.9 1.2h1.2v2h-1.6c-2.3 0-2.6-1.7-2.6-3.2v-9.3h-1.6V1.3h1.6V0h2.1v1.3h2.1v2.1M29.6 3.4h-2.1v9.3c0 .8.2 1.2.9 1.2h1.2v2H28c-2.3 0-2.6-1.7-2.6-3.2v-9.3h-1.6V1.3h1.6V0h2.1v1.3h2.1v2.1M32.8 3.5h2.1v8.5h2V3.5h2.1V12h-2v3.9H34.9V12h-2.1V3.5M40.9 3.5h2.1v3.9h-2.1z" />
                    </g>
                </svg>
            </CardWrapper>
        </div>
    );
}
