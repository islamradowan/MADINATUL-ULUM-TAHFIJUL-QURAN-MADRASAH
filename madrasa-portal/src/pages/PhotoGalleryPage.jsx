import { useState } from 'react';
import { useLang } from '../context/LanguageContext';

const ALL_IMAGES = [
  // ── Quran Learning ────────────────────────────────────────────────────────
  { id: 1,  src: '/Gallery/cahiwak-quran-6114877.jpg',          tag: 'Quran Learning', title: 'Annual Hifz Graduation Ceremony',  desc: 'Celebrating the remarkable achievement of our young scholars completing the Holy Quran.' },
  { id: 2,  src: '/Gallery/freebiespic-quran-4178711.jpg',      tag: 'Quran Learning', title: 'Morning Quran Recitation',         desc: 'Students begin each day with the blessed recitation of the Holy Quran.' },
  { id: 3,  src: '/Gallery/joko_narimo-al-quran-7737590.jpg',   tag: 'Quran Learning', title: 'Quran Circle & Group Study',       desc: 'Students revising their memorisation together in a supportive circle.' },

  // ── Classroom ─────────────────────────────────────────────────────────────
  { id: 4,  src: '/Gallery/chidioc-kid-1077793.jpg',                                                          tag: 'Classroom',      title: 'Madrasa Learning Environment',       desc: 'Our well-equipped classrooms foster focused and disciplined learning.' },
  { id: 5,  src: '/Gallery/mdjihadhossen-islam-8519137.jpg',                                                  tag: 'Classroom',      title: 'Islamic Studies Lesson',             desc: 'Students attentively engaged in their daily Islamic studies curriculum.' },
  { id: 10, src: '/Gallery/bangladeshi-muslim-students-madrasa-islamic-religious-school-440nw-8856020b.jpg',  tag: 'Classroom',      title: 'Madrasa Students in Class',          desc: 'Bangladeshi madrasa students engaged in their daily religious education.' },
  { id: 11, src: '/Gallery/bangladeshi-muslim-students-madrasa-islamic-religious-school-440nw-8856020c.jpg',  tag: 'Classroom',      title: 'Islamic Religious School',           desc: 'Students studying Islamic sciences in a traditional madrasa setting.' },
  { id: 12, src: '/Gallery/bangladeshi-muslim-students-madrasa-islamic-religious-school-440nw-8856020g.jpg',  tag: 'Classroom',      title: 'Group Learning Session',             desc: 'Students learning together in a collaborative and focused environment.' },
  { id: 13, src: '/Gallery/Muslim-students-discuss-b-007.avif',                                               tag: 'Classroom',      title: 'Student Discussion & Debate',        desc: 'Muslim students engaged in scholarly discussion and academic debate.' },

  // ── Events ────────────────────────────────────────────────────────────────
  { id: 6,  src: '/Gallery/dinar_aulia-crowd-5560458.jpg',      tag: 'Events',         title: 'Community Gathering',             desc: 'Our community comes together for a blessed gathering of worship and learning.' },
  { id: 7,  src: '/Gallery/its_nature_p-v-ramadan-8678086.png', tag: 'Events',         title: 'Ramadan Night Programme',         desc: 'Special Tarawih and Quran recitation events during the blessed month.' },
  { id: 14, src: '/Gallery/20Bangladesh-superJumbo.jpg',        tag: 'Events',         title: 'Bangladesh Islamic Gathering',    desc: 'A large community gathering celebrating faith and unity in Bangladesh.' },

  // ── Student Life ──────────────────────────────────────────────────────────
  { id: 8,  src: '/Gallery/cuivie-morocco-357301.jpg',          tag: 'Student Life',   title: 'Islamic Architecture & Campus',   desc: 'The serene environment of our madrasa inspires learning and reflection.' },
  { id: 9,  src: '/Gallery/saurabh_x_pro-islam-8744847.jpg',    tag: 'Student Life',   title: 'Campus Life & Brotherhood',       desc: 'Students building lifelong bonds of Islamic brotherhood on campus.' },
  { id: 15, src: '/Gallery/Madrasa.webp',                       tag: 'Student Life',   title: 'Madrasa Campus',                  desc: 'The heart of our institution where students live, learn and grow together.' },
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
