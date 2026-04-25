import { useState } from 'react';
import { contactService } from '../services';
import { useLang } from '../context/LanguageContext';

export default function AdmissionPage() {
  const { t } = useLang();

  const programs = [
    {
      icon: 'auto_stories',
      title: t('admissionProgram1Title'),
      desc: t('admissionProgram1Desc'),
      tags: [t('admissionProgram1Tag1'), t('admissionProgram1Tag2')],
      bg: 'bg-primary-container text-on-primary',
      iconBg: 'bg-white/10',
      span: 'md:col-span-8',
    },
    {
      icon: 'school',
      title: t('admissionProgram2Title'),
      desc: t('admissionProgram2Desc'),
      tags: [t('admissionProgram2Tag1')],
      bg: 'bg-surface-base',
      iconBg: 'bg-secondary-container',
      span: 'md:col-span-4',
    },
  ];

  const requirements = [
    { num: '01', title: t('admissionReq1Title'), desc: t('admissionReq1Desc') },
    { num: '02', title: t('admissionReq2Title'), desc: t('admissionReq2Desc') },
    { num: '03', title: t('admissionReq3Title'), desc: t('admissionReq3Desc') },
    { num: '04', title: t('admissionReq4Title'), desc: t('admissionReq4Desc') },
  ];

  const facilities = [
    { icon: 'local_library', title: t('admissionFac1Title'), desc: t('admissionFac1Desc'), img: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&q=80' },
    { icon: 'bed',           title: t('admissionFac2Title'), desc: t('admissionFac2Desc'), img: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&q=80' },
    { icon: 'architecture',  title: t('admissionFac3Title'), desc: t('admissionFac3Desc'), img: 'https://images.unsplash.com/photo-1681140965121-a9e3689e28c3?w=800&q=80' },
  ];

  const contactInfo = [
    { icon: 'call',        label: t('admissionContactPhone'),   value: '+880 1711 234567' },
    { icon: 'mail',        label: t('admissionContactEmail'),   value: 'info@madinatul-ulum.edu.bd' },
    { icon: 'location_on', label: t('admissionContactAddress'), value: 'Barishal, Bangladesh' },
    { icon: 'schedule',    label: t('admissionContactHours'),   value: t('admissionContactHoursVal') },
  ];

  const [form, setForm]       = useState({ name: '', email: '', phone: '', program: t('admissionProgram1Title'), message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess(false); setLoading(true);
    try {
      await contactService.send({
        name:    form.name,
        email:   form.email,
        message: `Admission Inquiry\nProgram: ${form.program}\nPhone: ${form.phone}\n\n${form.message}`,
      });
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', program: t('admissionProgram1Title'), message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="w-full max-w-container-max mx-auto px-4 md:px-6 pt-20 pb-12">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold font-manrope text-primary">{t('admissionHeroTitle')}</h1>
            <p className="text-lg text-text-muted max-w-2xl font-inter">{t('admissionHeroDesc')}</p>
          </div>
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-primary-container/5 rounded-2xl transform translate-x-4 translate-y-4" />
            <img
              src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80"
              alt="Students at Islamic school"
              className="w-full h-80 object-cover rounded-2xl shadow-ambient relative z-10"
            />
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="bg-surface-container-low py-20">
        <div className="max-w-container-max mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold font-manrope text-primary mb-3">{t('admissionProgramsTitle')}</h2>
            <p className="text-base text-text-muted font-inter">{t('admissionProgramsDesc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {programs.map(({ icon, title, desc, tags, bg, iconBg, span }) => (
              <div key={title} className={`${span} ${bg} rounded-2xl p-8 shadow-ambient border border-border-subtle relative overflow-hidden`}>
                <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-6`}>
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <h3 className="text-xl font-semibold font-manrope mb-3">{title}</h3>
                <p className="text-base opacity-80 mb-6 font-inter">{desc}</p>
                <div className="flex flex-wrap gap-3">
                  {tags.map((tag) => (
                    <span key={tag} className="bg-surface-container px-4 py-1.5 rounded-full text-xs font-semibold text-text-primary font-inter">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
            <div className="md:col-span-12 bg-primary-container rounded-2xl p-8 shadow-ambient flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-secondary-fixed">join_inner</span>
                  <h3 className="text-xl font-semibold font-manrope text-white">{t('admissionCombinedTitle')}</h3>
                </div>
                <p className="text-base text-emerald-50/80 max-w-3xl font-inter">{t('admissionCombinedDesc')}</p>
              </div>
              <a
                href="#apply"
                className="flex-shrink-0 bg-secondary-container text-on-secondary-container px-6 py-3 rounded-xl font-semibold font-inter hover:bg-secondary-fixed transition-colors"
              >
                {t('admissionApplyNow')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="max-w-container-max mx-auto px-4 md:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="lg:sticky lg:top-24">
            <h2 className="text-3xl font-bold font-manrope text-primary mb-6">{t('admissionReqTitle')}</h2>
            <p className="text-base text-text-muted mb-8 font-inter">{t('admissionReqDesc')}</p>
            <div className="hidden lg:block w-full h-64 rounded-2xl overflow-hidden shadow-ambient">
              <img src="https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&q=80" alt="Quran students studying" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="space-y-4">
            {requirements.map(({ num, title, desc }) => (
              <div key={num} className="bg-surface-base p-6 rounded-xl border border-border-subtle shadow-sm flex gap-4 items-start">
                <div className="bg-surface-container w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-semibold text-primary font-inter">{num}</span>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-primary mb-1 font-inter">{title}</h4>
                  <p className="text-sm text-text-muted font-inter">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="bg-surface-container-low py-20 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-fixed-dim/20 rounded-full blur-3xl" />
        <div className="max-w-container-max mx-auto px-4 md:px-6 relative z-10">
          <div className="mb-12">
            <h2 className="text-3xl font-bold font-manrope text-primary mb-3">{t('admissionFacilitiesTitle')}</h2>
            <p className="text-base text-text-muted max-w-2xl font-inter">{t('admissionFacilitiesDesc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {facilities.map(({ icon, title, desc, img }) => (
              <div key={title} className="bg-surface-base rounded-2xl overflow-hidden shadow-ambient border border-white/50">
                <img src={img} alt={title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2 font-manrope">
                    <span className="material-symbols-outlined text-secondary">{icon}</span>
                    {title}
                  </h4>
                  <p className="text-sm text-text-muted font-inter">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Inquiry Form */}
      <section id="apply" className="max-w-container-max mx-auto px-4 md:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold font-manrope text-primary mb-3">{t('admissionFormTitle')}</h2>
              <p className="text-base text-text-muted font-inter">{t('admissionFormDesc')}</p>
            </div>
            <div className="space-y-4">
              {contactInfo.map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-4 bg-surface-base p-4 rounded-xl border border-border-subtle shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container flex-shrink-0">
                    <span className="material-symbols-outlined text-sm">{icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider font-inter">{label}</p>
                    <p className="text-base text-primary font-inter mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-surface-base rounded-2xl shadow-ambient border border-border-subtle p-8">
            <h3 className="text-xl font-semibold font-manrope text-primary-container mb-6 border-b border-border-subtle pb-4">
              {t('admissionInquiryTitle')}
            </h3>

            {success && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-success-green rounded-lg px-4 py-3 mb-6 font-inter text-sm">
                <span className="material-symbols-outlined">check_circle</span>
                {t('admissionSuccess')}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-error rounded-lg px-4 py-3 mb-6 font-inter text-sm">
                <span className="material-symbols-outlined">error</span>{error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wider font-inter">{t('admissionLabelName')}</label>
                  <input
                    type="text" required
                    placeholder={t('admissionPlaceholderName')}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none font-inter text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wider font-inter">{t('admissionLabelPhone')}</label>
                  <input
                    type="tel" required
                    placeholder="+880 1XXX XXXXXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none font-inter text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wider font-inter">{t('admissionLabelEmail')}</label>
                <input
                  type="email" required
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none font-inter text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wider font-inter">{t('admissionLabelProgram')}</label>
                <select
                  value={form.program}
                  onChange={(e) => setForm({ ...form, program: e.target.value })}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none font-inter text-sm"
                >
                  <option>{t('admissionProgram1Title')}</option>
                  <option>{t('admissionProgram2Title')}</option>
                  <option>{t('admissionCombinedTitle')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wider font-inter">{t('admissionLabelMessage')}</label>
                <textarea
                  rows={4}
                  placeholder={t('admissionPlaceholderMsg')}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none font-inter text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-container text-white py-4 rounded-lg font-semibold hover:bg-primary transition-colors flex items-center justify-center gap-2 font-inter disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{t('admissionSubmitting')}</>
                  : <><span className="material-symbols-outlined">send</span>{t('admissionSubmit')}</>
                }
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
