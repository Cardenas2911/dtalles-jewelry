import React, { useEffect, useRef, useState } from 'react';
import { ui } from '../../i18n/ui';
import { resolvePath } from '../../utils/paths';

type Variant = 'compact' | 'card' | 'hero';

interface SnapFinanceBannerProps {
    variant?: Variant;
    lang?: 'en' | 'es';
    source: 'product' | 'cart' | 'financing' | 'footer';
    className?: string;
}

const env = import.meta.env;
const PARAM_ID: string = env.PUBLIC_SNAP_PARAM_ID ?? '';
const ORIGINATION_URL: string = env.PUBLIC_SNAP_ORIGINATION_URL ?? 'https://bk.snapfinance.com/origination';
const BANNER_CDN: string = env.PUBLIC_SNAP_BANNER_CDN ?? 'https://assets.snapfinance.com/app/images';

const buildHref = () =>
    PARAM_ID ? `${ORIGINATION_URL}?paramId=${encodeURIComponent(PARAM_ID)}` : ORIGINATION_URL;

const buildImgSrc = (lang: 'en' | 'es') => `${BANNER_CDN}/${lang}_apply_image_06.jpeg`;
const ES_FALLBACK_SRC = `${BANNER_CDN}/es_apply_image_06.jpeg`;

const FALLBACK_COPY = {
    en: {
        heading: "Don't qualify with Affirm?",
        cta: 'Apply with Snap Finance',
        ctaShort: 'Apply with Snap',
        ariaLabel: 'Apply with Snap Finance (opens in new tab)',
        imgAlt: 'Snap Finance - Apply Here',
        snapCta: 'Apply now',
    },
    es: {
        heading: '¿No calificas con Affirm?',
        cta: 'Aplica con Snap Finance',
        ctaShort: 'Aplica con Snap',
        ariaLabel: 'Aplica con Snap Finance (abre en pestaña nueva)',
        imgAlt: 'Snap Finance - Aplica Aquí',
        snapCta: 'Aplica ahora',
    },
} as const;

const tr = (lang: 'en' | 'es', key: string, fallback: string): string => {
    const dict = (ui as unknown as Record<string, Record<string, string>>)[lang] ?? {};
    return dict[key] || fallback;
};

interface SnapCompactProps {
    anchorProps: Record<string, string>;
    lang: 'en' | 'es';
    imgAlt: string;
    cta: string;
    ctaShort: string;
    className: string;
}

function SnapCompactBanner({ anchorProps, lang, imgAlt, cta, ctaShort, className }: SnapCompactProps) {
    const [imgOk, setImgOk] = useState<boolean | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const img = imgRef.current;
        if (!img) return;
        if (img.complete) {
            setImgOk(img.naturalWidth > 0);
        }
    }, []);

    return (
        <a {...anchorProps} className={`inline-block max-w-full ${className}`}>
            <img
                ref={imgRef}
                src={buildImgSrc(lang)}
                onLoad={() => setImgOk(true)}
                onError={() => setImgOk(false)}
                alt={imgAlt}
                style={{
                    boxShadow: '4px 2px 6px #010101',
                    border: 'none',
                    display: imgOk === false ? 'none' : 'block',
                    maxWidth: '100%',
                    height: 'auto',
                }}
            />
            {imgOk === false && (
                <span className="inline-flex items-center justify-center gap-1.5 md:gap-2 px-3 py-2 md:px-6 md:py-3 bg-[#0078D7] hover:bg-[#005FB0] text-white rounded font-bold uppercase tracking-wide text-[11px] md:text-sm transition-colors shadow-md text-center leading-tight max-w-full">
                    <span className="md:hidden">{ctaShort}</span>
                    <span className="hidden md:inline">{cta}</span>
                    <span aria-hidden="true">→</span>
                </span>
            )}
        </a>
    );
}

export default function SnapFinanceBanner({
    variant = 'compact',
    lang = 'en',
    source,
    className = ''
}: SnapFinanceBannerProps) {
    const fallback = FALLBACK_COPY[lang];
    const heading = tr(lang, 'snap.product.heading', fallback.heading);
    const cta = tr(lang, 'snap.product.cta', fallback.cta);
    const ctaShort = tr(lang, 'snap.product.ctaShort', fallback.ctaShort);
    const ariaLabel = tr(lang, 'snap.aria.banner', fallback.ariaLabel);
    const imgAlt = tr(lang, 'snap.img.alt', fallback.imgAlt);
    const snapCta = tr(lang, 'snap.financing.snap_cta', fallback.snapCta);
    const logoSrc = resolvePath('/images/snap/snap-logo.svg');

    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        if (img.dataset.fallback !== 'es') {
            img.dataset.fallback = 'es';
            img.src = ES_FALLBACK_SRC;
        } else {
            img.style.display = 'none';
        }
    };

    const commonAnchorProps = {
        href: buildHref(),
        target: '_blank',
        rel: 'noopener noreferrer sponsored',
        'aria-label': ariaLabel,
        'data-snap-source': source,
    } as const;

    if (variant === 'compact') {
        return <SnapCompactBanner anchorProps={commonAnchorProps} lang={lang} imgAlt={imgAlt} cta={cta} ctaShort={ctaShort} className={className} />;
    }

    if (variant === 'card') {
        return (
            <a
                {...commonAnchorProps}
                className={`group block p-6 rounded-lg bg-white/5 border border-white/10 hover:border-[#d4af37]/40 transition-all duration-300 no-underline ${className}`}
            >
                <img
                    src={buildImgSrc(lang)}
                    onError={handleImgError}
                    alt={imgAlt}
                    loading="lazy"
                    width={300}
                    height={250}
                    className="w-full h-auto rounded shadow-[4px_2px_6px_#010101]"
                />
                <span className="block mt-4 text-sm text-[#d4af37] font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                    {snapCta} →
                </span>
            </a>
        );
    }

    return (
        <a
            {...commonAnchorProps}
            className={`group block ${className}`}
        >
            <img
                src={buildImgSrc(lang)}
                onError={handleImgError}
                alt={imgAlt}
                loading="lazy"
                width={728}
                height={90}
                className="w-full h-auto rounded shadow-[4px_2px_6px_#010101]"
            />
        </a>
    );
}
