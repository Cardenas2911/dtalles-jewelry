import { addCartItem, setIsCartOpen } from '../../store/cart';

interface AddToCartProps {
    product: {
        id: string;
        title: string;
        price: number;
        image: string;
        handle: string;
        variantTitle?: string;
    };
    compact?: boolean;
}

export default function AddToCart({ product, compact = false }: AddToCartProps) {
    const handleAdd = () => {
        addCartItem({
            ...product,
            quantity: 1,
        });
        setIsCartOpen(true);
    };

    return (
        <button
            onClick={handleAdd}
            className={`group relative w-full overflow-hidden bg-[#d4af37] text-[#050505] transition-all hover:bg-white hover:text-black active:scale-[0.99] shadow-[0_0_15px_rgba(212,175,55,0.15)] ${compact ? 'py-2 md:py-3' : 'py-2.5 md:py-4'}`}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100 animate-shimmer"></div>
            <span className={`relative z-10 flex items-center justify-center gap-1 md:gap-1.5 font-bold uppercase ${compact ? 'text-[9px] md:text-[10px] tracking-wide md:tracking-widest' : 'text-[10px] md:text-xs tracking-wide md:tracking-widest'}`}>
                <span className="whitespace-nowrap leading-none line-clamp-1">Agregar al Carrito</span>
                {!compact && <span className="material-symbols-outlined text-[16px] md:text-[18px] hidden lg:inline">shopping_bag</span>}
            </span>
        </button>
    );
}
