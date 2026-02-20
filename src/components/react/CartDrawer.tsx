import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { isCartOpen, cartItems, setIsCartOpen, removeCartItem, updateCartItemQuantity } from '../../store/cart';
import { client } from '../../lib/shopify';
import { CART_CREATE } from '../../lib/mutations/cart';
import PaymentIcons from './PaymentIcons';

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
                console.log("Redirecting to:", data.cartCreate.cart.checkoutUrl);
                window.location.href = data.cartCreate.cart.checkoutUrl;
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
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${$isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#050505] text-[#FAFAF5] shadow-2xl transform transition-transform duration-300 z-[60] flex flex-col border-l border-[#d4af37]/20 ${$isCartOpen ? 'translate-x-0' : 'translate-x-full'
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
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-medium text-white/90 leading-tight">{item.title}</h3>
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
                                        <div className="flex items-center border border-white/10 rounded">
                                            <button
                                                onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                                className="px-2 py-1 hover:bg-white/5 text-white/60"
                                            >-</button>
                                            <span className="px-2 text-sm text-[#d4af37]">{item.quantity}</span>
                                            <button
                                                onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                                className="px-2 py-1 hover:bg-white/5 text-white/60"
                                            >+</button>
                                        </div>
                                        <p className="font-bold text-[#d4af37]">${(item.price * item.quantity).toLocaleString()}</p>
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
                                <span className="text-[#d4af37] font-medium">GRATIS</span>
                            </div>
                            <div className="flex justify-between text-white/60">
                                <span>Impuestos Estimados (7%)</span>
                                <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                            <span className="text-white/80 font-medium">Total</span>
                            <span className="text-2xl font-serif text-[#d4af37]">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>

                        <p className="text-xs text-center text-white/40 flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-sm">verified_user</span>
                            Sin cargos ocultos. El precio que ves es el que pagas.
                        </p>

                        <div className="flex justify-center pb-2 opacity-70">
                            <PaymentIcons iconClassName="h-4 w-auto text-white" />
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={isLoading}
                            className={`w-full bg-[#d4af37] text-[#050505] font-bold py-4 uppercase tracking-widest hover:bg-[#fff] hover:text-[#000] transition-colors duration-300 shadow-[0_0_20px_rgba(212,175,55,0.2)] flex justify-center items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                                    Procesando...
                                </span>
                            ) : (
                                "Proceder al Pago"
                            )}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
