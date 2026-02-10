import { atom } from 'nanostores';

export const isSearchOpen = atom(false);

export function setIsSearchOpen(isOpen: boolean) {
    isSearchOpen.set(isOpen);
}
