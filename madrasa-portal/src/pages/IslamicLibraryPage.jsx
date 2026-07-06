import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { buildPath, PATHS } from '../routes/paths';

export const BOOKS = [
  // ── কোরআন ────────────────────────────────────────────────────────────────
  {
    id: 'holy-quran-bangla',
    category: 'কোরআন',
    title: 'পবিত্র কোরআন',
    author: 'বাংলা অনুবাদ',
    desc: 'সম্পূর্ণ পবিত্র কোরআন বাংলা অনুবাদসহ।',
    icon: 'menu_book',
    lang: 'বাংলা',
    volumes: [
      { label: 'সম্পূর্ণ কোরআন', url: '/books/Holy-Quran-Bangla.pdf' },
    ],
  },
  {
    id: 'tafsir-ibn-kathir-bangla',
    category: 'কোরআন',
    title: 'তাফসীর ইবনে কাসীর',
    author: 'ইমাম ইবনে কাসীর (রহঃ)',
    desc: 'সর্বাধিক পঠিত ক্লাসিক্যাল তাফসীর গ্রন্থ — সম্পূর্ণ বাংলা অনুবাদ। ৯টি খণ্ড ও বিষয় সূচি।',
    icon: 'library_books',
    lang: 'বাংলা',
    volumes: [
      { label: 'বিষয় সূচি', url: '/books/tafsir-ibn-kathir-index-of topics.pdf' },
      { label: '১ম খণ্ড', url: '/books/tafsir-ibn-kathir-bangla-vol-1.pdf' },
      { label: '২য় খণ্ড', url: '/books/tafsir-ibn-kathir-bangla-vol-2.pdf' },
      { label: '৩য় খণ্ড', url: '/books/tafsir-ibn-kathir-bangla-vol-3.pdf' },
      { label: '৪র্থ খণ্ড', url: '/books/tafsir-ibn-kathir-bangla-vol-4.pdf' },
      { label: '৫ম খণ্ড', url: '/books/tafsir-ibn-kathir-bangla-vol-5.pdf' },
      { label: '৬ষ্ঠ খণ্ড', url: '/books/tafsir-ibn-kathir-bangla-vol-6.pdf' },
      { label: '৭ম খণ্ড', url: '/books/tafsir-ibn-kathir-bangla-vol-7.pdf' },
      { label: '৮ম খণ্ড', url: '/books/tafsir-ibn-kathir-bangla-vol-8.pdf' },
      { label: '৯ম খণ্ড', url: '/books/tafsir-ibn-kathir-bangla-vol-9.pdf' },
    ],
  },

  // ── হাদিস ────────────────────────────────────────────────────────────────
  {
    id: 'riyad-salihin-bangla',
    category: 'হাদিস',
    title: 'রিয়াদুস সালেহীন',
    author: 'ইমাম আন-নববী (রহঃ)',
    desc: 'নবী ﷺ-এর বাণী ও আদর্শের একটি প্রিয় সংকলন — সম্পূর্ণ বাংলা অনুবাদ।',
    icon: 'import_contacts',
    lang: 'বাংলা',
    volumes: [
      { label: 'সম্পূর্ণ বই', url: '/books/Riyad-us-saliheenInBangla-visit-alhamdulillah-library.blogspot.com.pdf' },
    ],
  },

  // ── আকীদা ────────────────────────────────────────────────────────────────
  {
    id: 'kitabut-tawheed',
    category: 'আকীদা',
    title: 'কিতাবুত তাওহীদ',
    author: 'শাইখ মুহাম্মদ ইবন আব্দুল ওয়াহহাব (রহঃ)',
    desc: 'তাওহীদ ও ইসলামী আকীদার উপর সর্বাধিক পঠিত ক্লাসিক্যাল গ্রন্থ।',
    icon: 'star',
    lang: 'বাংলা',
    volumes: [
      { label: 'সম্পূর্ণ বই', url: '/books/02.KitabutTawheed.pdf' },
    ],
  },

  // ── সীরাত ────────────────────────────────────────────────────────────────
  {
    id: 'ar-raheeq-al-makhtum',
    category: 'সীরাত',
    title: 'আর-রাহীকুল মাখতূম',
    author: 'শাইখ সফিউর রহমান মুবারকপুরী',
    desc: 'রাবেতা আলম আল-ইসলামীর পুরস্কারপ্রাপ্ত নবী ﷺ-এর জীবনীগ্রন্থ।',
    icon: 'person',
    lang: 'বাংলা',
    volumes: [
      { label: 'সম্পূর্ণ বই', url: '/books/Ar raheeq al makhtum.pdf' },
    ],
  },
  {
    id: 'al-bidaya-wan-nihaya',
    category: 'সীরাত',
    title: 'আল-বিদায়া ওয়ান নিহায়া',
    author: 'ইমাম ইবনে কাসীর (রহঃ)',
    desc: 'সৃষ্টির শুরু থেকে কিয়ামত পর্যন্ত ইসলামের ইতিহাসের বিশ্বকোষ। ১০টি খণ্ড।',
    icon: 'history_edu',
    lang: 'বাংলা',
    volumes: [
      { label: '১ম খণ্ড',  url: '/books/Al-Bidaya-Wan-Nihaya-1.pdf' },
      { label: '২য় খণ্ড',  url: '/books/Al-Bidaya-Wan-Nihaya-2.pdf' },
      { label: '৩য় খণ্ড',  url: '/books/Al-Bidaya-Wan-Nihaya-3.pdf' },
      { label: '৪র্থ খণ্ড', url: '/books/Al-Bidaya-Wan-Nihaya-4.pdf' },
      { label: '৫ম খণ্ড',  url: '/books/Al-Bidaya-Wan-Nihaya-5.pdf' },
      { label: '৬ষ্ঠ খণ্ড', url: '/books/Al-Bidaya-Wan-Nihaya-6.pdf' },
      { label: '৭ম খণ্ড',  url: '/books/Al-Bidaya-Wan-Nihaya-7.pdf' },
      { label: '৮ম খণ্ড',  url: '/books/Al-Bidaya-Wan-Nihaya-8.pdf' },
      { label: '৯ম খণ্ড',  url: '/books/Al-Bidaya-Wan-Nihaya-9.pdf' },
      { label: '১০ম খণ্ড', url: '/books/Al-Bidaya-Wan-Nihaya-10.pdf' },
    ],
  },

  // ── আত্মউন্নয়ন ───────────────────────────────────────────────────────────
  {
    id: 'zadul-maad',
    category: 'আত্মউন্নয়ন',
    title: 'যাদুল মাআদ (পরকালের পাথেয়)',
    author: 'ইমাম ইবনুল কাইয়্যিম (রহঃ)',
    desc: 'নবী ﷺ-এর জীবনাদর্শ অনুসরণে দুনিয়া ও আখিরাতের পাথেয় সংগ্রহের অমূল্য গ্রন্থ।',
    icon: 'self_improvement',
    lang: 'বাংলা',
    volumes: [
      { label: '১ম খণ্ড', url: '/books/যাদুল মাআদ (পরকালের পাথেয়) ১ম খণ্ড - ইমাম ইবনুল কাইয়্যিম (রহঃ).pdf' },
    ],
  },
  {
    id: 'la-tahzan',
    category: 'আত্মউন্নয়ন',
    title: 'লা-তাহযান — হতাশ হবেন না',
    author: 'ড. আইদ আল-কারণী',
    desc: 'বিশ্বব্যাপী কোটি পাঠকের হৃদয় স্পর্শ করা ইসলামী আত্মউন্নয়নের অনন্য গ্রন্থ।',
    icon: 'favorite',
    lang: 'বাংলা',
    volumes: [
      { label: 'সম্পূর্ণ বই', url: '/books/লা-তাহযান. হতাশ হবেন না - ড. আইদ আল কারণী.pdf' },
    ],
  },
];

const CATEGORY_COLORS = {
  'কোরআন':     { card: 'bg-emerald-50 text-emerald-700', badge: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
  'হাদিস':     { card: 'bg-blue-50 text-blue-700',     badge: 'bg-blue-100 text-blue-800',     dot: 'bg-blue-500'     },
  'আকীদা':     { card: 'bg-purple-50 text-purple-700', badge: 'bg-purple-100 text-purple-800', dot: 'bg-purple-500'   },
  'সীরাত':     { card: 'bg-amber-50 text-amber-700',   badge: 'bg-amber-100 text-amber-800',   dot: 'bg-amber-500'   },
  'আত্মউন্নয়ন': { card: 'bg-rose-50 text-rose-700',    badge: 'bg-rose-100 text-rose-800',     dot: 'bg-rose-500'    },
};

const CATEGORIES = ['সব', 'কোরআন', 'হাদিস', 'আকীদা', 'সীরাত', 'আত্মউন্নয়ন'];

const STATS = [
  { value: `${BOOKS.length}`, label: 'মোট বই' },
  { value: `${BOOKS.reduce((s, b) => s + b.volumes.length, 0)}`, label: 'মোট খণ্ড' },
  { value: `${[...new Set(BOOKS.map(b => b.category))].length}`, label: 'বিভাগ' },
  { value: '১০০%', label: 'বিনামূল্যে' },
];

export default function IslamicLibraryPage() {
  const { t } = useLang();
  const [active, setActive] = useState('সব');

  const shown = active === 'সব' ? BOOKS : BOOKS.filter((b) => b.category === active);

  return (
    <main className="flex-grow w-full">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary via-primary-container to-primary text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-container-max mx-auto relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider font-inter mb-6">
            <span className="material-symbols-outlined text-base">local_library</span>
            {t('libraryBadge')}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-manrope mb-4">{t('libraryTitle')}</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto font-inter mb-10">{t('libraryDesc')}</p>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map(({ value, label }) => (
              <div key={label} className="bg-white/10 rounded-xl py-4 px-3 backdrop-blur-sm">
                <div className="text-2xl font-bold font-manrope text-secondary">{value}</div>
                <div className="text-xs text-white/60 font-inter mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filter + Grid ─────────────────────────────────────────────────── */}
      <section className="max-w-container-max mx-auto px-6 py-12">

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => {
            const colors = CATEGORY_COLORS[cat];
            const isActive = active === cat;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all font-inter ${
                  isActive
                    ? 'bg-primary text-white shadow-lg -translate-y-0.5'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {colors && <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-secondary' : colors.dot}`} />}
                {cat}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-inter ${isActive ? 'bg-white/20 text-white' : 'bg-surface-container-high text-on-surface-variant'}`}>
                  {cat === 'সব' ? BOOKS.length : BOOKS.filter(b => b.category === cat).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Book cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((book) => {
            const colors = CATEGORY_COLORS[book.category] ?? { card: 'bg-gray-50 text-gray-700', badge: 'bg-gray-100 text-gray-800', dot: 'bg-gray-400' };
            const isMultiVol = book.volumes.length > 1;
            return (
              <div key={book.id} className="bg-surface-base rounded-2xl shadow-ambient border border-border-subtle flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-200 overflow-hidden">

                {/* Card header */}
                <div className={`${colors.card} p-5 flex items-start justify-between gap-3`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/60 rounded-xl flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-2xl">{book.icon}</span>
                    </div>
                    <div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${colors.badge} font-inter`}>
                        {book.category}
                      </span>
                      <div className="text-xs mt-1 opacity-60 font-inter">{book.lang}</div>
                    </div>
                  </div>
                  {isMultiVol && (
                    <span className="shrink-0 text-xs font-bold bg-white/60 px-2.5 py-1 rounded-full font-inter">
                      {book.volumes.length} খণ্ড
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-base font-bold text-primary font-manrope mb-1 leading-snug">{book.title}</h3>
                  <p className="text-xs text-text-muted font-inter mb-2">{book.author}</p>
                  <p className="text-sm text-on-surface-variant font-inter flex-grow mb-5 leading-relaxed">{book.desc}</p>

                  {/* Single volume */}
                  {!isMultiVol && (
                    <Link
                      to={buildPath(PATHS.BOOK_READ, { bookId: book.id })}
                      className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors font-inter"
                    >
                      <span className="material-symbols-outlined text-base">download</span>
                      {t('libraryDownloadBtn')}
                    </Link>
                  )}

                  {/* Multi-volume grid */}
                  {isMultiVol && (
                    <div className="grid grid-cols-3 gap-1.5">
                      {book.volumes.map((vol, i) => (
                        <Link
                          key={i}
                          to={buildPath(PATHS.BOOK_READ, { bookId: `${book.id}--vol-${i}` })}
                          className="flex items-center justify-center text-center py-2 px-1 rounded-lg bg-surface-container hover:bg-primary hover:text-white text-primary text-xs font-semibold transition-colors font-inter border border-border-subtle"
                        >
                          {vol.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
