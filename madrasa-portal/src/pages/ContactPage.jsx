import { useState } from 'react';
import { contactService } from '../services';
import { useLang } from '../context/LanguageContext';

export default function ContactPage() {
  const { t } = useLang();

  const SUBJECTS = [
    t('contactSubject1'),
    t('contactSubject2'),
    t('contactSubject3'),
    t('contactSubject4'),
    t('contactSubject5'),
    t('contactSubject6'),
  ];

  const contactInfo = [
    { icon: 'location_on', label: t('contactAddress'),     value: 'Barishal, Bangladesh' },
    { icon: 'call',        label: t('contactPhone'),       value: '+880 1711 234567' },
    { icon: 'mail',        label: t('contactEmail'),       value: 'info@madinatul-ulum.edu.bd' },
    { icon: 'schedule',    label: t('contactOfficeHours'), value: t('contactOfficeHoursVal') },
  ];

  const [form, setForm]       = useState({ name: '', email: '', phone: '', subject: SUBJECTS[0], message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(false); setLoading(true);
    try {
      await contactService.send({
        name:    form.name,
        email:   form.email,
        message: `Subject: ${form.subject}\nPhone: ${form.phone || 'Not provided'}\n\n${form.message}`,
      });
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: SUBJECTS[0], message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 w-full max-w-container-max mx-auto px-4 md:px-6 py-16">
      <main className="flex-1 w-full">
        <div className="mb-12 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold font-manrope text-on-surface mb-4">{t('contactHeroTitle')}</h1>
          <p className="text-lg text-text-muted font-inter">{t('contactHeroDesc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Contact Info */}
          <div className="lg:col-span-4 bg-surface-base rounded-xl shadow-ambient p-8 flex flex-col border border-border-subtle/50 relative overflow-hidden">
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-xl font-semibold font-manrope text-on-surface mb-6">{t('contactInfoTitle')}</h2>
            <div className="space-y-6 flex-1">
              {contactInfo.map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-alt text-secondary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">{icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1 font-inter">{label}</h3>
                    <p className="text-base text-text-primary font-inter whitespace-pre-line">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-8 bg-surface-base rounded-xl shadow-ambient p-8 border border-border-subtle/50">
            <h2 className="text-xl font-semibold font-manrope text-on-surface mb-6">{t('contactFormTitle')}</h2>

            {success && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-success-green rounded-lg px-4 py-3 mb-6 font-inter text-sm">
                <span className="material-symbols-outlined">check_circle</span>
                {t('contactSuccess')}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-error rounded-lg px-4 py-3 mb-6 font-inter text-sm">
                <span className="material-symbols-outlined">error</span>{error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-inter">{t('contactLabelName')}</label>
                  <input
                    type="text" required
                    placeholder={t('contactPlaceholderName')}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-surface-alt border border-border-subtle rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-base text-text-primary transition-colors w-full font-inter"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-inter">{t('contactLabelPhone')}</label>
                  <input
                    type="tel"
                    placeholder="+880 1XXX XXXXXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="bg-surface-alt border border-border-subtle rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-base text-text-primary transition-colors w-full font-inter"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-inter">{t('contactLabelEmail')}</label>
                <input
                  type="email" required
                  placeholder={t('contactPlaceholderEmail')}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-surface-alt border border-border-subtle rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-base text-text-primary transition-colors w-full font-inter"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-inter">{t('contactLabelSubject')}</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="bg-surface-alt border border-border-subtle rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-base text-text-primary transition-colors w-full font-inter"
                >
                  {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-inter">{t('contactLabelMessage')}</label>
                <textarea
                  rows={5} required
                  placeholder={t('contactPlaceholderMsg')}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="bg-surface-alt border border-border-subtle rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-base text-text-primary transition-colors w-full resize-y font-inter"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit" disabled={loading}
                  className="bg-primary text-on-primary text-base py-3 px-8 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 font-medium font-inter disabled:opacity-60"
                >
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{t('contactSending')}</>
                    : <><span className="material-symbols-outlined text-sm">send</span>{t('contactSend')}</>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Map */}
        <div className="w-full rounded-xl shadow-ambient overflow-hidden h-80 border border-border-subtle/50">
          <iframe
            title="Madinatul Ulum Tahfijul Quran Madrasah Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117964.38765!2d90.3298!3d22.7010!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3754f0000000001%3A0x1!2sBarishal%2C+Bangladesh!5e0!3m2!1sen!2sbd!4v1"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </main>
    </div>
  );
}
