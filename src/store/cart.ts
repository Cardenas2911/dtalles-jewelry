import { map, atom } from 'nanostores';

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
export const cartItems = map<Record<string, CartItem>>({});

export function setIsCartOpen(isOpen: boolean) {
    isCartOpen.set(isOpen);
}

export function addCartItem(item: CartItem) {
    const existingItems = cartItems.get();
    const existingItem = existingItems[item.id];

    if (existingItem) {
        cartItems.setKey(item.id, {
            ...existingItem,
            quantity: existingItem.quantity + item.quantity,
        });
    } else {
        cartItems.setKey(item.id, item);
    }
    setIsCartOpen(true);
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
            cartItems.setKey(itemId, {
                ...existingItem,
                quantity,
            });
        }
    }
}
