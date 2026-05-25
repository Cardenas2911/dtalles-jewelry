import React, { useEffect, useState } from 'react';
import { getTranslationFunctionForLang } from '../../i18n/utils';
import JewelFinder from './jewelFinder/JewelFinder';

interface JewelFinderTriggerProps {
  lang: 'es' | 'en';
  variant?: 'hero' | 'inline';
}

export default function JewelFinderTrigger({ lang, variant = 'inline' }: JewelFinderTriggerProps) {
  const t = getTranslationFunctionForLang(lang);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const triggerClass =
    variant === 'hero'
      ? 'inline-flex items-center gap-2 px-8 py-3 border border-[#d4af37] text-[#d4af37] font-sans font-bold text-xs uppercase tracking-[2px] hover:bg-[#d4af37] hover:text-black transition-all duration-300'
      : 'inline-flex items-center gap-2 px-5 py-2 bg-[#d4af37]/10 border border-[#d4af37]/40 text-[#d4af37] text-xs uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-colors';

  return (
    <>
      <button onClick={() => setOpen(true)} className={triggerClass}>
        <span className="material-symbols-outlined text-[18px]">diamond</span>
        {t('finder.openCTA' as any)}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md overflow-y-auto"
          style={{ animation: 'fadeIn 0.25s ease-out forwards' }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          role="dialog"
          aria-modal="true"
          aria-label={t('finder.title' as any)}
        >
          <button
            onClick={() => setOpen(false)}
            className="fixed top-4 right-4 z-[110] w-11 h-11 flex items-center justify-center rounded-full bg-[#0a0a0a] border border-[#d4af37]/60 text-[#d4af37] hover:bg-[#d4af37] hover:text-black hover:rotate-90 transition-all duration-300 shadow-[0_4px_24px_rgba(212,175,55,0.25)]"
            aria-label={t('finder.closeModal' as any)}
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>

          <div className="min-h-screen px-3 py-6 md:px-8 md:py-12">
            <div
              className="
                max-w-5xl mx-auto
                bg-gradient-to-b from-[#0a0a0a] to-[#050505]
                border border-[#d4af37]/30
                rounded-lg
                shadow-[0_0_60px_rgba(212,175,55,0.15)]
                overflow-hidden
              "
            >
              <JewelFinder lang={lang} mode="modal" onClose={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
