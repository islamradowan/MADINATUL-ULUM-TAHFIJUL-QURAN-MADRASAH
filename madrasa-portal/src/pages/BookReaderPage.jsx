import { useParams, useNavigate, Link } from 'react-router-dom';
import { BOOKS } from './IslamicLibraryPage';
import { useLang } from '../context/LanguageContext';
import { PATHS } from '../routes/paths';

function resolveBook(bookId) {
  if (bookId.includes('--vol-')) {
    const [baseId, volPart] = bookId.split('--vol-');
    const volIndex = parseInt(volPart, 10);
    const book = BOOKS.find((b) => b.id === baseId);
    if (!book) return null;
    const vol = book.volumes[volIndex];
    if (!vol) return null;
    return { title: `${book.title} — ${vol.label}`, author: book.author, icon: book.icon, url: vol.url };
  }
  const book = BOOKS.find((b) => b.id === bookId);
  if (!book) return null;
  return { title: book.title, author: book.author, icon: book.icon, url: book.volumes[0].url };
}

export default function BookReaderPage() {
  const { bookId } = useParams();
  const { t } = useLang();
  const navigate = useNavigate();
  const resolved = resolveBook(bookId);

  if (!resolved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <span className="material-symbols-outlined text-6xl text-outline">menu_book</span>
        <p className="text-text-muted font-inter">{t('libraryNotFound')}</p>
        <Link to={PATHS.LIBRARY} className="text-primary font-semibold hover:underline font-inter">
          ← {t('libraryBackBtn')}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-alt px-6">
      <div className="bg-surface-base rounded-2xl shadow-ambient border border-border-subtle p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-4xl text-primary">{resolved.icon}</span>
        </div>
        <h2 className="text-xl font-bold text-primary font-manrope mb-1 leading-snug">{resolved.title}</h2>
        <p className="text-sm text-text-muted font-inter mb-8">{resolved.author}</p>

        <a
          href={resolved.url}
          download
          className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold font-inter hover:bg-primary/90 transition-colors mb-3"
        >
          <span className="material-symbols-outlined text-base">download</span>
          PDF ডাউনলোড করুন
        </a>

        <button
          onClick={() => navigate(PATHS.LIBRARY)}
          className="w-full inline-flex items-center justify-center gap-2 bg-surface-container text-on-surface-variant py-3 rounded-xl font-semibold font-inter hover:bg-surface-container-high transition-colors text-sm"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          {t('libraryBackBtn')}
        </button>
      </div>
    </div>
  );
}
