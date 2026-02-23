import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { isCartOpen, cartItems, setIsCartOpen, removeCartItem, updateCartItemQuantity } from '../../store/cart';
import { client } from '../../lib/shopify';
import { CART_CREATE } from '../../lib/mutations/cart';
import PaymentIcons from './PaymentIcons';
import AffirmPromotionalMessage from './AffirmPromotionalMessage';

export default function CartDrawer() {
    const $isCartOpen = useStore(isCartOpen);
    const $cartItems = useStore(cartItems);
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const items = Object.values($cartItems);
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 0; // Envío gratuito
    const taxRate = 0.07; // 7% estimado
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    const handleCheckout = async () => {
        setIsLoading(true);
        const checkoutInput = {
            lines: items.map((item) => ({
                merchandiseId: item.id,
                quantity: item.quantity,
            })),
        };
        console.log("Starting checkout with input:", checkoutInput);

        try {
            const response = await client.request(CART_CREATE, {
                variables: {
                    input: checkoutInput,
                },
            });

            console.log("Shopify Cart Response:", JSON.stringify(response, null, 2));

            const { data } = response;
            if (data?.cartCreate?.cart?.checkoutUrl) {
                let checkoutUrl = new URL(data.cartCreate.cart.checkoutUrl);
                // Forzamos el dominio hacia myshopify para evitar el 404 en el dominio headless (Astro)
                checkoutUrl.hostname = 'dtalles-jewelry.myshopify.com';

                console.log("Redirecting to:", checkoutUrl.toString());
                window.location.href = checkoutUrl.toString();
            } else {
                console.error("No checkout URL returned", JSON.stringify(response, null, 2));
                if (data?.cartCreate?.userErrors?.length > 0) {
                    console.error("User Errors:", JSON.stringify(data.cartCreate.userErrors, null, 2));
                }
            }
        } catch (error) {
            console.error("Checkout error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] transition-opacity duration-300 ${$isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#050505] text-[#FAFAF5] shadow-2xl transform transition-transform duration-300 z-[70] flex flex-col border-l border-[#d4af37]/20 ${$isCartOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#d4af37]/10">
                    <h2 className="text-xl font-serif tracking-wide text-[#d4af37]">Tu Selección</h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-white/60 hover:text-[#d4af37] transition-colors"
                    >
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length > 0 && (
                        <div className="mb-6 p-4 bg-[#121212] border border-[#d4af37]/20 rounded-sm">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">Estado del Envío</span>
                                <span className="text-[10px] uppercase tracking-widest text-white/60">Asegurado 100%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#d4af37] to-white w-full animate-shimmer"></div>
                            </div>
                            <p className="mt-2 text-[11px] text-gray-400 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs text-[#d4af37]">verified</span>
                                ¡Felicidades! Tu orden califica para <strong>Envío Express Gratis</strong>
                            </p>
                        </div>
                    )}

                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                            <span className="material-symbols-outlined text-4xl text-[#d4af37]">shopping_bag</span>
                            <p className="font-light">Tu carrito está vacío.</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-[#d4af37] underline underline-offset-4 text-sm uppercase tracking-wider hover:text-white"
                            >
                                Seguir Comprando
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 group">
                                <div className="w-24 h-24 bg-[#121212] rounded overflow-hidden relative border border-white/5">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-medium text-white/90 leading-tight group-hover:text-[#d4af37] transition-colors">{item.title}</h3>
                                            <button
                                                onClick={() => removeCartItem(item.id)}
                                                className="text-white/40 hover:text-red-400 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                        {item.variantTitle && <p className="text-sm text-white/50 mt-1">{item.variantTitle}</p>}
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center border border-white/10 rounded overflow-hidden">
                                            <button
                                                onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                                className="px-3 py-1 hover:bg-white/5 text-white/60 transition-colors"
                                            >-</button>
                                            <span className="px-2 text-sm text-[#d4af37] font-bold font-mono">{item.quantity}</span>
                                            <button
                                                onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                                className="px-3 py-1 hover:bg-white/5 text-white/60 transition-colors"
                                            >+</button>
                                        </div>
                                        <p className="font-bold text-[#d4af37] tracking-tight">${(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Transparencia Radical */}
                {items.length > 0 && (
                    <div className="bg-[#121212] p-6 border-t border-[#d4af37]/10 space-y-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-white/60">
                                <span>Subtotal</span>
                                <span>${subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-white/60">
                                <span>Envío (Asegurado)</span>
                                <span className="text-[#d4af37] font-medium uppercase tracking-widest text-[10px]">GRATIS</span>
                            </div>
                            <div className="flex justify-between text-white/60">
                                <span>Impuestos Estimados (7%)</span>
                                <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                            <span className="text-white/80 font-medium">Total Estimado</span>
                            <span className="text-2xl font-serif text-[#d4af37]">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>

                        <p className="text-xs text-center text-white/40 flex items-center justify-center gap-1 py-1">
                            <span className="material-symbols-outlined text-sm text-[#d4af37]">verified_user</span>
                            Sin cargos ocultos. Transparencia DTalles.
                        </p>

                        <div className="flex justify-center w-full">
                            <AffirmPromotionalMessage price={total} pageType="cart" className="mb-2 !mt-0 text-center" />
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={isLoading}
                            className={`w-full group bg-[#d4af37] text-[#050505] font-bold py-5 uppercase tracking-[0.2em] hover:bg-[#fff] hover:text-[#000] transition-all duration-500 shadow-[0_0_30px_rgba(212,175,55,0.15)] flex justify-center items-center relative overflow-hidden ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                                    Iniciando Pago...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">lock</span>
                                    <span>Proceder al Pago</span>
                                </span>
                            )}
                        </button>

                        <div className="flex justify-center pt-2 w-full overflow-hidden">
                            <PaymentIcons className="flex flex-nowrap justify-center gap-1 sm:gap-1.5" iconClassName="h-4 w-auto text-white" />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
