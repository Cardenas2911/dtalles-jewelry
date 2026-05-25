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
          className="fixed inset-0 z-[100] bg-black/80 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="min-h-screen md:py-8">
            <div className="max-w-5xl mx-auto md:my-8 bg-[#050505] md:rounded shadow-2xl">
              <JewelFinder lang={lang} mode="modal" onClose={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
