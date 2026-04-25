import { useState } from 'react';
import { useLang } from '../context/LanguageContext';

const ALL_IMAGES = [
  // ── Quran Learning (6 total) ──────────────────────────────────────────────
  { id: 1,  src: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80',  tag: 'Quran Learning', title: 'Annual Hifz Graduation Ceremony',    desc: 'Celebrating the remarkable achievement of our young scholars completing the Holy Quran.' },
  { id: 2,  src: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&q=80',  tag: 'Quran Learning', title: 'Morning Quran Recitation',            desc: 'Students begin each day with the blessed recitation of the Holy Quran.' },
  { id: 9,  src: 'https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=800&q=80',  tag: 'Quran Learning', title: 'Quran Completion Celebration',         desc: 'A joyful milestone as students complete their Quran memorisation journey.' },
  { id: 19, src: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80',  tag: 'Quran Learning', title: 'Tajweed & Pronunciation Class',        desc: 'Mastering the rules of Tajweed under the guidance of expert Quran teachers.' },
  { id: 20, src: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=800&q=80',  tag: 'Quran Learning', title: 'Hifz Programme Dedication',            desc: 'Young students committed to memorising the entire Holy Quran.' },
  { id: 21, src: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&q=80',  tag: 'Quran Learning', title: 'Quran Circle & Group Study',           desc: 'Students revising their memorisation together in a supportive circle.' },

  // ── Classroom (6 total) ───────────────────────────────────────────────────
  { id: 6,  src: 'https://images.unsplash.com/photo-1681140965121-a9e3689e28c3?w=800&q=80',  tag: 'Classroom',      title: 'Madrasa Learning Environment',       desc: 'Our well-equipped classrooms foster focused and disciplined learning.' },
  { id: 11, src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',  tag: 'Classroom',      title: 'Arabic Language Class',              desc: 'Learning the language of the Quran — Arabic grammar and vocabulary.' },
  { id: 12, src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',  tag: 'Classroom',      title: 'Fiqh & Islamic Jurisprudence',       desc: 'Advanced students studying classical Islamic jurisprudence texts.' },
  { id: 13, src: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?w=800&q=80',  tag: 'Classroom',      title: 'Hadith Studies',                     desc: 'Exploring the sayings and traditions of the Prophet ﷺ.' },
  { id: 22, src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',  tag: 'Classroom',      title: 'Islamic Studies Lesson',             desc: 'Students attentively engaged in their daily Islamic studies curriculum.' },
  { id: 23, src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',  tag: 'Classroom',      title: 'Tafseer & Quran Interpretation',     desc: 'Deep study of the meanings and interpretation of the Holy Quran.' },

  // ── Events (5 total) ─────────────────────────────────────────────────────
  { id: 3,  src: 'https://images.unsplash.com/photo-1600814832809-579119f47045?w=800&q=80',  tag: 'Events',         title: 'Friday Jumu\'ah Prayers',            desc: 'Our community gathers every Friday for congregational prayers.' },
  { id: 15, src: 'https://images.unsplash.com/photo-1542967139-b45bb326ec87?w=800&q=80',     tag: 'Events',         title: 'Annual Prize Giving Ceremony',       desc: 'Recognising academic excellence and outstanding Islamic character.' },
  { id: 24, src: 'https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=800&q=80',  tag: 'Events',         title: 'Eid Celebration & Gathering',        desc: 'Students and families come together to celebrate Eid with joy and gratitude.' },
  { id: 25, src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',     tag: 'Events',         title: 'Ramadan Night Programme',            desc: 'Special Tarawih and Quran recitation events during the blessed month.' },
  { id: 26, src: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80',  tag: 'Events',         title: 'Islamic Knowledge Competition',      desc: 'Students competing in Quran recitation and Islamic knowledge quizzes.' },

  // ── Student Life (7 total) ────────────────────────────────────────────────
  { id: 4,  src: 'https://images.unsplash.com/photo-1542967139-b45bb326ec87?w=800&q=80',     tag: 'Student Life',   title: 'Student Support Programme',         desc: 'Supporting students with resources, books, and financial assistance.' },
  { id: 16, src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',  tag: 'Student Life',   title: 'Community Iftar & Charity',         desc: 'Students participate in community service and charitable giving.' },
  { id: 17, src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',     tag: 'Student Life',   title: 'Residential Hostel Life',           desc: 'A structured, nurturing environment for boarding students.' },
  { id: 18, src: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80',  tag: 'Student Life',   title: 'Islamic Library & Research',        desc: 'Extensive collection of classical Islamic texts and academic resources.' },
  { id: 27, src: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?w=800&q=80',  tag: 'Student Life',   title: 'Campus Brotherhood & Bonding',      desc: 'Students building lifelong bonds of Islamic brotherhood on campus.' },
  { id: 28, src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',  tag: 'Student Life',   title: 'Morning Fajr & Daily Routine',      desc: 'Students begin each day with Fajr prayer and structured Islamic routine.' },
];

const PAGE_SIZE = 6;

export default function PhotoGalleryPage() {
  const { t } = useLang();

  const FILTER_KEYS = ['All', 'Quran Learning', 'Classroom', 'Events', 'Student Life'];
  const FILTER_LABELS = {
    'All':           t('galleryFilterAll'),
    'Quran Learning':t('galleryFilterQuran'),
    'Classroom':     t('galleryFilterClassroom'),
    'Events':        t('galleryFilterEvents'),
    'Student Life':  t('galleryFilterStudentLife'),
  };

  const [activeFilter, setActiveFilter] = useState('All');
  const [visible, setVisible]           = useState(PAGE_SIZE);

  const filtered = activeFilter === 'All'
    ? ALL_IMAGES
    : ALL_IMAGES.filter((img) => img.tag === activeFilter);

  const shown    = filtered.slice(0, visible);
  const hasMore  = visible < filtered.length;

  function handleFilterChange(f) {
    setActiveFilter(f);
    setVisible(PAGE_SIZE);
  }

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-6 py-20">
      <header className="text-center space-y-4 mb-12 relative">
        <h1 className="text-4xl md:text-5xl font-bold font-manrope text-primary">{t('galleryTitle')}</h1>
        <p className="text-lg text-text-muted max-w-2xl mx-auto font-inter">{t('galleryDesc')}</p>
      </header>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {FILTER_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => handleFilterChange(key)}
            className={`px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all font-inter ${
              activeFilter === key
                ? 'bg-primary text-on-primary shadow-[0_4px_12px_rgba(11,61,46,0.15)] -translate-y-0.5'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {FILTER_LABELS[key]}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-5xl text-outline mb-4 block">photo_library</span>
          <p className="text-text-muted font-inter">{t('galleryEmpty')}</p>
        </div>
      )}

      {/* Uniform Grid — no bento spans that break on filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shown.map(({ id, src, tag, title, desc }) => (
          <div key={id} className="group relative rounded-xl overflow-hidden shadow-ambient bg-surface-base cursor-pointer aspect-[4/3]">
            <img
              src={src}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container text-xs font-semibold rounded-full w-fit mb-3 font-inter">
                {tag}
              </span>
              <h3 className="text-xl font-semibold font-manrope text-surface-base leading-tight mb-2">{title}</h3>
              {desc && <p className="text-sm text-surface-bright/80 line-clamp-2 font-inter">{desc}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="px-8 py-4 rounded-lg bg-surface-base border border-border-subtle text-primary text-sm font-medium shadow-sm hover:bg-surface-container-low transition-colors flex items-center gap-2 font-inter"
          >
            <span className="material-symbols-outlined">expand_more</span>
            {t('galleryLoadMore')} ({filtered.length - visible} {t('galleryRemaining')})
          </button>
        </div>
      )}
    </main>
  );
}
