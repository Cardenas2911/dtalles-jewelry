import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';

export interface CartItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
    variantTitle?: string;
    handle: string;
}

export const isCartOpen = atom(false);

/** Muestra toast "Añadido a la bolsa" al añadir un ítem (UX) */
export const showAddToCartToast = atom(false);

// Use persistentAtom to save cart state to localStorage
export const cartItems = persistentAtom<Record<string, CartItem>>('cartItems', {}, {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export function setIsCartOpen(isOpen: boolean) {
    isCartOpen.set(isOpen);
}

export function addCartItem(item: CartItem) {
    const existingItems = cartItems.get();
    const existingItem = existingItems[item.id];

    if (existingItem) {
        cartItems.set({
            ...existingItems,
            [item.id]: {
                ...existingItem,
                quantity: existingItem.quantity + item.quantity,
            }
        });
    } else {
        cartItems.set({
            ...existingItems,
            [item.id]: item
        });
    }
    setIsCartOpen(true);
    showAddToCartToast.set(true);
}

export function removeCartItem(itemId: string) {
    const existingItems = cartItems.get();
    const { [itemId]: removed, ...rest } = existingItems;
    cartItems.set(rest);
}

export function updateCartItemQuantity(itemId: string, quantity: number) {
    const existingItems = cartItems.get();
    const existingItem = existingItems[itemId];

    if (existingItem) {
        if (quantity <= 0) {
            removeCartItem(itemId);
        } else {
            cartItems.set({
                ...existingItems,
                [itemId]: {
                    ...existingItem,
                    quantity,
                }
            });
        }
    }
}

export function clearCart() {
    cartItems.set({});
}
